import { PricingSuccessPageContent } from "@/module/billing/billing.customer";

export const metadata = {
  title: "Payment Verification",
  description: "Verify a Razorpay subscription and sync billing state to your account.",
};

export default function PricingSuccessPage() {
  return <PricingSuccessPageContent />;
}
