import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Telescope } from "lucide-react";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Telescope className="h-5 w-5 text-primary" />
          <span>Lumen Research</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/examples" className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline">
            Examples
          </Link>
          <Link to="/how-it-works" className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground md:inline">
            How it works
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link to="/settings" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                Settings
              </Link>
              {isAdmin && (
                <Link to="/admin" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                  Admin
                </Link>
              )}
              <ThemeToggle />
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/login" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                Log in
              </Link>
              <Button size="sm" asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
