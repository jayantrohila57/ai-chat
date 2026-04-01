import { google } from "@ai-sdk/google";
import { ollama } from "ollama-ai-provider-v2";
import { serverEnv } from "@/shared/config/env.server";

export function getChatModel(model = serverEnv.OLLAMA_MODEL, provider = serverEnv.AI_PROVIDER) {
  if (provider === "ollama") {
    return ollama(model);
  } else if (provider === "google") {
    return google(model);
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

export function getAiRuntimeConfig(provider = serverEnv.AI_PROVIDER) {
  if (provider === "ollama") {
    return {
      ollamaBaseUrl: serverEnv.OLLAMA_BASE_URL,
      provider: serverEnv.AI_PROVIDER,
      providerLabel: "Ollama",
      supportsLocalModels: true,
    };
  } else if (provider === "google") {
    return {
      provider: serverEnv.AI_PROVIDER,
      providerLabel: "Google",
    };
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
