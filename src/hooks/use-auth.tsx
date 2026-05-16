import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logClientAuditEvent } from "@/lib/audit.functions";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const lastLoggedUserRef = useRef<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false);

      // Audit-log meaningful auth state transitions.
      const uid = s?.user?.id ?? null;
      const email = s?.user?.email ?? null;
      if (event === "SIGNED_IN" && uid && lastLoggedUserRef.current !== uid) {
        lastLoggedUserRef.current = uid;
        void logClientAuditEvent({
          data: {
            category: "auth",
            event: "auth.signed_in",
            status: "success",
            actor_user_id: uid,
            actor_email: email,
          },
        }).catch(() => {});
      } else if (event === "SIGNED_OUT") {
        const prev = lastLoggedUserRef.current;
        lastLoggedUserRef.current = null;
        void logClientAuditEvent({
          data: {
            category: "auth",
            event: "auth.signed_out",
            status: "success",
            actor_user_id: prev,
          },
        }).catch(() => {});
      } else if (event === "PASSWORD_RECOVERY" && uid) {
        void logClientAuditEvent({
          data: {
            category: "auth",
            event: "auth.password_recovery",
            status: "success",
            actor_user_id: uid,
            actor_email: email,
          },
        }).catch(() => {});
      } else if (event === "USER_UPDATED" && uid) {
        void logClientAuditEvent({
          data: {
            category: "auth",
            event: "auth.user_updated",
            status: "success",
            actor_user_id: uid,
            actor_email: email,
          },
        }).catch(() => {});
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session?.user?.id) {
        lastLoggedUserRef.current = data.session.user.id;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
