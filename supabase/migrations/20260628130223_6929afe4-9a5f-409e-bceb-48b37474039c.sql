
-- 1) Restrict profiles SELECT to own profile or admin
DROP POLICY IF EXISTS profiles_select_auth ON public.profiles;
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Remove user_roles from realtime publication
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_roles'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.user_roles';
  END IF;
END $$;

-- 3) Revoke EXECUTE on SECURITY DEFINER function from anon/authenticated/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
