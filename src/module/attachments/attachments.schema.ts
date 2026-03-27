import { z } from "zod/v3";

export const finalizeAttachmentInputSchema = z.object({
  threadId: z.string().uuid().optional(),
  messageId: z.string().uuid().optional(),
  mediaId: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(255),
  url: z.string().url(),
  mimeType: z.string().trim().min(1).max(255),
  sizeBytes: z.number().int().min(0),
});

export const listThreadAttachmentsInputSchema = z.object({
  threadId: z.string().uuid(),
});

export const deleteAttachmentInputSchema = z.object({
  attachmentId: z.string().uuid(),
});
