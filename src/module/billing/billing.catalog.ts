import { serverEnv } from "@/shared/config/env.server";

export type BillingPlanCode = "free" | "starter" | "pro";

export type BillingPlanDefinition = {
  code: BillingPlanCode;
  name: string;
  tagline: string;
  description: string;
  priceCents: number;
  currency: "INR";
  billingInterval: "month";
  creditsPerCycle: number;
  providerPlanId: string | null;
  highlighted: boolean;
  ctaLabel: string;
  features: string[];
};

const STARTER_MONTHLY_CREDITS = 300000;
const PRO_MONTHLY_CREDITS = 800000;

export const BILLING_PLANS: BillingPlanDefinition[] = [
  {
    code: "free",
    name: "Free",
    tagline: "Try the product before you commit",
    description: "Starter access for new customers with one-time welcome credits and basic account management.",
    priceCents: 0,
    currency: "INR",
    billingInterval: "month",
    creditsPerCycle: serverEnv.STARTER_CREDITS,
    providerPlanId: null,
    highlighted: false,
    ctaLabel: "Included on sign in",
    features: ["One-time welcome credits", "Access to account settings", "Upgrade any time from billing"],
  },
  {
    code: "starter",
    name: "Starter",
    tagline: "For regular individual usage",
    description: "A recurring monthly plan with enough credits for everyday prompting and early customer retention.",
    priceCents: 99900,
    currency: "INR",
    billingInterval: "month",
    creditsPerCycle: STARTER_MONTHLY_CREDITS,
    providerPlanId: serverEnv.RAZORPAY_STARTER_PLAN_ID || null,
    highlighted: true,
    ctaLabel: "Subscribe to Starter",
    features: [
      "Monthly recurring subscription",
      `${STARTER_MONTHLY_CREDITS.toLocaleString()} credits every month`,
      "Billing and payment history inside the app",
    ],
  },
  {
    code: "pro",
    name: "Pro",
    tagline: "For heavy personal and team-adjacent use",
    description:
      "A higher monthly allowance for customers who need more headroom without changing the in-product flow.",
    priceCents: 199900,
    currency: "INR",
    billingInterval: "month",
    creditsPerCycle: PRO_MONTHLY_CREDITS,
    providerPlanId: serverEnv.RAZORPAY_PRO_PLAN_ID || null,
    highlighted: false,
    ctaLabel: "Subscribe to Pro",
    features: [
      "Monthly recurring subscription",
      `${PRO_MONTHLY_CREDITS.toLocaleString()} credits every month`,
      "Higher allowance for sustained usage",
    ],
  },
];

export function getBillingPlanByCode(planCode: string) {
  return BILLING_PLANS.find((plan) => plan.code === planCode);
}

export function getBillingPlanByProviderPlanId(providerPlanId: string | null | undefined) {
  if (!providerPlanId) return undefined;
  return BILLING_PLANS.find((plan) => plan.providerPlanId === providerPlanId);
}
