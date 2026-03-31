import { z } from "zod/v3";

export const persistedMessageRoleSchema = z.enum(["system", "user", "assistant", "tool"]);
export const persistedMessageStatusSchema = z.enum(["pending", "streaming", "completed", "failed", "cancelled"]);

export const listThreadsInputSchema = z.object({
  archived: z.boolean().default(false),
  limit: z.number().int().min(1).max(100).default(50),
});

export const getThreadInputSchema = z.object({
  threadId: z.string().uuid(),
});

export const createThreadInputSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  model: z.string().trim().min(1).max(120).optional(),
});

export const renameThreadInputSchema = z.object({
  threadId: z.string().uuid(),
  title: z.string().trim().min(1).max(120),
});

export const archiveThreadInputSchema = z.object({
  threadId: z.string().uuid(),
});

export const restoreThreadInputSchema = z.object({
  threadId: z.string().uuid(),
});

export const finalizeAssistantMessageInputSchema = z.object({
  threadId: z.string().uuid(),
  messageId: z.string().uuid(),
  content: z.string(),
  reasoning: z.string().optional(),
  reasoningTokens: z.number().int().min(0).optional(),
  promptTokens: z.number().int().min(0),
  completionTokens: z.number().int().min(0),
  totalTokens: z.number().int().min(0),
  creditCost: z.number().int().min(0),
  provider: z.string().optional(),
  model: z.string().optional(),
  status: persistedMessageStatusSchema.default("completed"),
});
