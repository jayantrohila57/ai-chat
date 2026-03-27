import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod/v3";
import { checkArcjet } from "@/app/api/auth/[...all]/arkjet.config";
import { getServerSession } from "@/core/auth/auth.server";
import { getChatModel } from "@/module/ai/ai.provider";
import {
  estimateCreditReservation,
  estimateTokenCount,
  estimateTokensFromMessages,
  extractPlainTextFromMessage,
} from "@/module/ai/ai.tokens";
import {
  createAssistantPlaceholder,
  ensureThreadForRequest,
  failAssistantMessage,
  finalizeAssistantMessage,
  persistUserMessage,
} from "@/module/chat/chat.service";
import {
  ensureWalletForUser,
  grantStarterCreditsIfEligible,
  reserveCredits,
  settleReservedCredits,
} from "@/module/credits/credits.service";
import { serverEnv } from "@/shared/config/env.server";

const requestSchema = z.object({
  threadId: z.string().uuid().optional(),
  model: z.string().trim().min(1).max(120).optional(),
  messages: z.array(z.custom<UIMessage>()).min(1),
});

function jsonError(message: string, status: number) {
  return Response.json(
    {
      ok: false,
      message,
    },
    { status },
  );
}

export async function POST(req: Request) {
  const arcjet = await checkArcjet(req);
  if (arcjet.isDenied()) {
    return jsonError("Too many requests. Please wait and try again.", 429);
  }

  const { session, user } = await getServerSession();
  if (!session || !user) {
    return jsonError("Authentication required", 401);
  }

  const body = await req.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid request payload", 400);
  }

  const { messages, threadId, model } = parsed.data;
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage) {
    return jsonError("At least one user message is required", 400);
  }

  await ensureWalletForUser(user.id);
  await grantStarterCreditsIfEligible(user.id);

  const thread = await ensureThreadForRequest({
    userId: user.id,
    threadId,
    model,
    latestUserMessage,
  });

  const persistedUserMessage = await persistUserMessage({
    userId: user.id,
    threadId: thread.id,
    message: latestUserMessage,
    model: model ?? thread.model,
  });

  const estimatedPromptTokens = Math.max(
    estimateTokensFromMessages(messages),
    estimateTokenCount(persistedUserMessage.content),
  );
  const reservedCreditsAmount = estimateCreditReservation(
    estimatedPromptTokens,
    serverEnv.CHAT_RESERVE_RATIO,
    serverEnv.CHAT_RESERVE_MIN_CREDITS,
  );

  let reservedCredits = 0;
  let assistantMessageId: string | null = null;

  try {
    const reservation = await reserveCredits({
      userId: user.id,
      amountCredits: reservedCreditsAmount,
      threadId: thread.id,
      messageId: persistedUserMessage.id,
      note: `Reserved for thread ${thread.id}`,
    });
    reservedCredits = reservation.reservedCredits;

    const assistantMessage = await createAssistantPlaceholder({
      userId: user.id,
      threadId: thread.id,
      provider: serverEnv.AI_PROVIDER,
      model: model ?? thread.model ?? serverEnv.OLLAMA_MODEL,
    });
    assistantMessageId = assistantMessage.id;

    const result = streamText({
      model: getChatModel(model ?? thread.model ?? serverEnv.OLLAMA_MODEL),
      providerOptions: { ollama: { think: true } },
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    });

    const usagePromise = Promise.resolve(result.totalUsage).catch(() => ({
      inputTokens: estimatedPromptTokens,
      outputTokens: 0,
      totalTokens: estimatedPromptTokens,
    }));

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      generateMessageId: () => assistantMessage.id,
      messageMetadata: ({ part }) => {
        if (part.type !== "start" && part.type !== "finish") {
          return undefined;
        }

        return {
          threadId: thread.id,
          assistantMessageId: assistantMessage.id,
          reservedCredits,
        };
      },
      onFinish: async ({ isAborted, responseMessage }) => {
        const usage = await usagePromise;
        const content = extractPlainTextFromMessage(responseMessage);
        const promptTokens = Number(usage.inputTokens ?? estimatedPromptTokens);
        const completionTokens = Number(usage.outputTokens ?? estimateTokenCount(content));
        const totalTokens = Number(usage.totalTokens ?? promptTokens + completionTokens);

        const settlement = await settleReservedCredits({
          userId: user.id,
          reservedCredits,
          actualCredits: totalTokens,
          threadId: thread.id,
          messageId: assistantMessage.id,
        });

        await finalizeAssistantMessage({
          userId: user.id,
          threadId: thread.id,
          messageId: assistantMessage.id,
          content,
          promptTokens,
          completionTokens,
          totalTokens,
          creditCost: settlement.chargedCredits,
          provider: serverEnv.AI_PROVIDER,
          model: model ?? thread.model ?? serverEnv.OLLAMA_MODEL,
          status: isAborted ? "cancelled" : "completed",
        });
      },
    });
  } catch (error) {
    if (assistantMessageId) {
      await failAssistantMessage({
        userId: user.id,
        threadId: thread.id,
        messageId: assistantMessageId,
        errorMessage: error instanceof Error ? error.message : "Unknown chat generation error",
        provider: serverEnv.AI_PROVIDER,
        model: model ?? thread.model ?? serverEnv.OLLAMA_MODEL,
      });
    }

    if (reservedCredits > 0) {
      await settleReservedCredits({
        userId: user.id,
        reservedCredits,
        actualCredits: 0,
        threadId: thread.id,
        messageId: assistantMessageId ?? persistedUserMessage.id,
      });
    }

    return jsonError(error instanceof Error ? error.message : "Failed to generate assistant response", 500);
  }
}
