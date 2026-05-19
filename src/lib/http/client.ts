import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import type { ApiResult } from "@/types/domain";
import { env } from "@/configs/env";

let authToken: string | null = null;
let refreshHandler: (() => Promise<boolean>) | null = null;
let authFailureHandler:
  | ((context: {
      status: number;
      code?: string;
      message?: string;
    }) => Promise<void> | void)
  | null = null;
let refreshInFlight: Promise<boolean> | null = null;

type RequestConfig = AxiosRequestConfig & {
  skipAuthRefresh?: boolean;
  _retry?: boolean;
};

const statusMessages: Record<number, string> = {
  400: "Dados inválidos.",
  401: "Sessão inválida.",
  403: "Acesso negado.",
  404: "Recurso não encontrado.",
  500: "Problema com nossos servidores.",
  503: "Serviço indisponível no momento.",
};

const extractMessage = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const itemMessage = extractMessage(item);
      if (itemMessage) return itemMessage;
    }
    return undefined;
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of ["message", "error", "detail", "description"]) {
      const nestedMessage = extractMessage(obj[key]);
      if (nestedMessage) return nestedMessage;
    }

    for (const nestedValue of Object.values(obj)) {
      const nestedMessage = extractMessage(nestedValue);
      if (nestedMessage) return nestedMessage;
    }
  }

  return undefined;
};

const client: AxiosInstance = axios.create({
  baseURL: env.BASE_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<Record<string, unknown>>) => {
    const config = (error.config ?? {}) as RequestConfig;
    const status = error.response?.status;
    const message = extractMessage(error.response?.data?.message);
    const errorCode = error.response?.data?.error_code
      ? String(error.response.data.error_code)
      : undefined;

    if (
      status === 401 &&
      !config.skipAuthRefresh &&
      !config._retry &&
      refreshHandler
    ) {
      config._retry = true;
      refreshInFlight ??= refreshHandler().finally(() => {
        refreshInFlight = null;
      });

      const refreshed = await refreshInFlight;

      if (refreshed) {
        if (authToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authToken}`,
          };
        }
        return client.request(config);
      }
    }

    if (status === 401 && authFailureHandler) {
      await authFailureHandler({ status, code: errorCode, message });
    }

    return Promise.reject(error);
  },
);

const normalizeSuccess = <T>(
  status: number,
  data: Record<string, unknown>,
): ApiResult<T> => {
  const normalizedData = (data?.content ?? data ?? null) as T | null;
  const message =
    extractMessage(data?.message) ??
    statusMessages[status] ??
    "Operação concluída.";
  return { success: true, status, message, data: normalizedData };
};

const normalizeError = <T>(
  error: AxiosError<Record<string, unknown>>,
): ApiResult<T> => {
  if (!error.response) {
    return {
      success: false,
      status: 503,
      message: statusMessages[503],
      data: null,
    };
  }

  const { status, data } = error.response;
  const message =
    extractMessage(data?.message) ??
    extractMessage(data?.error) ??
    extractMessage(data?.detail) ??
    statusMessages[status] ??
    "Erro desconhecido.";
  const errorCode = data?.error_code ? String(data.error_code) : undefined;

  return { success: false, status, message, data: null, errorCode };
};

export const httpClient = {
  setToken(token?: string | null) {
    authToken = token ?? null;
  },

  setRefreshHandler(handler: (() => Promise<boolean>) | null) {
    refreshHandler = handler;
  },

  setAuthFailureHandler(
    handler:
      | ((ctx: {
          status: number;
          code?: string;
          message?: string;
        }) => void | Promise<void>)
      | null,
  ) {
    authFailureHandler = handler;
  },

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
    try {
      const res = await client.get<Record<string, unknown>>(url, config);
      return normalizeSuccess<T>(res.status, res.data);
    } catch (e) {
      return normalizeError<T>(e as AxiosError<Record<string, unknown>>);
    }
  },

  async post<T>(
    url: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResult<T>> {
    try {
      const res = await client.post<Record<string, unknown>>(url, body, config);
      return normalizeSuccess<T>(res.status, res.data);
    } catch (e) {
      return normalizeError<T>(e as AxiosError<Record<string, unknown>>);
    }
  },

  async put<T>(
    url: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResult<T>> {
    try {
      const res = await client.put<Record<string, unknown>>(url, body, config);
      return normalizeSuccess<T>(res.status, res.data);
    } catch (e) {
      return normalizeError<T>(e as AxiosError<Record<string, unknown>>);
    }
  },

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
    try {
      const res = await client.delete<Record<string, unknown>>(url, config);
      return normalizeSuccess<T>(res.status, res.data);
    } catch (e) {
      return normalizeError<T>(e as AxiosError<Record<string, unknown>>);
    }
  },

  async postFormData<T>(url: string, form: FormData): Promise<ApiResult<T>> {
    try {
      const res = await client.post<Record<string, unknown>>(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return normalizeSuccess<T>(res.status, res.data);
    } catch (e) {
      return normalizeError<T>(e as AxiosError<Record<string, unknown>>);
    }
  },
};
