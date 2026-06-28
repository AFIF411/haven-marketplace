
CREATE OR REPLACE FUNCTION public.become_vendeur(
  _name text,
  _description text,
  _wilaya text,
  _phone text,
  _category text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _slug text;
  _shop_id uuid;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _name IS NULL OR length(trim(_name)) < 2 THEN
    RAISE EXCEPTION 'Shop name required';
  END IF;

  -- Grant vendeur role (idempotent)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'vendeur')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Generate unique slug
  _slug := regexp_replace(lower(trim(_name)), '[^a-z0-9]+', '-', 'g');
  _slug := trim(both '-' from _slug);
  IF EXISTS (SELECT 1 FROM public.shops WHERE slug = _slug) THEN
    _slug := _slug || '-' || substr(_uid::text, 1, 6);
  END IF;

  INSERT INTO public.shops (owner_id, name, slug, description, wilaya, phone, category, status)
  VALUES (_uid, _name, _slug, _description, _wilaya, _phone, _category, 'pending')
  RETURNING id INTO _shop_id;

  RETURN _shop_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.become_vendeur(text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.become_vendeur(text,text,text,text,text) TO authenticated;
