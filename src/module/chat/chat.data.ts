export type ChatWorkspaceMessage = {
  key: string;
  from: "user" | "assistant";
  sources?: { href: string; title: string }[];
  versions: {
    id: string;
    content: string;
  }[];
  reasoning?: {
    content: string;
    duration?: number;
  };
  usage?: {
    completionTokens: number;
    creditCost: number;
    promptTokens: number;
    reasoningTokens: number;
    totalTokens: number;
  };
  metadata?: {
    model?: string;
    provider?: string;
    status?: string;
  };
};

export const CHAT_RECENT_THREADS_LIMIT = 9;
export const CHAT_ARCHIVED_THREADS_LIMIT = 5;

export const chatSuggestions = [
  "What are the latest trends in AI?",
  "How does machine learning work?",
  "Explain quantum computing",
  "Best practices for React development",
  "Tell me about TypeScript benefits",
  "How to optimize database queries?",
];
