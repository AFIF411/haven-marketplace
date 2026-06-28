import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useTranslation } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  icon: string | null;
  image_url: string | null;
  productCount?: number;
}

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, name_ar, slug, icon, image_url")
        .order("name", { ascending: true });

      const list = (cats || []) as Category[];

      // Compte de produits actifs par catégorie (best-effort)
      if (list.length) {
        const counts = await Promise.all(
          list.map(async (c) => {
            const { count } = await supabase
              .from("products")
              .select("id", { count: "exact", head: true })
              .eq("category_id", c.id)
              .eq("status", "active");
            return [c.id, count || 0] as const;
          })
        );
        const map = new Map(counts);
        setCategories(list.map((c) => ({ ...c, productCount: map.get(c.id) || 0 })));
      } else {
        setCategories([]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 flex items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement des catégories…
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <h1 className="font-heading text-2xl font-bold mb-6">{t("categories.title")}</h1>

        {categories.length === 0 ? (
          <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
            <Tag className="h-8 w-8 mx-auto mb-3 opacity-50" />
            Aucune catégorie disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group bg-card rounded-lg border shadow-card hover:shadow-card-hover transition-all overflow-hidden"
              >
                <div className="aspect-video overflow-hidden bg-secondary flex items-center justify-center">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl">{cat.icon || "🛍️"}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(cat.productCount || 0).toLocaleString()} {t("common.articles")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
}
