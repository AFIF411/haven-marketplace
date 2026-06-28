
CREATE TYPE public.app_role AS ENUM ('client', 'vendeur', 'admin');
CREATE TYPE public.shop_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE public.product_status AS ENUM ('draft', 'active', 'archived', 'out_of_stock');
CREATE TYPE public.order_status AS ENUM ('pending','confirmed','preparing','shipped','delivered','cancelled','refunded');
CREATE TYPE public.payment_status AS ENUM ('unpaid','paid','refunded','partial');
CREATE TYPE public.payment_method AS ENUM ('cod','ccp','baridimob','card_cib','card_edahabia');
CREATE TYPE public.review_status AS ENUM ('pending','approved','rejected');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT, last_name TEXT, email TEXT, phone TEXT, avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name',''),
    COALESCE(NEW.raw_user_meta_data->>'last_name',''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
  name_ar TEXT, icon TEXT, image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SHOPS
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT,
  logo_url TEXT, cover_url TEXT, category TEXT, wilaya TEXT,
  phone TEXT, email TEXT, rc TEXT, nif TEXT,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  reviews_count INT NOT NULL DEFAULT 0,
  products_count INT NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  status public.shop_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shops TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.shops TO authenticated;
GRANT ALL ON public.shops TO service_role;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shops_public_active" ON public.shops FOR SELECT TO anon, authenticated
  USING (status='active' OR owner_id=auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "shops_vendeur_insert" ON public.shops FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=owner_id AND public.has_role(auth.uid(),'vendeur'));
CREATE POLICY "shops_owner_update" ON public.shops FOR UPDATE TO authenticated
  USING (auth.uid()=owner_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "shops_owner_delete" ON public.shops FOR DELETE TO authenticated
  USING (auth.uid()=owner_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_shops_updated BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  slug TEXT NOT NULL, name TEXT NOT NULL, description TEXT,
  price NUMERIC(12,2) NOT NULL, original_price NUMERIC(12,2),
  stock INT NOT NULL DEFAULT 0, sku TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  reviews_count INT NOT NULL DEFAULT 0,
  badge TEXT,
  status public.product_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_shop ON public.products(shop_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_active" ON public.products FOR SELECT TO anon, authenticated
  USING (status='active'
    OR EXISTS (SELECT 1 FROM public.shops s WHERE s.id=shop_id AND s.owner_id=auth.uid())
    OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_vendeur_all" ON public.products FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.shops s WHERE s.id=shop_id AND s.owner_id=auth.uid()) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.shops s WHERE s.id=shop_id AND s.owner_id=auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ADDRESSES
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL,
  phone TEXT NOT NULL, street TEXT NOT NULL, commune TEXT NOT NULL,
  wilaya TEXT NOT NULL, postal_code TEXT, is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses_own" ON public.addresses FOR ALL TO authenticated
  USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- ORDERS + ITEMS (tables d'abord, policies après)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  delivery_mode TEXT NOT NULL DEFAULT 'home',
  payment_method public.payment_method NOT NULL DEFAULT 'cod',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  status public.order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user ON public.orders(user_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, image_url TEXT,
  quantity INT NOT NULL, unit_price NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE RESTRICT,
  shop_name TEXT NOT NULL
);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_shop ON public.order_items(shop_id);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select" ON public.orders FOR SELECT TO authenticated
  USING (auth.uid()=user_id OR public.has_role(auth.uid(),'admin')
    OR EXISTS (SELECT 1 FROM public.order_items oi
       JOIN public.shops s ON s.id=oi.shop_id
       WHERE oi.order_id=orders.id AND s.owner_id=auth.uid()));
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=user_id);
CREATE POLICY "orders_update" ON public.orders FOR UPDATE TO authenticated
  USING (auth.uid()=user_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "order_items_select" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id=order_id AND
        (o.user_id=auth.uid() OR public.has_role(auth.uid(),'admin')))
    OR EXISTS (SELECT 1 FROM public.shops s WHERE s.id=shop_id AND s.owner_id=auth.uid()));
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id=order_id AND o.user_id=auth.uid()));

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status public.review_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_approved" ON public.reviews FOR SELECT TO anon, authenticated
  USING (status='approved' OR auth.uid()=user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE TO authenticated
  USING (auth.uid()=user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid()=user_id OR public.has_role(auth.uid(),'admin'));
