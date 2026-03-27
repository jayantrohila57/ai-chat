import { ollama } from "ollama-ai-provider-v2";
import { serverEnv } from "@/shared/config/env.server";

export function getChatModel(model = serverEnv.OLLAMA_MODEL) {
  if (serverEnv.AI_PROVIDER !== "ollama") {
    throw new Error(`Unsupported AI provider: ${serverEnv.AI_PROVIDER}`);
  }

  return ollama(model);
}

export function getAiRuntimeConfig() {
  return {
    provider: serverEnv.AI_PROVIDER,
    model: serverEnv.OLLAMA_MODEL,
    ollamaBaseUrl: serverEnv.OLLAMA_BASE_URL,
  };
}
