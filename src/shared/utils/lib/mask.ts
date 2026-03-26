export function maskEmail(
  email: string,
  opts: {
    showFirst?: number; // how many characters at start to keep (default 1)
    showLast?: number; // how many characters at end to keep (default 0)
    maskChar?: string; // char to repeat for masking (default '*')
    minMaskLength?: number; // ensure at least this many mask chars (default 3)
  } = {},
): string {
  const { showFirst = 1, showLast = 0, maskChar = "*", minMaskLength = 3 } = opts;

  if (!email || typeof email !== "string") return "";

  const parts = email.split("@");
  if (parts.length < 2) return email; // not a valid email — return as-is

  const local = parts.slice(0, parts.length - 1).join("@"); // handle weird @ in display names
  const domain = parts[parts.length - 1];

  // If local is short, just mask it entirely
  if (local.length <= showFirst + showLast + 1) {
    const maskLen = Math.max(minMaskLength, 1);
    return `${maskChar.repeat(maskLen)}@${domain}`;
  }

  const start = local.slice(0, showFirst);
  const end = showLast > 0 ? local.slice(local.length - showLast) : "";
  const maskLen = Math.max(minMaskLength, local.length - (start.length + end.length));
  const mask = maskChar.repeat(maskLen);

  return `${start}${mask}${end}@${domain}`;
}
