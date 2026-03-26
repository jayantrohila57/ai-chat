/** Default placeholder when no image or on load error. Must exist in public/. */
export const PLACEHOLDER_IMAGE = "/fallback.png";

/**
 * Returns a safe image URL for display, or undefined so callers can show a placeholder.
 * Use this instead of String(value) to avoid passing "undefined"/"null" as src.
 * Safe to call from both server and client.
 */
export function getImageSrc(value?: string | null): string | undefined {
  if (value == null) return undefined;
  const s = typeof value === "string" ? value.trim() : "";
  if (!s || s === "undefined" || s === "null") return undefined;
  return s;
}
