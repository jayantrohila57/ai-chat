"use client";

import { CalendarClock, CreditCard, Sparkles, Wallet } from "lucide-react";
import Link from "next/link";
import { apiClient, getApiErrorMessage, getApiResponseData } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import { formatBillingDate, formatCredits, formatSubscriptionStatusLabel } from "@/module/billing/billing.format";
import { ApiErrorState } from "@/shared/components/feedback/api-error-state";
import { useSettingsDialog } from "@/shared/components/provider/global-modal.provider";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATH } from "@/shared/config/routes";
import { ProfileCard } from "./account.profile-view";

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Wallet;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <Icon className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

export function AccountSettings() {
  const { data: session } = useSession();
  const { openSettings } = useSettingsDialog();
  const viewerQuery = apiClient.viewer.session.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const usageQuery = apiClient.billing.usage.useQuery(undefined, {
    enabled: !!session?.user,
  });

  const viewer = getApiResponseData(viewerQuery.data);
  const usage = getApiResponseData(usageQuery.data);

  if (viewerQuery.isLoading || usageQuery.isLoading) {
    return (
      <div className="space-y-6 p-1 w-full">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (viewerQuery.isError) {
    return (
      <ApiErrorState
        title="Account unavailable"
        message={getApiErrorMessage(viewerQuery.error, "Failed to load account details.")}
        onRetry={() => void viewerQuery.refetch()}
      />
    );
  }

  if (usageQuery.isError) {
    return (
      <ApiErrorState
        title="Usage unavailable"
        message={getApiErrorMessage(usageQuery.error, "Failed to load usage details.")}
        onRetry={() => void usageQuery.refetch()}
      />
    );
  }

  if (!viewer?.authenticated || !viewer.user || !viewer.billing || !viewer.wallet || !usage) {
    return null;
  }

  const billing = viewer.billing;
  const planNarrative = billing.currentPlan
    ? `${billing.currentPlan.name} customer plan is currently attached to this account.`
    : "You're currently on the free customer experience.";

  return (
    <div className="space-y-6 p-1 w-full">
      <ProfileCard user={viewer.user} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Current Plan"
          value={billing.currentPlan?.name ?? "Free"}
          description={`Status: ${formatSubscriptionStatusLabel(billing.subscriptionStatus)}`}
          icon={CreditCard}
        />
        <SummaryCard
          title="Wallet Balance"
          value={formatCredits(viewer.wallet.balanceCredits)}
          description="Credits available right now"
          icon={Wallet}
        />
        <SummaryCard
          title="Starter Credits"
          value={formatCredits(usage.breakdown.starterCreditsGranted ?? 0)}
          description="Granted one time at first sign in"
          icon={Sparkles}
        />
        <SummaryCard
          title="Next Renewal"
          value={formatBillingDate(billing.nextRenewalAt)}
          description="Current billing cycle date"
          icon={CalendarClock}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer billing summary</CardTitle>
          <CardDescription>
            Free, Starter, and Pro customer state lives here before the deeper billing history views.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{billing.currentPlan?.name ?? "Free"}</Badge>
            <Badge variant="secondary">{formatSubscriptionStatusLabel(billing.subscriptionStatus)}</Badge>
            <Badge variant="outline">{formatCredits(viewer.wallet.balanceCredits)} credits</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Plan details</CardTitle>
                <CardDescription>{planNarrative}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Renewal: {formatBillingDate(billing.nextRenewalAt)}</p>
                <p>Recent payments tracked: {billing.recentPayments.length}</p>
                <p>Recent orders tracked: {billing.recentOrders.length}</p>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Usage snapshot</CardTitle>
                <CardDescription>Separate starter, subscription, and spent credits for clarity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Subscription credits: {formatCredits(usage.breakdown.subscriptionCreditsGranted ?? 0)}</p>
                <p>Usage spent: {formatCredits(usage.breakdown.usageCreditsSpent ?? 0)}</p>
                <p>Refunds: {formatCredits(usage.breakdown.refundCredits ?? 0)}</p>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Quick actions</CardTitle>
                <CardDescription>Jump into the dedicated surfaces without hunting through the app.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={() => openSettings("subscription")}>Open subscription</Button>
                <Button variant="outline" onClick={() => openSettings("payments")}>
                  Open payments
                </Button>
                <Button variant="ghost" asChild>
                  <Link href={PATH.PRICING.ROOT}>View pricing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
