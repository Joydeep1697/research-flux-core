-- Shareable reports
ALTER TABLE public.research_reports
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_slug text;

CREATE UNIQUE INDEX IF NOT EXISTS research_reports_public_slug_key
  ON public.research_reports(public_slug) WHERE public_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS research_reports_user_created_idx
  ON public.research_reports(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_created_idx
  ON public.audit_logs(created_at DESC);

-- Anyone (including anon) can read a report when it is explicitly published
CREATE POLICY "Anyone can view public reports"
  ON public.research_reports
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);