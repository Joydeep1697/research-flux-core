
CREATE TYPE public.audit_event_category AS ENUM ('auth', 'billing', 'access_denied', 'admin', 'data');
CREATE TYPE public.audit_event_status AS ENUM ('success', 'failure', 'denied');

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  category public.audit_event_category NOT NULL,
  event text NOT NULL,
  status public.audit_event_status NOT NULL DEFAULT 'success',
  actor_user_id uuid,
  actor_email text,
  ip_address text,
  user_agent text,
  resource text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs (actor_user_id, created_at DESC);
CREATE INDEX idx_audit_logs_category ON public.audit_logs (category, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins only can read. No INSERT/UPDATE/DELETE policies -> only service_role (bypasses RLS) can write.
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
