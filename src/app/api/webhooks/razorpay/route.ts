import { verifyRazorpayWebhookSignature } from "@/module/billing/billing.razorpay";
import { processRazorpayWebhook, type RazorpayWebhookPayload } from "@/module/billing/billing.service";
import { jsonFailure, jsonSuccess } from "@/shared/config/api.utils";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!verifyRazorpayWebhookSignature(body, signature)) {
      return jsonFailure({
        message: "Invalid webhook signature",
        code: "UNAUTHORIZED",
        kind: "auth",
        httpStatus: 401,
      });
    }

    const payload = JSON.parse(body) as RazorpayWebhookPayload;
    const result = await processRazorpayWebhook(payload);
    return jsonSuccess(result, "Webhook processed successfully.", 200);
  } catch (error) {
    return jsonFailure({
      message: error instanceof Error ? error.message : "Webhook processing failed",
      code: "INTERNAL_SERVER_ERROR",
      kind: "server",
      httpStatus: 500,
    });
  }
}
