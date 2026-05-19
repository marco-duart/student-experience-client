import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error as string | undefined;
    return message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
}
