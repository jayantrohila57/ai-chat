export const CHAT_REASONING_LEVELS = ["low", "medium", "high"] as const;

export type ChatReasoningLevel = (typeof CHAT_REASONING_LEVELS)[number];

export function getReasoningLevelTemperature(level: ChatReasoningLevel) {
  switch (level) {
    case "low":
      return 0.2;
    case "high":
      return 0.8;
    default:
      return 0.5;
  }
}

export function formatReasoningLevelLabel(level: ChatReasoningLevel) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function deriveAutoThreadTitleFromText(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "Untitled chat";
  }

  return normalized.slice(0, 80);
}
