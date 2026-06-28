// ============================================================
// Hooks publics : récupèrent les boutiques et produits ACTIFS
// depuis Supabase (RLS public_active autorise l'anonyme).
// Les pages publiques fusionnent les données réelles avec
// quelques mocks de démo pour ne jamais afficher une page vide.
// ============================================================
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { pickShopCover, pickShopLogo } from "@/lib/shopImages";

export interface PublicShop {
  id: string;
  name: string;
  slug: string;
  category: string;
  logo: string;
  cover: string;
  rating: number;
  reviews: number;
  products: number;
  verified: boolean;
  description?: string;
  wilaya?: string;
}

export interface PublicProduct {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  shop: string;
  badge?: string;
  description?: string;
  stock?: number;
  category_id?: string | null;
  category?: string | null;
  category_slug?: string | null;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600";
const FALLBACK_LOGO = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200";

export function usePublicShops() {
  const [data, setData] = useState<PublicShop[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase
        .from("shops")
        .select("id,name,slug,category,logo_url,cover_url,rating,reviews_count,products_count,verified,description,wilaya")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      const shops = rows ?? [];
      // Récupère la 1ère image produit publiée par boutique pour adapter la cover.
      const ids = shops.map((s: any) => s.id);
      const firstImageByShop: Record<string, string> = {};
      if (ids.length) {
        const { data: prods } = await supabase
          .from("products")
          .select("shop_id,images,created_at")
          .in("shop_id", ids)
          .eq("status", "active")
          .order("created_at", { ascending: false });
        for (const p of prods ?? []) {
          const sid = (p as any).shop_id as string;
          const imgs = Array.isArray((p as any).images) ? (p as any).images : [];
          if (!firstImageByShop[sid] && imgs[0]) firstImageByShop[sid] = imgs[0];
        }
      }
      setData(shops.map((r: any) => {
        const productImage = firstImageByShop[r.id] ?? null;
        return {
          id: r.id, name: r.name, slug: r.slug,
          category: r.category ?? "Général",
          logo: pickShopLogo({ logo: r.logo_url, productImage, category: r.category, name: r.name }),
          cover: pickShopCover({ cover: r.cover_url, productImage, category: r.category, name: r.name }),
          rating: Number(r.rating ?? 0),
          reviews: r.reviews_count ?? 0,
          products: r.products_count ?? 0,
          verified: !!r.verified,
          description: r.description ?? undefined,
          wilaya: r.wilaya ?? undefined,
        };
      }));
      setLoading(false);
    })();
  }, []);
  return { data, loading };
}

export function usePublicProducts(opts?: { shopId?: string }) {
  const [data, setData] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      let q = supabase
        .from("products")
        .select("id,shop_id,name,price,original_price,images,rating,reviews_count,badge,description,stock,category_id,shops!inner(name,status),categories(name,slug)")
        .eq("status", "active")
        .eq("shops.status", "active")
        .order("created_at", { ascending: false });
      if (opts?.shopId) q = q.eq("shop_id", opts.shopId);
      const { data: rows } = await q;
      setData((rows ?? []).map((r: any) => {
        const imgs = Array.isArray(r.images) ? r.images : [];
        return {
          id: r.id, shop_id: r.shop_id, name: r.name,
          price: Number(r.price),
          originalPrice: r.original_price ? Number(r.original_price) : undefined,
          image: imgs[0] ?? FALLBACK_IMG,
          images: imgs,
          rating: Number(r.rating ?? 0),
          reviews: r.reviews_count ?? 0,
          shop: r.shops?.name ?? "Boutique",
          badge: r.badge ?? undefined,
          description: r.description ?? undefined,
          stock: r.stock ?? 0,
          category_id: r.category_id ?? null,
          category: r.categories?.name ?? null,
          category_slug: r.categories?.slug ?? null,
        };
      }));
      setLoading(false);
    })();
  }, [opts?.shopId]);
  return { data, loading };
}

export function usePublicShop(id?: string) {
  const [shop, setShop] = useState<PublicShop | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      const { data: r } = await supabase
        .from("shops")
        .select("id,name,slug,category,logo_url,cover_url,rating,reviews_count,products_count,verified,description,wilaya")
        .eq("id", id).eq("status", "active").maybeSingle();
      if (r) {
        setShop({
          id: r.id, name: r.name, slug: r.slug,
          category: r.category ?? "Général",
          logo: r.logo_url ?? FALLBACK_LOGO,
          cover: r.cover_url ?? FALLBACK_IMG,
          rating: Number(r.rating ?? 0),
          reviews: r.reviews_count ?? 0,
          products: r.products_count ?? 0,
          verified: !!r.verified,
          description: r.description ?? undefined,
          wilaya: r.wilaya ?? undefined,
        });
      }
      setLoading(false);
    })();
  }, [id]);
  return { shop, loading };
}

export function usePublicProduct(id?: string) {
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      const { data: r } = await supabase
        .from("products")
        .select("id,shop_id,name,price,original_price,images,rating,reviews_count,badge,description,stock,shops!inner(name,status)")
        .eq("id", id).eq("status", "active").maybeSingle();
      if (r) {
        const imgs = Array.isArray((r as any).images) ? (r as any).images : [];
        setProduct({
          id: r.id, shop_id: (r as any).shop_id, name: r.name,
          price: Number(r.price),
          originalPrice: (r as any).original_price ? Number((r as any).original_price) : undefined,
          image: imgs[0] ?? FALLBACK_IMG,
          images: imgs,
          rating: Number(r.rating ?? 0),
          reviews: (r as any).reviews_count ?? 0,
          shop: (r as any).shops?.name ?? "Boutique",
          badge: (r as any).badge ?? undefined,
          description: r.description ?? undefined,
          stock: (r as any).stock ?? 0,
        });
      }
      setLoading(false);
    })();
  }, [id]);
  return { product, loading };
}
