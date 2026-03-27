import { createTRPCRouter, publicProcedure, withApiSuccess } from "@/core/api/api.methods";
import { getAiRuntimeConfig } from "@/module/ai/ai.provider";
import { getViewerAnalyticsSummary } from "@/module/analytics/analytics.service";
import { getBillingSummary } from "@/module/billing/billing.service";

export const viewerRouter = createTRPCRouter({
  session: publicProcedure.query(async ({ ctx }) => {
    const authenticated = Boolean(ctx.session && ctx.user);

    if (!authenticated || !ctx.user) {
      return withApiSuccess(
        {
          authenticated: false,
          user: null,
          wallet: null,
          subscription: null,
          analytics: null,
          billing: null,
          ai: getAiRuntimeConfig(),
        },
        "Viewer session retrieved successfully.",
      );
    }

    const [billing, analytics] = await Promise.all([
      getBillingSummary(ctx.user.id),
      getViewerAnalyticsSummary(ctx.user.id),
    ]);

    return withApiSuccess(
      {
        authenticated: true,
        user: {
          id: ctx.user.id,
          name: ctx.user.name,
          email: ctx.user.email,
          role: ctx.user.role,
          image: ctx.user.image,
          emailVerified: ctx.user.emailVerified,
          createdAt: ctx.user.createdAt,
        },
        wallet: {
          id: billing.wallet.id,
          balanceCredits: billing.wallet.balanceCredits,
          lifetimeGrantedCredits: billing.wallet.lifetimeGrantedCredits,
          lifetimeSpentCredits: billing.wallet.lifetimeSpentCredits,
          recentLedger: billing.wallet.recentLedger,
        },
        subscription: billing.activeSubscription,
        billing,
        analytics,
        ai: getAiRuntimeConfig(),
      },
      "Viewer session retrieved successfully.",
    );
  }),
});
