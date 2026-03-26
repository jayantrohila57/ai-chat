import { useId } from "react";

/**
 * Generates a stable ID that won't change between server and client renders
 * This prevents hydration mismatches in Radix UI components
 */
export function useStableId(prefix?: string) {
  const reactId = useId();
  return prefix ? `${prefix}-${reactId}` : reactId;
}

/**
 * Creates a deterministic ID for a given context
 * Use this when you need predictable IDs across renders
 */
export function createDeterministicId(context: string, suffix?: string) {
  return `${context}${suffix ? `-${suffix}` : ""}`;
}
