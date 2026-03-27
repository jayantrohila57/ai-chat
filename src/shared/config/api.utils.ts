import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import type { ZodError } from "zod/v3";
import { debugError, debugLog, debugWarn } from "../utils/lib/logger.utils";
import { STATUS } from "./api.config";

export type AppApiStatus = "success" | "failed" | "error";
export type AppApiErrorKind = "auth" | "validation" | "forbidden" | "not_found" | "conflict" | "rate_limit" | "server";

export type AppApiError = {
  code: string;
  kind: AppApiErrorKind;
  fieldErrors?: Record<string, string[]>;
  retryable?: boolean;
};

export type AppApiResponse<T> = {
  ok: boolean;
  status: AppApiStatus;
  message: string;
  data: T | null;
  error: AppApiError | null;
};

export const prettyZodError = (error: ZodError) => {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".") || "root";
      return `${path}: ${issue.message}`;
    })
    .join("\n");
};

export const zodErrorObject = (error: ZodError) => {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root";
    if (!formatted[key]) formatted[key] = [];
    formatted[key].push(issue.message);
  }
  return formatted;
};

export function mapTrpcCodeToApiKind(code: string | null | undefined): AppApiErrorKind {
  switch (code) {
    case "UNAUTHORIZED":
      return "auth";
    case "FORBIDDEN":
      return "forbidden";
    case "NOT_FOUND":
      return "not_found";
    case "CONFLICT":
    case "PRECONDITION_FAILED":
      return "conflict";
    case "BAD_REQUEST":
    case "PARSE_ERROR":
      return "validation";
    case "TOO_MANY_REQUESTS":
      return "rate_limit";
    default:
      return "server";
  }
}

export function buildApiError(input: {
  code: string;
  kind?: AppApiErrorKind;
  fieldErrors?: Record<string, string[]>;
  retryable?: boolean;
}): AppApiError {
  return {
    code: input.code,
    kind: input.kind ?? mapTrpcCodeToApiKind(input.code),
    fieldErrors: input.fieldErrors,
    retryable: input.retryable ?? (input.kind === "rate_limit" || input.kind === "server"),
  };
}

export function apiSuccess<T>(data: T, message = "Request completed successfully"): AppApiResponse<T> {
  const response = {
    ok: true,
    status: STATUS.SUCCESS,
    message,
    data,
    error: null,
  } satisfies AppApiResponse<T>;

  debugLog(`API:RESPONSE:${response.status}`, [message], JSON.stringify(data, null, 2));
  return response;
}

export function apiFailure<T>(input: {
  message: string;
  code: string;
  kind?: AppApiErrorKind;
  data?: T | null;
  fieldErrors?: Record<string, string[]>;
  retryable?: boolean;
  status?: Extract<AppApiStatus, "failed" | "error">;
}): AppApiResponse<T> {
  const response = {
    ok: false,
    status: input.status ?? (input.kind === "validation" ? STATUS.FAILED : STATUS.ERROR),
    message: input.message,
    data: input.data ?? null,
    error: buildApiError({
      code: input.code,
      kind: input.kind,
      fieldErrors: input.fieldErrors,
      retryable: input.retryable,
    }),
  } satisfies AppApiResponse<T>;

  if (response.status === STATUS.FAILED) {
    debugWarn(`API:RESPONSE:${response.status}`, [input.message], { data: response.data, error: response.error });
  } else {
    debugError(`API:RESPONSE:${response.status}`, [input.message], { error: response.error });
  }

  return response;
}

export function jsonSuccess<T>(data: T, message = "Request completed successfully", status = 200) {
  return Response.json(apiSuccess(data, message), { status });
}

export function jsonFailure(input: {
  message: string;
  code: string;
  kind?: AppApiErrorKind;
  data?: unknown;
  fieldErrors?: Record<string, string[]>;
  retryable?: boolean;
  httpStatus?: number;
  status?: Extract<AppApiStatus, "failed" | "error">;
}) {
  return Response.json(
    apiFailure({
      message: input.message,
      code: input.code,
      kind: input.kind,
      data: input.data,
      fieldErrors: input.fieldErrors,
      retryable: input.retryable,
      status: input.status,
    }),
    { status: input.httpStatus ?? 500 },
  );
}

export function extractAppApiError(error: unknown): AppApiError | null {
  if (!error || typeof error !== "object") return null;

  const maybeError = error as {
    error?: AppApiError | null;
    data?: { appError?: AppApiError | null; code?: string } | null;
  };

  if (maybeError.error && typeof maybeError.error === "object") {
    return maybeError.error;
  }

  if (maybeError.data?.appError && typeof maybeError.data.appError === "object") {
    return maybeError.data.appError;
  }

  if (maybeError.data?.code) {
    return buildApiError({ code: maybeError.data.code });
  }

  return null;
}

export function extractAppApiMessage(input: unknown, fallback = "Something went wrong") {
  if (!input) return fallback;

  if (typeof input === "string") return input;

  if (typeof input === "object") {
    const maybeInput = input as { message?: string; data?: { zodError?: { fieldErrors?: Record<string, string[]> } } };
    if (typeof maybeInput.message === "string" && maybeInput.message.trim().length > 0) {
      return maybeInput.message;
    }
  }

  return fallback;
}

export function isAuthApiError(error: unknown) {
  const appError = extractAppApiError(error);
  return appError?.kind === "auth";
}

export function isForbiddenApiError(error: unknown) {
  const appError = extractAppApiError(error);
  return appError?.kind === "forbidden";
}

export function isRetryableApiError(error: unknown) {
  const appError = extractAppApiError(error);
  return appError?.retryable ?? false;
}

export function API_RESPONSE<T>(
  status: "success" | "error" | "failed",
  message: string,
  data: T | null,
  error?: Error | null,
): AppApiResponse<T> {
  if (status === STATUS.SUCCESS) return apiSuccess(data as T, message);

  return apiFailure({
    message,
    code: error?.name ?? "INTERNAL_SERVER_ERROR",
    data,
    status,
  });
}
