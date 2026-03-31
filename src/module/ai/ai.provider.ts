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
    ollamaBaseUrl: serverEnv.OLLAMA_BASE_URL,
    provider: serverEnv.AI_PROVIDER,
    providerLabel: "Ollama",
    supportsLocalModels: true,
  };
}
