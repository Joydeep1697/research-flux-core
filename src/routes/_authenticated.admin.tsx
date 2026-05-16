import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Lumen Research" }] }),
  component: AdminPage,
});

type AuditRow = {
  id: string;
  event: string;
  category: string;
  status: string;
  actor_email: string | null;
  actor_user_id: string | null;
  resource: string | null;
  ip_address: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
};

function AdminPage() {
  const { user } = useAuth();

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return !!data;
    },
    enabled: !!user,
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return data as AuditRow[];
    },
    enabled: !!isAdmin,
  });

  if (roleLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">You don't have access to this area.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Audit log</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Last 200 security events: auth, billing, and access denials.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        {logsLoading ? (
          <div className="p-10 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No events yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2">When</th>
                <th className="px-4 py-2">Event</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actor</th>
                <th className="px-4 py-2">IP</th>
                <th className="px-4 py-2">Resource</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((row) => (
                <tr key={row.id} className="border-t border-border/50 hover:bg-muted/20">
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-2 font-medium">{row.event}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.category}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        row.status === "success"
                          ? "default"
                          : row.status === "denied"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {row.actor_email ?? row.actor_user_id?.slice(0, 8) ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{row.ip_address ?? "—"}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{row.resource ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
