import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sessionStorage } from "@/lib/storage/session";
import type { SessionPayload } from "@/lib/storage/session";
import type { SessionUser, UserRole } from "@/types/domain";
import { accountService } from "@/services/user.service";
import { httpClient } from "@/lib/http/client";

type AuthState = {
  session: SessionPayload | null;
};

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type AuthContextValue = {
  user: SessionUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isBooting: boolean;
  login: (input: LoginInput) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: (nextUser: SessionUser) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};

const getNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const isExpired = (expiresAt?: string, safetyWindowMs = 30_000): boolean => {
  if (!expiresAt) return true;
  const parsed = Date.parse(expiresAt);
  if (Number.isNaN(parsed)) return true;
  return parsed <= Date.now() + safetyWindowMs;
};

const extractRoleFromResponse = (
  payload: Record<string, unknown>,
): UserRole => {
  const loginInfo = toRecord(payload.login_info);
  return (loginInfo.role as UserRole) || "customer";
};

const mapLoginResponseToSessionUser = (
  payload: Record<string, unknown>,
  role: UserRole,
): SessionUser => {
  const loginInfo = toRecord(payload.login_info);
  const address = toRecord(payload.address);
  const accountId = getNumber(loginInfo.id);
  const accountableTypeValue = loginInfo.accountable_type;
  const accountableType =
    accountableTypeValue === "Customer" || accountableTypeValue === "User"
      ? accountableTypeValue
      : undefined;

  return {
    id: accountId,
    profileId: accountId,
    name: String(payload.name ?? ""),
    email: String(payload.email ?? ""),
    phone: payload.phone ? String(payload.phone) : undefined,
    document: payload.document ? String(payload.document) : undefined,
    document_type: payload.document_type
      ? (String(payload.document_type) as "cpf" | "cnpj")
      : undefined,
    photo: payload.photo ? String(payload.photo) : undefined,
    role,
    accountableType,
    accountableId: loginInfo.accountable_id
      ? getNumber(loginInfo.accountable_id)
      : undefined,
    customerId: loginInfo.customer_id
      ? getNumber(loginInfo.customer_id)
      : undefined,
    coliseumUserId: loginInfo.coliseum_user_id
      ? getNumber(loginInfo.coliseum_user_id)
      : undefined,
    address: {
      street: address.street ? String(address.street) : undefined,
      district: address.district ? String(address.district) : undefined,
      zip_code: address.zip_code ? String(address.zip_code) : undefined,
      city: address.city ? String(address.city) : undefined,
      state: address.state ? String(address.state) : undefined,
      country: address.country ? String(address.country) : undefined,
      number: address.number ? String(address.number) : undefined,
      complement: address.complement ? String(address.complement) : undefined,
    },
  };
};

const buildSessionFromPayload = (
  payload: Record<string, unknown>,
): SessionPayload => {
  const role = extractRoleFromResponse(payload);
  const user = mapLoginResponseToSessionUser(payload, role);
  const accessToken = asOptionalString(payload.access_token ?? payload.token);

  return {
    user,
    token: accessToken,
    accessToken,
    accessTokenExpiresAt: asOptionalString(payload.access_token_expires_at),
    refreshToken: asOptionalString(payload.refresh_token),
    refreshTokenExpiresAt: asOptionalString(payload.refresh_token_expires_at),
    rememberMe: Boolean(payload.remember_me),
  };
};

const mergeRefreshedSession = (
  current: SessionPayload,
  payload: Record<string, unknown>,
): SessionPayload => {
  const accessToken = asOptionalString(payload.access_token ?? payload.token);
  return {
    ...current,
    token: accessToken,
    accessToken,
    accessTokenExpiresAt: asOptionalString(payload.access_token_expires_at),
    refreshToken:
      asOptionalString(payload.refresh_token) ?? current.refreshToken,
    refreshTokenExpiresAt:
      asOptionalString(payload.refresh_token_expires_at) ??
      current.refreshTokenExpiresAt,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null });
  const [isBooting, setIsBooting] = useState(true);

  const commitSession = useCallback(async (nextSession: SessionPayload) => {
    httpClient.setToken(nextSession.accessToken ?? nextSession.token);
    setState({ session: nextSession });
    sessionStorage.save(nextSession);
  }, []);

  const clearSession = useCallback(async () => {
    httpClient.setToken(null);
    setState({ session: null });
    sessionStorage.clear();
  }, []);

  const refreshSession = useCallback(
    async (currentSession: SessionPayload | null): Promise<boolean> => {
      if (!currentSession?.user || !currentSession.refreshToken) return false;

      const response = await accountService.refreshSession({
        refresh_token: currentSession.refreshToken,
      });

      if (!response.success || !response.data) return false;

      const payload = response.data as Record<string, unknown>;
      const nextSession = mergeRefreshedSession(currentSession, payload);
      await commitSession(nextSession);
      return true;
    },
    [commitSession],
  );

  useEffect(() => {
    const hydrate = async () => {
      const stored = sessionStorage.read();

      if (stored?.user) {
        const accessToken = stored.accessToken ?? stored.token;
        const nextSession = { ...stored, accessToken, token: accessToken };

        if (accessToken && !isExpired(stored.accessTokenExpiresAt)) {
          httpClient.setToken(accessToken);
          setState({ session: nextSession });
        } else if (!(await refreshSession(nextSession))) {
          await clearSession();
        }
      }

      setIsBooting(false);
    };

    hydrate();
  }, [clearSession, refreshSession]);

  useEffect(() => {
    httpClient.setRefreshHandler(async () => {
      const stored = sessionStorage.read();
      const currentSession = state.session ?? stored;
      return refreshSession(currentSession);
    });

    httpClient.setAuthFailureHandler(async () => {
      await clearSession();
    });

    return () => {
      httpClient.setRefreshHandler(null);
      httpClient.setAuthFailureHandler(null);
    };
  }, [clearSession, refreshSession, state.session]);

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await accountService.authenticate({
        email: input.email,
        password: input.password,
        remember_me: input.rememberMe,
      });

      if (!response.success || !response.data) {
        return { ok: false, message: response.message };
      }

      const payload = response.data as Record<string, unknown>;
      const nextSession = buildSessionFromPayload({
        ...payload,
        remember_me: input.rememberMe,
      });
      await commitSession(nextSession);
      return { ok: true, message: response.message };
    },
    [commitSession],
  );

  const logout = useCallback(async () => {
    const currentSession = state.session ?? sessionStorage.read();
    if (currentSession?.refreshToken) {
      await accountService.logout({
        refresh_token: currentSession.refreshToken,
      });
    }
    await clearSession();
  }, [clearSession, state.session]);

  const refreshUser = useCallback(
    async (nextUser: SessionUser) => {
      const currentSession = state.session;
      if (!currentSession) return;
      await commitSession({ ...currentSession, user: nextUser });
    },
    [commitSession, state.session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.session?.user ?? null,
      role: state.session?.user?.role ?? null,
      isAuthenticated: Boolean(state.session?.user),
      isBooting,
      login,
      logout,
      refreshUser,
    }),
    [state.session, isBooting, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
