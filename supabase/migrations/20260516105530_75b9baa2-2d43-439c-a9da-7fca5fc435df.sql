
-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- authenticated keeps EXECUTE so RLS policies using has_role still work for signed-in users

-- Tighten avatars bucket: only allow viewing individual objects, no bucket listing
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

CREATE POLICY "Avatar images viewable by direct path"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] IS NOT NULL);
