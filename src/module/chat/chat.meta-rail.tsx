"use client";

import {
  ArchiveRestore,
  BrainIcon,
  ChevronLeft,
  ChevronRight,
  Cpu,
  CreditCard,
  Edit3,
  Gauge,
  Info,
  RefreshCcw,
  Trash2,
  Wallet,
} from "lucide-react";
import type { UIMessage } from "ai";
import type { ComponentProps, ReactNode } from "react";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { useIsMobile } from "@/shared/utils/hooks/use-mobile";
import { cn } from "@/shared/utils/lib/utils";
import type { ChatReasoningLevel } from "./chat.runtime";
import { formatReasoningLevelLabel } from "./chat.runtime";

type AllowedModelLike = {
  displayName: string;
  planCode: string;
  providerModel: string;
  source: "catalog" | "runtime";
};

type ChatMetaRailProps = {
  activePlan: string;
  availableModelsCount: number;
  balanceCredits: number;
  hasNoRuntimeModels: boolean;
  isArchived: boolean;
  isBusy: boolean;
  isLowBalance: boolean;
  messages: UIMessage[];
  mode: "landing" | "thread";
  onArchive: () => void;
  onAutoRename: () => void;
  onManageBilling: () => void;
  onRename: () => void;
  onRestore: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasoningEnabled: boolean;
  reasoningLevel: ChatReasoningLevel;
  selectedModel?: AllowedModelLike;
  thread?: {
    id: string;
  } | null;
};

function calculateUsageTotals(messages: UIMessage[]) {
  return messages.reduce(
    (totals, message) => {
      const metadata = (message.metadata as
        | {
            completionTokens?: number;
            creditCost?: number;
            promptTokens?: number;
            reasoningTokens?: number;
            totalTokens?: number;
          }
        | undefined) ?? { totalTokens: 0 };

      return {
        completionTokens: totals.completionTokens + (metadata.completionTokens ?? 0),
        creditCost: totals.creditCost + (metadata.creditCost ?? 0),
        promptTokens: totals.promptTokens + (metadata.promptTokens ?? 0),
        reasoningTokens: totals.reasoningTokens + (metadata.reasoningTokens ?? 0),
        totalTokens: totals.totalTokens + (metadata.totalTokens ?? 0),
      };
    },
    {
      completionTokens: 0,
      creditCost: 0,
      promptTokens: 0,
      reasoningTokens: 0,
      totalTokens: 0,
    },
  );
}

function MetaCard({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card/70 p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-[0.18em]">
        <span className="flex size-6 items-center justify-center rounded-xl bg-muted">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="font-medium text-sm leading-5">{value}</p>
      {hint ? <p className="text-muted-foreground mt-1 text-[11px] leading-4">{hint}</p> : null}
    </div>
  );
}

function SectionCard({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border bg-card/70 p-3", className)} {...props} />;
}

function UsageBreakdown({ messages }: { messages: UIMessage[] }) {
  const totals = useMemo(() => calculateUsageTotals(messages), [messages]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <MetaCard icon={<Gauge className="size-4" />} label="Prompt" value={totals.promptTokens.toLocaleString()} />
      <MetaCard
        icon={<Gauge className="size-4" />}
        label="Completion"
        value={totals.completionTokens.toLocaleString()}
      />
      <MetaCard
        icon={<BrainIcon className="size-4" />}
        label="Reasoning"
        value={totals.reasoningTokens.toLocaleString()}
      />
      <MetaCard icon={<Wallet className="size-4" />} label="Credits" value={totals.creditCost.toLocaleString()} />
      <div className="col-span-2">
        <MetaCard
          icon={<Gauge className="size-4" />}
          label="Total Tokens"
          value={totals.totalTokens.toLocaleString()}
        />
      </div>
    </div>
  );
}

function RailBody({
  activePlan,
  availableModelsCount,
  balanceCredits,
  hasNoRuntimeModels,
  isArchived,
  isBusy,
  isLowBalance,
  messages,
  mode,
  onArchive,
  onAutoRename,
  onManageBilling,
  onRename,
  onRestore,
  reasoningEnabled,
  reasoningLevel,
  selectedModel,
  thread,
}: Omit<ChatMetaRailProps, "open" | "onOpenChange">) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
      <div className="space-y-1 px-1">
        <p className="text-muted-foreground text-[10px] uppercase tracking-[0.24em]">Chat Details</p>
        <h2 className="font-semibold text-sm">Workspace sidebar</h2>
      </div>

      {isArchived ? (
        <Alert className="py-3">
          <ArchiveRestore className="size-4" />
          <AlertTitle>This thread is archived</AlertTitle>
          <AlertDescription>Archived chats are read-only until you restore them.</AlertDescription>
          <Button className="mt-3 w-full" disabled={isBusy} onClick={onRestore} size="sm" type="button">
            <ArchiveRestore className="size-4" />
            Restore thread
          </Button>
        </Alert>
      ) : null}

      {hasNoRuntimeModels || isLowBalance ? (
        <Alert className={cn("py-3", hasNoRuntimeModels || balanceCredits <= 0 ? "border-destructive/40" : undefined)}>
          <Wallet className="size-4" />
          <AlertTitle>{hasNoRuntimeModels ? "No local models are ready" : "Credits are running low"}</AlertTitle>
          <AlertDescription>
            {hasNoRuntimeModels
              ? "No usable local Ollama model is currently available for this chat session."
              : `You have ${balanceCredits.toLocaleString()} credits left on the ${activePlan} plan.`}
          </AlertDescription>
          <Button className="mt-3 w-full" onClick={onManageBilling} size="sm" type="button" variant="outline">
            <CreditCard className="size-4" />
            Billing
          </Button>
        </Alert>
      ) : null}

      <SectionCard>
        <div className="mb-2 flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-[0.18em]">
          <span className="flex size-6 items-center justify-center rounded-xl bg-muted">
            <Cpu className="size-4" />
          </span>
          <span>Overview</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MetaCard icon={<Wallet className="size-4" />} label="Plan" value={activePlan} />
          <MetaCard icon={<Wallet className="size-4" />} label="Credits" value={balanceCredits.toLocaleString()} />
          <MetaCard
            icon={<Cpu className="size-4" />}
            label="Model"
            value={selectedModel?.displayName ?? "No model selected"}
            hint={
              selectedModel
                ? `${selectedModel.providerModel} | ${selectedModel.source === "runtime" ? "Local runtime" : selectedModel.planCode}`
                : undefined
            }
          />
          <MetaCard
            icon={<Info className="size-4" />}
            label="Local Models"
            value={availableModelsCount.toLocaleString()}
            hint="Available in Ollama"
          />
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-2 flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-[0.18em]">
          <span className="flex size-6 items-center justify-center rounded-xl bg-muted">
            <BrainIcon className="size-4" />
          </span>
          <span>Generation</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MetaCard icon={<BrainIcon className="size-4" />} label="Reasoning" value={reasoningEnabled ? "On" : "Off"} />
          <MetaCard
            icon={<BrainIcon className="size-4" />}
            label="Level"
            value={formatReasoningLevelLabel(reasoningLevel)}
          />
          <div className="col-span-2">
            <MetaCard
              icon={<Info className="size-4" />}
              label="Thread State"
              value={isArchived ? "Archived" : mode === "thread" ? "Active thread" : "New chat"}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-2 flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-[0.18em]">
          <span className="flex size-6 items-center justify-center rounded-xl bg-muted">
            <Gauge className="size-4" />
          </span>
          <span>Usage</span>
        </div>
        <UsageBreakdown messages={messages} />
      </SectionCard>

      <SectionCard>
        <div className="mb-2 flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-[0.18em]">
          <span className="flex size-6 items-center justify-center rounded-xl bg-muted">
            <Edit3 className="size-4" />
          </span>
          <span>Thread Actions</span>
        </div>
        {thread ? (
          <div className="space-y-2">
            <div className="rounded-2xl border bg-background/70 p-3 text-xs leading-5">
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.18em]">Thread ID</p>
              <p className="mt-1 break-all font-mono text-[11px]">{thread.id}</p>
            </div>
            {isArchived ? (
              <Button className="w-full justify-start" disabled={isBusy} onClick={onRestore} size="sm" type="button">
                <ArchiveRestore className="size-4" />
                Restore thread
              </Button>
            ) : (
              <>
                <Button
                  className="w-full justify-start"
                  disabled={isBusy}
                  onClick={onRename}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Edit3 className="size-4" />
                  Rename manually
                </Button>
                <Button
                  className="w-full justify-start"
                  disabled={isBusy}
                  onClick={onAutoRename}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <RefreshCcw className="size-4" />
                  Auto rename from chat
                </Button>
                <Button
                  className="w-full justify-start"
                  disabled={isBusy}
                  onClick={onArchive}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="size-4" />
                  Archive thread
                </Button>
              </>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground px-1 text-xs leading-5">
            The first successful send creates the thread. Thread actions will appear here once the conversation exists.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

export function ChatMetaRail({ open, onOpenChange, ...props }: ChatMetaRailProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent className="w-full max-w-sm p-0 sm:max-w-sm" side="right">
          <SheetHeader className="sr-only">
            <SheetTitle>Chat details</SheetTitle>
            <SheetDescription>Chat details, usage, and thread actions.</SheetDescription>
          </SheetHeader>
          <RailBody {...props} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden h-full border-l bg-background transition-all duration-200 ease-out xl:flex",
        open ? "w-[340px] translate-x-0 opacity-100" : "w-0 translate-x-6 opacity-0",
      )}
    >
      <div className={cn("min-w-[340px] flex-1", open ? "pointer-events-auto" : "pointer-events-none")}>
        <RailBody {...props} />
      </div>
    </aside>
  );
}

export function ChatMetaRailToggle({ open }: { open: boolean }) {
  return (
    <>
      {open ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      <span>{open ? "Hide details" : "Show details"}</span>
    </>
  );
}
