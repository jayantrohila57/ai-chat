import { createTRPCRouter, customerProcedure } from "@/core/api/api.methods";
import {
  createThreadInputSchema,
  deleteThreadInputSchema,
  getThreadInputSchema,
  listThreadsInputSchema,
  renameThreadInputSchema,
} from "./chat.schema";
import { createThread, getThread, listThreads, renameThread, softDeleteThread } from "./chat.service";

export const chatRouter = createTRPCRouter({
  list: customerProcedure.input(listThreadsInputSchema).query(async ({ ctx, input }) => {
    return listThreads(ctx.user.id, input.limit);
  }),
  get: customerProcedure.input(getThreadInputSchema).query(async ({ ctx, input }) => {
    return getThread(ctx.user.id, input.threadId);
  }),
  create: customerProcedure.input(createThreadInputSchema).mutation(async ({ ctx, input }) => {
    return createThread({
      userId: ctx.user.id,
      title: input.title,
      model: input.model,
    });
  }),
  rename: customerProcedure.input(renameThreadInputSchema).mutation(async ({ ctx, input }) => {
    return renameThread({
      userId: ctx.user.id,
      threadId: input.threadId,
      title: input.title,
    });
  }),
  delete: customerProcedure.input(deleteThreadInputSchema).mutation(async ({ ctx, input }) => {
    return softDeleteThread({
      userId: ctx.user.id,
      threadId: input.threadId,
    });
  }),
});
