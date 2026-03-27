import { format } from "date-fns";

export function formatCurrency(amountCents: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

export function formatCredits(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

export function formatBillingDate(value: string | Date | null | undefined) {
  if (!value) return "-";
  return format(new Date(value), "dd MMM yyyy, hh:mm a");
}

export function formatPaymentEventLabel(value: string | null | undefined) {
  switch (String(value ?? "").toLowerCase()) {
    case "checkout.created":
      return "Checkout Started";
    case "payment.authorized":
      return "Payment Authorized";
    case "payment.captured":
      return "Payment Captured";
    case "subscription.cancelled":
      return "Subscription Cancelled";
    case "payment.failed":
      return "Payment Failed";
    default:
      return value
        ? value
            .split(".")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        : "Unknown Event";
  }
}

export function formatLedgerKindLabel(value: string | null | undefined) {
  switch (String(value ?? "").toLowerCase()) {
    case "starter_grant":
      return "Starter Credits";
    case "subscription_grant":
      return "Subscription Credits";
    case "usage":
      return "Usage";
    case "refund":
      return "Refund";
    case "manual_adjustment":
      return "Manual Adjustment";
    case "reservation":
      return "Reserved Credits";
    default:
      return value
        ? value
            .split("_")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        : "Unknown Entry";
  }
}

export function formatSubscriptionStatusLabel(value: string | null | undefined) {
  switch (String(value ?? "").toLowerCase()) {
    case "free":
      return "Free";
    case "created":
      return "Created";
    case "inactive":
      return "Inactive";
    case "trialing":
      return "Verifying";
    case "authenticated":
      return "Authenticated";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "past_due":
      return "Past Due";
    case "cancelled":
      return "Cancelled";
    case "captured":
      return "Captured";
    case "authorized":
      return "Authorized";
    case "failed":
      return "Failed";
    default:
      return value
        ? value
            .split("_")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        : "Unknown";
  }
}
