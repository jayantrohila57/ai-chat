import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/core/db/db";
import { chatAttachment, chatThread } from "@/core/db/db.schema";
import { serverEnv } from "@/shared/config/env.server";

function createId() {
  return crypto.randomUUID();
}

export async function finalizeAttachment(input: {
  userId: string;
  threadId?: string;
  messageId?: string;
  mediaId?: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}) {
  if (input.sizeBytes > serverEnv.MAX_UPLOAD_FILE_SIZE_BYTES) {
    throw new TRPCError({
      code: "PAYLOAD_TOO_LARGE",
      message: `File exceeds the ${serverEnv.MAX_UPLOAD_FILE_SIZE_BYTES} byte limit`,
    });
  }

  if (input.threadId) {
    const thread = await db.query.chatThread.findFirst({
      where: and(eq(chatThread.id, input.threadId), eq(chatThread.userId, input.userId)),
    });

    if (!thread) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found for attachment" });
    }
  }

  const id = createId();

  await db.insert(chatAttachment).values({
    id,
    userId: input.userId,
    threadId: input.threadId ?? null,
    messageId: input.messageId ?? null,
    mediaId: input.mediaId ?? null,
    name: input.name,
    url: input.url,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    status: input.messageId ? "attached" : "uploaded",
  });

  const attachment = await db.query.chatAttachment.findFirst({
    where: eq(chatAttachment.id, id),
  });

  if (!attachment) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to persist attachment" });
  }

  return attachment;
}

export async function listThreadAttachments(userId: string, threadId: string) {
  return db.query.chatAttachment.findMany({
    where: and(eq(chatAttachment.userId, userId), eq(chatAttachment.threadId, threadId)),
    orderBy: desc(chatAttachment.createdAt),
  });
}

export async function softDeleteAttachment(userId: string, attachmentId: string) {
  const attachment = await db.query.chatAttachment.findFirst({
    where: and(eq(chatAttachment.id, attachmentId), eq(chatAttachment.userId, userId)),
  });

  if (!attachment) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Attachment not found" });
  }

  await db
    .update(chatAttachment)
    .set({
      status: "deleted",
    })
    .where(eq(chatAttachment.id, attachmentId));

  return {
    ok: true,
    attachmentId,
  };
}
