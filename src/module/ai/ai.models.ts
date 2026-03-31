import "server-only";

import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/core/db/db";
import { aiModel } from "@/core/db/db.schema";
import type { BillingPlanCode } from "@/module/billing/billing.catalog";
import { getBillingSummary } from "@/module/billing/billing.service";
import { serverEnv } from "@/shared/config/env.server";
import { AI_MODEL_SEEDS } from "./ai.catalog";

const RUNTIME_MODEL_ID_PREFIX = "runtime:ollama:";

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function getPlanRank(planCode: BillingPlanCode) {
  switch (planCode) {
    case "pro":
      return 3;
    case "starter":
      return 2;
    default:
      return 1;
  }
}

function titleCaseModelName(modelName: string) {
  return modelName
    .split(/[:\-_/]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getFallbackRuntimeMultiplierBps() {
  return AI_MODEL_SEEDS.find((model) => model.isDefault)?.creditMultiplierBps ?? 10000;
}

function getFallbackRuntimeSupportsReasoning() {
  return AI_MODEL_SEEDS.find((model) => model.isDefault)?.supportsReasoning ?? true;
}

export function createRuntimeAiModelId(providerModel: string) {
  return `${RUNTIME_MODEL_ID_PREFIX}${encodeURIComponent(providerModel)}`;
}

export function isRuntimeAiModelId(modelId: string) {
  return modelId.startsWith(RUNTIME_MODEL_ID_PREFIX);
}

export function getRuntimeProviderModelFromId(modelId: string) {
  if (!isRuntimeAiModelId(modelId)) {
    return null;
  }

  const encodedProviderModel = modelId.slice(RUNTIME_MODEL_ID_PREFIX.length);
  return encodedProviderModel ? decodeURIComponent(encodedProviderModel) : null;
}

export function calculateCreditCostFromTokens(tokens: number, multiplierBps: number) {
  const normalizedTokens = Math.max(0, Math.trunc(tokens));
  const normalizedMultiplier = Math.max(1, Math.trunc(multiplierBps));
  return Math.max(0, Math.ceil((normalizedTokens * normalizedMultiplier) / 10000));
}

async function fetchOllamaTags() {
  const response = await fetch(new URL("tags", normalizeBaseUrl(serverEnv.OLLAMA_BASE_URL)), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Ollama is unavailable (${response.status})`);
  }

  const payload = (await response.json()) as {
    models?: Array<{
      name?: string;
      model?: string;
    }>;
  };

  return payload.models ?? [];
}

export async function listRuntimeAvailableOllamaModels() {
  const models = await fetchOllamaTags();
  return new Set(models.map((model) => String(model.name ?? model.model ?? "").trim()).filter(Boolean));
}

export async function syncAiModels() {
  for (const definition of AI_MODEL_SEEDS) {
    await db
      .insert(aiModel)
      .values({
        id: definition.id,
        provider: definition.provider,
        providerModel: definition.providerModel,
        displayName: definition.displayName,
        description: definition.description,
        planCode: definition.planCode,
        enabled: definition.enabled,
        isDefault: definition.isDefault,
        supportsReasoning: definition.supportsReasoning,
        creditMultiplierBps: definition.creditMultiplierBps,
        contextWindow: definition.contextWindow ?? null,
        maxOutputTokens: definition.maxOutputTokens ?? null,
        sortOrder: definition.sortOrder,
      })
      .onConflictDoUpdate({
        target: aiModel.id,
        set: {
          provider: definition.provider,
          providerModel: definition.providerModel,
          displayName: definition.displayName,
          description: definition.description,
          planCode: definition.planCode,
          enabled: definition.enabled,
          isDefault: definition.isDefault,
          supportsReasoning: definition.supportsReasoning,
          creditMultiplierBps: definition.creditMultiplierBps,
          contextWindow: definition.contextWindow ?? null,
          maxOutputTokens: definition.maxOutputTokens ?? null,
          sortOrder: definition.sortOrder,
        },
      });
  }
}

export type PublicAiModel = {
  contextWindow: number | null;
  creditMultiplierBps: number;
  description: string;
  displayName: string;
  enabled: boolean;
  id: string;
  isDefault: boolean;
  maxOutputTokens: number | null;
  planCode: BillingPlanCode;
  provider: string;
  providerModel: string;
  runtimeAvailable: boolean;
  source: "catalog" | "runtime";
  supportsReasoning: boolean;
};

export async function getCurrentPlanCode(userId: string): Promise<BillingPlanCode> {
  const summary = await getBillingSummary(userId);
  return (summary.currentPlan?.code ?? "free") as BillingPlanCode;
}

function toPublicModel(model: typeof aiModel.$inferSelect, runtimeAvailable: boolean): PublicAiModel {
  return {
    contextWindow: model.contextWindow,
    creditMultiplierBps: model.creditMultiplierBps,
    description: model.description ?? "",
    displayName: model.displayName,
    enabled: model.enabled,
    id: model.id,
    isDefault: model.isDefault,
    maxOutputTokens: model.maxOutputTokens,
    planCode: model.planCode as BillingPlanCode,
    provider: model.provider,
    providerModel: model.providerModel,
    runtimeAvailable,
    source: "catalog" as const,
    supportsReasoning: model.supportsReasoning,
  };
}

function createRuntimePublicModel(providerModel: string, currentPlanCode: BillingPlanCode): PublicAiModel {
  return {
    contextWindow: null,
    creditMultiplierBps: getFallbackRuntimeMultiplierBps(),
    description: "Discovered from the local Ollama runtime on this machine.",
    displayName: titleCaseModelName(providerModel),
    enabled: true,
    id: createRuntimeAiModelId(providerModel),
    isDefault: false,
    maxOutputTokens: null,
    planCode: currentPlanCode,
    provider: "ollama",
    providerModel,
    runtimeAvailable: true,
    source: "runtime" as const,
    supportsReasoning: getFallbackRuntimeSupportsReasoning(),
  };
}

function comparePublicModels(a: PublicAiModel, b: PublicAiModel) {
  if (a.isDefault !== b.isDefault) {
    return a.isDefault ? -1 : 1;
  }

  if (a.runtimeAvailable !== b.runtimeAvailable) {
    return a.runtimeAvailable ? -1 : 1;
  }

  if (a.source !== b.source) {
    return a.source === "catalog" ? -1 : 1;
  }

  return a.displayName.localeCompare(b.displayName);
}

export async function listAllowedAiModelsForUser(userId: string): Promise<PublicAiModel[]> {
  await syncAiModels();

  const [planCode, runtimeModels, allModels] = await Promise.all([
    getCurrentPlanCode(userId),
    listRuntimeAvailableOllamaModels().catch(() => new Set<string>()),
    db.query.aiModel.findMany({
      where: and(eq(aiModel.enabled, true), eq(aiModel.provider, "ollama")),
      orderBy: [asc(aiModel.sortOrder), asc(aiModel.displayName)],
    }),
  ]);

  const configuredProviderModels = new Set(allModels.map((model) => model.providerModel));
  const allowedConfiguredModels = allModels
    .filter((model) => getPlanRank(model.planCode as BillingPlanCode) <= getPlanRank(planCode))
    .map((model) => toPublicModel(model, runtimeModels.has(model.providerModel)));

  const discoveredRuntimeModels = [...runtimeModels]
    .filter((providerModel) => !configuredProviderModels.has(providerModel))
    .sort((left, right) => left.localeCompare(right))
    .map((providerModel) => createRuntimePublicModel(providerModel, planCode));

  return [...allowedConfiguredModels, ...discoveredRuntimeModels].sort(comparePublicModels);
}

export async function getResolvedAiModelForUser(input: { userId: string; modelId?: string | null }) {
  await syncAiModels();

  const [planCode, runtimeModels] = await Promise.all([
    getCurrentPlanCode(input.userId),
    listRuntimeAvailableOllamaModels().catch(() => {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Ollama is not reachable right now. Please make sure the local model server is running.",
      });
    }),
  ]);

  const runtimeProviderModel = input.modelId ? getRuntimeProviderModelFromId(input.modelId) : null;
  if (runtimeProviderModel) {
    if (!runtimeModels.has(runtimeProviderModel)) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: `${runtimeProviderModel} is not available in Ollama right now.`,
      });
    }

    return {
      ...createRuntimePublicModel(runtimeProviderModel, planCode),
      activePlanCode: planCode,
    };
  }

  const model =
    (input.modelId
      ? await db.query.aiModel.findFirst({
          where: and(eq(aiModel.id, input.modelId), eq(aiModel.enabled, true), eq(aiModel.provider, "ollama")),
        })
      : await db.query.aiModel.findFirst({
          where: and(eq(aiModel.enabled, true), eq(aiModel.isDefault, true), eq(aiModel.provider, "ollama")),
          orderBy: [asc(aiModel.sortOrder), asc(aiModel.displayName)],
        })) ?? null;

  if (!model) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Selected chat model is not configured." });
  }

  if (getPlanRank(model.planCode as BillingPlanCode) > getPlanRank(planCode)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your current subscription plan does not include this model.",
    });
  }

  if (!runtimeModels.has(model.providerModel)) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `${model.displayName} is not available in Ollama right now.`,
    });
  }

  return {
    ...toPublicModel(model, true),
    activePlanCode: planCode,
  };
}

export function getDefaultModelIdFromSeeds() {
  return AI_MODEL_SEEDS.find((model) => model.isDefault)?.id ?? AI_MODEL_SEEDS[0]?.id ?? "local-default";
}
