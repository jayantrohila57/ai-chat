import { createTRPCRouter, customerProcedure, withApiSuccess } from "@/core/api/api.methods";
import {
  deleteAttachmentInputSchema,
  finalizeAttachmentInputSchema,
  listThreadAttachmentsInputSchema,
} from "./attachments.schema";
import { finalizeAttachment, listThreadAttachments, softDeleteAttachment } from "./attachments.service";

export const attachmentsRouter = createTRPCRouter({
  finalize: customerProcedure.input(finalizeAttachmentInputSchema).mutation(async ({ ctx, input }) =>
    withApiSuccess(
      await finalizeAttachment({
        userId: ctx.user.id,
        threadId: input.threadId,
        messageId: input.messageId,
        mediaId: input.mediaId,
        name: input.name,
        url: input.url,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
      }),
      "Attachment finalized successfully.",
    ),
  ),
  byThread: customerProcedure
    .input(listThreadAttachmentsInputSchema)
    .query(async ({ ctx, input }) =>
      withApiSuccess(await listThreadAttachments(ctx.user.id, input.threadId), "Attachments retrieved successfully."),
    ),
  delete: customerProcedure
    .input(deleteAttachmentInputSchema)
    .mutation(async ({ ctx, input }) =>
      withApiSuccess(await softDeleteAttachment(ctx.user.id, input.attachmentId), "Attachment deleted successfully."),
    ),
});
