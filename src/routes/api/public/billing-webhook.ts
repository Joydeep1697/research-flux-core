import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { recordAuditEvent } from "@/lib/audit.server";

/**
 * Billing webhook receiver. Verifies HMAC-SHA256 signature against
 * BILLING_WEBHOOK_SECRET, then records an audit event for every call
 * (accepted or rejected) so billing incidents can be investigated.
 */
export const Route = createFileRoute("/api/public/billing-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get("x-webhook-signature");
        const secret = process.env.BILLING_WEBHOOK_SECRET;

        if (!secret) {
          await recordAuditEvent({
            category: "billing",
            event: "webhook.misconfigured",
            status: "failure",
            metadata: { reason: "BILLING_WEBHOOK_SECRET not set" },
          });
          return new Response("Webhook not configured", { status: 503 });
        }

        const expected = createHmac("sha256", secret).update(body).digest("hex");
        const provided = signature ?? "";
        const valid =
          provided.length === expected.length &&
          timingSafeEqual(Buffer.from(provided), Buffer.from(expected));

        if (!valid) {
          await recordAuditEvent({
            category: "billing",
            event: "webhook.signature_invalid",
            status: "denied",
            metadata: { signature_present: Boolean(signature) },
          });
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: { type?: string; id?: string; customer_id?: string } = {};
        try {
          payload = JSON.parse(body);
        } catch {
          await recordAuditEvent({
            category: "billing",
            event: "webhook.invalid_json",
            status: "failure",
          });
          return new Response("Invalid JSON", { status: 400 });
        }

        await recordAuditEvent({
          category: "billing",
          event: `webhook.${payload.type ?? "unknown"}`,
          status: "success",
          resource: payload.id ?? null,
          metadata: {
            type: payload.type ?? null,
            customer_id: payload.customer_id ?? null,
          },
        });

        return new Response("ok", { status: 200 });
      },
    },
  },
});
