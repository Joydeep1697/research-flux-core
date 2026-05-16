import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { logClientAuditEvent } from "@/lib/audit.functions";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      // Fire-and-forget; never block the redirect on audit logging.
      void logClientAuditEvent({
        data: {
          category: "access_denied",
          event: "route.unauthenticated",
          status: "denied",
          resource: location.pathname,
        },
      }).catch(() => {});
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Outlet />
    </div>
  );
}
