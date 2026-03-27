import { TRPCError } from "@trpc/server";
import type { UIMessage } from "ai";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/core/db/db";
import { chatMessage, chatThread, usageEvent } from "@/core/db/db.schema";
import { extractPlainTextFromMessage } from "@/module/ai/ai.tokens";

function createId() {
  return crypto.randomUUID();
}

export function deriveThreadTitle(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) return "Untitled chat";
  return normalized.slice(0, 80);
}

async function requireOwnedThread(userId: string, threadId: string) {
  const thread = await db.query.chatThread.findFirst({
    where: and(eq(chatThread.id, threadId), eq(chatThread.userId, userId), isNull(chatThread.deletedAt)),
  });

  if (!thread) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Chat thread not found" });
  }

  return thread;
}

export async function listThreads(userId: string, limit = 50) {
  return db.query.chatThread.findMany({
    where: and(eq(chatThread.userId, userId), isNull(chatThread.deletedAt)),
    orderBy: desc(chatThread.lastMessageAt),
    limit,
  });
}

export async function createThread(input: { userId: string; title?: string; model?: string }) {
  const id = createId();
  const title = input.title?.trim() || "Untitled chat";

  await db.insert(chatThread).values({
    id,
    userId: input.userId,
    title,
    titleSource: input.title?.trim() ? "manual" : "auto",
    model: input.model,
  });

  return requireOwnedThread(input.userId, id);
}

export async function getThread(userId: string, threadId: string) {
  const thread = await requireOwnedThread(userId, threadId);
  const messages = await db.query.chatMessage.findMany({
    where: eq(chatMessage.threadId, threadId),
    orderBy: asc(chatMessage.createdAt),
  });

  return {
    thread,
    messages,
  };
}

export async function renameThread(input: { userId: string; threadId: string; title: string }) {
  await requireOwnedThread(input.userId, input.threadId);

  await db
    .update(chatThread)
    .set({
      title: input.title.trim(),
      titleSource: "manual",
    })
    .where(and(eq(chatThread.id, input.threadId), eq(chatThread.userId, input.userId)));

  await db.insert(usageEvent).values({
    id: createId(),
    userId: input.userId,
    threadId: input.threadId,
    eventType: "title_changed",
    status: "recorded",
  });

  return requireOwnedThread(input.userId, input.threadId);
}

export async function softDeleteThread(input: { userId: string; threadId: string }) {
  await requireOwnedThread(input.userId, input.threadId);

  await db
    .update(chatThread)
    .set({
      deletedAt: new Date(),
    })
    .where(and(eq(chatThread.id, input.threadId), eq(chatThread.userId, input.userId)));

  await db.insert(usageEvent).values({
    id: createId(),
    userId: input.userId,
    threadId: input.threadId,
    eventType: "thread_deleted",
    status: "recorded",
  });

  return {
    ok: true,
    threadId: input.threadId,
  };
}

export async function ensureThreadForRequest(input: {
  userId: string;
  threadId?: string | null;
  model?: string | null;
  latestUserMessage?: UIMessage | null;
}) {
  if (input.threadId) {
    const thread = await requireOwnedThread(input.userId, input.threadId);
    return thread;
  }

  return createThread({
    userId: input.userId,
    title: deriveThreadTitle(extractPlainTextFromMessage(input.latestUserMessage)),
    model: input.model ?? undefined,
  });
}

export async function persistUserMessage(input: {
  userId: string;
  threadId: string;
  message: UIMessage;
  model?: string | null;
}) {
  const existing = await db.query.chatMessage.findFirst({
    where: and(eq(chatMessage.threadId, input.threadId), eq(chatMessage.clientMessageId, input.message.id)),
  });

  if (existing) return existing;

  const content = extractPlainTextFromMessage(input.message);
  const id = createId();

  await db.insert(chatMessage).values({
    id,
    threadId: input.threadId,
    userId: input.userId,
    clientMessageId: input.message.id,
    role: "user",
    status: "completed",
    content,
    model: input.model ?? null,
    finishedAt: new Date(),
  });

  await db
    .update(chatThread)
    .set({
      lastMessageAt: new Date(),
    })
    .where(eq(chatThread.id, input.threadId));

  return db.query.chatMessage
    .findFirst({
      where: eq(chatMessage.id, id),
    })
    .then((message) => {
      if (!message) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to persist user message" });
      }

      return message;
    });
}

export async function createAssistantPlaceholder(input: {
  userId: string;
  threadId: string;
  provider?: string | null;
  model?: string | null;
}) {
  const id = createId();

  await db.insert(chatMessage).values({
    id,
    threadId: input.threadId,
    userId: input.userId,
    role: "assistant",
    status: "streaming",
    content: "",
    provider: input.provider ?? null,
    model: input.model ?? null,
  });

  await db.insert(usageEvent).values({
    id: createId(),
    userId: input.userId,
    threadId: input.threadId,
    messageId: id,
    eventType: "chat_started",
    provider: input.provider ?? null,
    model: input.model ?? null,
    status: "recorded",
  });

  return db.query.chatMessage
    .findFirst({
      where: eq(chatMessage.id, id),
    })
    .then((message) => {
      if (!message) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create assistant placeholder" });
      }

      return message;
    });
}

export async function finalizeAssistantMessage(input: {
  userId: string;
  threadId: string;
  messageId: string;
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  creditCost: number;
  provider?: string | null;
  model?: string | null;
  status?: "completed" | "cancelled";
}) {
  await requireOwnedThread(input.userId, input.threadId);

  await db
    .update(chatMessage)
    .set({
      status: input.status ?? "completed",
      content: input.content,
      promptTokens: input.promptTokens,
      completionTokens: input.completionTokens,
      totalTokens: input.totalTokens,
      creditCost: input.creditCost,
      provider: input.provider ?? null,
      model: input.model ?? null,
      finishedAt: new Date(),
      errorMessage: null,
    })
    .where(and(eq(chatMessage.id, input.messageId), eq(chatMessage.threadId, input.threadId)));

  await db
    .update(chatThread)
    .set({
      lastMessageAt: new Date(),
    })
    .where(eq(chatThread.id, input.threadId));

  await db.insert(usageEvent).values({
    id: createId(),
    userId: input.userId,
    threadId: input.threadId,
    messageId: input.messageId,
    eventType: input.status === "cancelled" ? "chat_cancelled" : "chat_completed",
    provider: input.provider ?? null,
    model: input.model ?? null,
    promptTokens: input.promptTokens,
    completionTokens: input.completionTokens,
    totalTokens: input.totalTokens,
    creditCost: input.creditCost,
    status: "recorded",
  });

  const message = await db.query.chatMessage.findFirst({
    where: eq(chatMessage.id, input.messageId),
  });

  if (!message) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Assistant message missing after finalize" });
  }

  const thread = await requireOwnedThread(input.userId, input.threadId);

  if (thread.titleSource !== "manual" && thread.title === "Untitled chat") {
    const replacementTitle = deriveThreadTitle(input.content);

    if (replacementTitle && replacementTitle !== "Untitled chat") {
      await db
        .update(chatThread)
        .set({
          title: replacementTitle,
          titleSource: "auto",
        })
        .where(eq(chatThread.id, input.threadId));
    }
  }

  return message;
}

export async function failAssistantMessage(input: {
  userId: string;
  threadId: string;
  messageId: string;
  errorMessage: string;
  provider?: string | null;
  model?: string | null;
}) {
  await db
    .update(chatMessage)
    .set({
      status: "failed",
      errorMessage: input.errorMessage,
      finishedAt: new Date(),
    })
    .where(and(eq(chatMessage.id, input.messageId), eq(chatMessage.threadId, input.threadId)));

  await db.insert(usageEvent).values({
    id: createId(),
    userId: input.userId,
    threadId: input.threadId,
    messageId: input.messageId,
    eventType: "chat_failed",
    provider: input.provider ?? null,
    model: input.model ?? null,
    status: "recorded",
    payload: input.errorMessage,
  });
}
