import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LogSchema = z.object({
  category: z.enum(["auth", "billing", "access_denied", "admin", "data"]),
  event: z.string().min(1).max(120),
  status: z.enum(["success", "failure", "denied"]).default("success"),
  actor_user_id: z.string().uuid().nullable().optional(),
  actor_email: z.string().email().max(320).nullable().optional(),
  resource: z.string().max(255).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/** Client-callable: records auth + access_denied events only. */
export const logClientAuditEvent = createServerFn({ method: "POST" })
  .inputValidator((input) => LogSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.category !== "auth" && data.category !== "access_denied") {
      return { ok: false as const };
    }
    const { recordAuditEvent } = await import("./audit.server");
    await recordAuditEvent(data);
    return { ok: true as const };
  });
