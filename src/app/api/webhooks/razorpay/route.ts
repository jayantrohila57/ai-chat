import { verifyRazorpayWebhookSignature } from "@/module/billing/billing.razorpay";
import { processRazorpayWebhook, type RazorpayWebhookPayload } from "@/module/billing/billing.service";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhookSignature(body, signature)) {
    return Response.json({ ok: false, message: "Invalid webhook signature" }, { status: 401 });
  }

  const payload = JSON.parse(body) as RazorpayWebhookPayload;
  const result = await processRazorpayWebhook(payload);

  return Response.json(result, { status: 200 });
}
