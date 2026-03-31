import type { BillingPlanCode } from "@/module/billing/billing.catalog";
import { serverEnv } from "@/shared/config/env.server";

export type AiProviderKey = "ollama";

export type AiModelSeed = {
  id: string;
  provider: AiProviderKey;
  providerModel: string;
  displayName: string;
  description: string;
  planCode: BillingPlanCode;
  enabled: boolean;
  isDefault: boolean;
  supportsReasoning: boolean;
  creditMultiplierBps: number;
  contextWindow?: number;
  maxOutputTokens?: number;
  sortOrder: number;
};

export const AI_MODEL_SEEDS: AiModelSeed[] = [
  {
    id: "local-default",
    provider: "ollama",
    providerModel: serverEnv.OLLAMA_MODEL,
    displayName: "Local Default",
    description: "Primary Ollama model configured for the app.",
    planCode: "free",
    enabled: true,
    isDefault: true,
    supportsReasoning: true,
    creditMultiplierBps: 10000,
    sortOrder: 0,
  },
  {
    id: "qwen3-8b",
    provider: "ollama",
    providerModel: "qwen3:8b",
    displayName: "Qwen 3 8B",
    description: "Balanced local model for everyday coding and general chat.",
    planCode: "starter",
    enabled: true,
    isDefault: false,
    supportsReasoning: true,
    creditMultiplierBps: 12500,
    sortOrder: 10,
  },
  {
    id: "deepseek-r1-8b",
    provider: "ollama",
    providerModel: "deepseek-r1:8b",
    displayName: "DeepSeek R1 8B",
    description: "Reasoning-focused local model for more deliberate responses.",
    planCode: "pro",
    enabled: true,
    isDefault: false,
    supportsReasoning: true,
    creditMultiplierBps: 15000,
    sortOrder: 20,
  },
];
