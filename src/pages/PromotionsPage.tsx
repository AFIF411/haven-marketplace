import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { usePublicProducts } from "@/hooks/usePublicCatalog";
import { usePromotions } from "@/hooks/useMarketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Percent, Copy, Tag, Truck, Flame } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";
import { toast } from "sonner";
import { useMemo } from "react";

export default function PromotionsPage() {
  const { t } = useTranslation();
  const { data: products, loading } = usePublicProducts();
  const { data: promos } = usePromotions();

  const promoProducts = useMemo(
    () => (products ?? []).filter((p) => p.originalPrice && p.originalPrice > p.price),
    [products]
  );

  const activeCodes = (promos ?? []).filter(
    (p) => p.active && new Date(p.endsAt).getTime() > Date.now()
  );

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copié`);
  };

  const iconFor = (type: string) =>
    type === "free_shipping" ? <Truck className="h-4 w-4" /> : type === "fixed" ? <Tag className="h-4 w-4" /> : <Percent className="h-4 w-4" />;

  const labelFor = (p: { type: string; value: number }) =>
    p.type === "percent" ? `-${p.value}%` : p.type === "fixed" ? `-${p.value} DZD` : "Livraison offerte";

  return (
    <MarketplaceLayout>
      <div className="container py-8 space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-center">
          <Percent className="h-10 w-10 text-primary-foreground mx-auto mb-2" />
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground">
            {t("promotions.title")}
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">{t("promotions.subtitle")}</p>
        </div>

        {/* Codes promo actifs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-bold">Codes promo actifs</h2>
            <Badge variant="secondary">{activeCodes.length}</Badge>
          </div>
          {activeCodes.length === 0 ? (
            <div className="bg-card border rounded-lg p-6 text-sm text-muted-foreground text-center">
              Aucun code promo actif pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCodes.map((p) => (
                <div
                  key={p.id}
                  className="bg-card border rounded-lg p-4 flex flex-col gap-3 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="gap-1">
                      {iconFor(p.type)} {labelFor(p)}
                    </Badge>
                    {p.minOrder ? (
                      <span className="text-xs text-muted-foreground">
                        Min. {p.minOrder} DZD
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-secondary rounded-md p-3 border border-dashed">
                    <span className="font-mono font-bold tracking-wider">{p.code}</span>
                    <Button size="sm" variant="ghost" onClick={() => copy(p.code)}>
                      <Copy className="h-4 w-4 me-1" /> Copier
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valable jusqu'au {new Date(p.endsAt).toLocaleDateString("fr-DZ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Produits en promotion */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-bold">Produits en promotion</h2>
            <Badge variant="secondary">{promoProducts.length}</Badge>
          </div>
          {loading ? (
            <div className="text-sm text-muted-foreground">Chargement…</div>
          ) : promoProducts.length === 0 ? (
            <div className="bg-card border rounded-lg p-6 text-sm text-muted-foreground text-center">
              Aucun produit en promotion pour le moment. Revenez bientôt !
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {promoProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  image={p.image}
                  rating={p.rating}
                  reviews={p.reviews}
                  shop={p.shop}
                  badge={p.badge}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </MarketplaceLayout>
  );
}
