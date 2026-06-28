// ============================================================
// useVendorShop — récupère la boutique du vendeur connecté et
// quelques compteurs (produits, commandes, revenu) pour afficher
// des états vides cohérents tant qu'aucune donnée n'est saisie.
// ============================================================
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface VendorShopSummary {
  id: string;
  name: string;
  status: string;
}

export interface VendorStats {
  productCount: number;
  orderCount: number;
  revenue: number;
  visitorCount: number;
}

export function useVendorShop() {
  const { user } = useAuth();
  const [shop, setShop] = useState<VendorShopSummary | null>(null);
  const [stats, setStats] = useState<VendorStats>({ productCount: 0, orderCount: 0, revenue: 0, visitorCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const { data: shopRow } = await supabase
        .from("shops").select("id, name, status").eq("owner_id", user.id)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();

      if (cancelled) return;
      if (!shopRow) { setLoading(false); return; }
      setShop(shopRow as VendorShopSummary);

      const { count: productCount } = await supabase
        .from("products").select("id", { count: "exact", head: true }).eq("shop_id", shopRow.id);

      if (cancelled) return;
      setStats({
        productCount: productCount ?? 0,
        orderCount: 0,
        revenue: 0,
        visitorCount: 0,
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  return { shop, stats, loading, isEmpty: !!shop && stats.productCount === 0 && stats.orderCount === 0 };
}
