import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/core/db/db";
import { chatMessage, chatThread, usageEvent } from "@/core/db/db.schema";

function isMissingDatabaseFieldError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("column") ||
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("failed query")
  );
}

export async function getViewerAnalyticsSummary(userId: string) {
  try {
    const [threadStats] = await db
      .select({
        count: count(chatThread.id),
      })
      .from(chatThread)
      .where(and(eq(chatThread.userId, userId), isNull(chatThread.deletedAt)));

    const [messageStats] = await db
      .select({
        count: count(chatMessage.id),
      })
      .from(chatMessage)
      .innerJoin(chatThread, eq(chatThread.id, chatMessage.threadId))
      .where(and(eq(chatThread.userId, userId), isNull(chatThread.deletedAt)));

    const [usageStats] = await db
      .select({
        totalPromptTokens: sql<number>`coalesce(sum(${usageEvent.promptTokens}), 0)`,
        totalCompletionTokens: sql<number>`coalesce(sum(${usageEvent.completionTokens}), 0)`,
        totalTokens: sql<number>`coalesce(sum(${usageEvent.totalTokens}), 0)`,
        totalCreditCost: sql<number>`coalesce(sum(${usageEvent.creditCost}), 0)`,
      })
      .from(usageEvent)
      .where(eq(usageEvent.userId, userId));

    const latestEvents = await db.query.usageEvent.findMany({
      where: eq(usageEvent.userId, userId),
      orderBy: desc(usageEvent.createdAt),
      limit: 20,
    });

    return {
      threadsCount: threadStats?.count ?? 0,
      messagesCount: messageStats?.count ?? 0,
      totalPromptTokens: Number(usageStats?.totalPromptTokens ?? 0),
      totalCompletionTokens: Number(usageStats?.totalCompletionTokens ?? 0),
      totalTokens: Number(usageStats?.totalTokens ?? 0),
      totalCreditCost: Number(usageStats?.totalCreditCost ?? 0),
      recentEvents: latestEvents,
    };
  } catch (error) {
    if (isMissingDatabaseFieldError(error)) {
      return {
        threadsCount: 0,
        messagesCount: 0,
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalTokens: 0,
        totalCreditCost: 0,
        recentEvents: [],
      };
    }

    throw error;
  }
}
