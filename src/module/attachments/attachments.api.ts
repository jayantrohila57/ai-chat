import { createTRPCRouter, customerProcedure } from "@/core/api/api.methods";
import {
  deleteAttachmentInputSchema,
  finalizeAttachmentInputSchema,
  listThreadAttachmentsInputSchema,
} from "./attachments.schema";
import { finalizeAttachment, listThreadAttachments, softDeleteAttachment } from "./attachments.service";

export const attachmentsRouter = createTRPCRouter({
  finalize: customerProcedure.input(finalizeAttachmentInputSchema).mutation(async ({ ctx, input }) => {
    return finalizeAttachment({
      userId: ctx.user.id,
      threadId: input.threadId,
      messageId: input.messageId,
      mediaId: input.mediaId,
      name: input.name,
      url: input.url,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
    });
  }),
  byThread: customerProcedure.input(listThreadAttachmentsInputSchema).query(async ({ ctx, input }) => {
    return listThreadAttachments(ctx.user.id, input.threadId);
  }),
  delete: customerProcedure.input(deleteAttachmentInputSchema).mutation(async ({ ctx, input }) => {
    return softDeleteAttachment(ctx.user.id, input.attachmentId);
  }),
});
