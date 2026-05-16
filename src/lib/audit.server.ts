import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AuditCategory = "auth" | "billing" | "access_denied" | "admin" | "data";
export type AuditStatus = "success" | "failure" | "denied";

export type AuditEventInput = {
  category: AuditCategory;
  event: string;
  status?: AuditStatus;
  actor_user_id?: string | null;
  actor_email?: string | null;
  resource?: string | null;
  metadata?: Record<string, unknown>;
};

function clientInfo() {
  try {
    const req = getRequest();
    const h = req?.headers;
    if (!h) return { ip_address: null as string | null, user_agent: null as string | null };
    const ip =
      h.get("cf-connecting-ip") ??
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    return { ip_address: ip, user_agent: h.get("user-agent") };
  } catch {
    return { ip_address: null as string | null, user_agent: null as string | null };
  }
}

export async function recordAuditEvent(input: AuditEventInput) {
  const { ip_address, user_agent } = clientInfo();
  const { error } = await supabaseAdmin.from("audit_logs").insert({
    category: input.category,
    event: input.event,
    status: input.status ?? "success",
    actor_user_id: input.actor_user_id ?? null,
    actor_email: input.actor_email ?? null,
    resource: input.resource ?? null,
    metadata: (input.metadata ?? {}) as never,
    ip_address,
    user_agent,
  });
  if (error) {
    console.error("[audit] failed to record event", input.event, error.message);
  }
}
