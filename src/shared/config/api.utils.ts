import type { ZodError } from "zod/v3";
import { debugError, debugLog, debugWarn } from "../utils/lib/logger.utils";
import { STATUS } from "./api.config";

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

export function API_RESPONSE<T>(
  status: "success" | "error" | "failed",
  message: string,
  data: T | null,
  error?: Error | null,
): {
  status: "success" | "error" | "failed";
  message: string;
  data: T | null;
} {
  if (status === "success") debugLog(`API:RESPONSE:${status}`, [message], JSON.stringify(data, null, 2));
  if (status === "failed") debugWarn(`API:RESPONSE:${status}`, [message], { data });
  if (status === "error") debugError(`API:RESPONSE:${status}`, [message], { error });
  return {
    status,
    message,
    data,
  };
}
