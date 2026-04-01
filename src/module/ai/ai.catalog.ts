import type { BillingPlanCode } from "@/module/billing/billing.catalog";

export type AiProviderKey = "ollama" | "google";

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
