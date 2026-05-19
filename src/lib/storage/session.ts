import type { SessionUser } from "@/types/domain";

export type SessionPayload = {
  user: SessionUser;
  token?: string;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  rememberMe?: boolean;
};

const SESSION_KEY = "prototype:session";

export const sessionStorage = {
  read(): SessionPayload | null {
    try {
      const raw =
        localStorage.getItem(SESSION_KEY) ?? sessionStorage_mem.read();
      if (!raw) return null;
      return JSON.parse(raw) as SessionPayload;
    } catch {
      return null;
    }
  },

  save(payload: SessionPayload): void {
    try {
      const serialized = JSON.stringify(payload);
      if (payload.rememberMe) {
        localStorage.setItem(SESSION_KEY, serialized);
      } else {
        window.sessionStorage.setItem(SESSION_KEY, serialized);
      }
    } catch {}
  },

  clear(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  },
};

const sessionStorage_mem = {
  read(): string | null {
    return window.sessionStorage.getItem(SESSION_KEY);
  },
};
