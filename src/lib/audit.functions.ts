import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CategoryEnum = z.enum(["auth", "billing", "access_denied", "admin", "data"]);
const StatusEnum = z.enum(["success", "failure", "denied"]);

const LogSchema = z.object({
  category: CategoryEnum,
  event: z.string().min(1).max(120),
  status: StatusEnum.default("success"),
  actor_user_id: z.string().uuid().nullable().optional(),
  actor_email: z.string().email().max(320).nullable().optional(),
  resource: z.string().max(255).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

function clientInfo() {
  try {
    const req = getRequest();
    const h = req?.headers;
    if (!h) return { ip_address: null, user_agent: null };
    const ip =
      h.get("cf-connecting-ip") ??
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    return { ip_address: ip, user_agent: h.get("user-agent") };
  } catch {
    return { ip_address: null, user_agent: null };
  }
}

export async function recordAuditEvent(input: z.infer<typeof LogSchema>) {
  const parsed = LogSchema.parse(input);
  const { ip_address, user_agent } = clientInfo();
  const { error } = await supabaseAdmin.from("audit_logs").insert({
    category: parsed.category,
    event: parsed.event,
    status: parsed.status ?? "success",
    actor_user_id: parsed.actor_user_id ?? null,
    actor_email: parsed.actor_email ?? null,
    resource: parsed.resource ?? null,
    metadata: (parsed.metadata ?? {}) as never,
    ip_address,
    user_agent,
  });
  if (error) {
    // Never throw from audit logging — log to console so the originating flow continues.
    console.error("[audit] failed to record event", parsed.event, error.message);
  }
}

/** Client-callable: records auth + access_denied events. Trusts caller for category. */
export const logClientAuditEvent = createServerFn({ method: "POST" })
  .inputValidator((input) => LogSchema.parse(input))
  .handler(async ({ data }) => {
    // Restrict client-callable category to safe values to prevent log injection.
    if (data.category !== "auth" && data.category !== "access_denied") {
      return { ok: false as const };
    }
    await recordAuditEvent(data);
    return { ok: true as const };
  });
