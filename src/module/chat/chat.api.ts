import { createTRPCRouter, customerProcedure, withApiSuccess } from "@/core/api/api.methods";
import {
  createThreadInputSchema,
  deleteThreadInputSchema,
  getThreadInputSchema,
  listThreadsInputSchema,
  renameThreadInputSchema,
} from "./chat.schema";
import { createThread, getThread, listThreads, renameThread, softDeleteThread } from "./chat.service";

export const chatRouter = createTRPCRouter({
  list: customerProcedure
    .input(listThreadsInputSchema)
    .query(async ({ ctx, input }) =>
      withApiSuccess(await listThreads(ctx.user.id, input.limit), "Threads retrieved successfully."),
    ),
  get: customerProcedure
    .input(getThreadInputSchema)
    .query(async ({ ctx, input }) =>
      withApiSuccess(await getThread(ctx.user.id, input.threadId), "Thread retrieved successfully."),
    ),
  create: customerProcedure.input(createThreadInputSchema).mutation(async ({ ctx, input }) =>
    withApiSuccess(
      await createThread({
        userId: ctx.user.id,
        title: input.title,
        model: input.model,
      }),
      "Thread created successfully.",
    ),
  ),
  rename: customerProcedure.input(renameThreadInputSchema).mutation(async ({ ctx, input }) =>
    withApiSuccess(
      await renameThread({
        userId: ctx.user.id,
        threadId: input.threadId,
        title: input.title,
      }),
      "Thread renamed successfully.",
    ),
  ),
  delete: customerProcedure.input(deleteThreadInputSchema).mutation(async ({ ctx, input }) =>
    withApiSuccess(
      await softDeleteThread({
        userId: ctx.user.id,
        threadId: input.threadId,
      }),
      "Thread deleted successfully.",
    ),
  ),
});
