import { useParams, Link } from "react-router-dom";
import { Star, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts, mockShops } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";
import { usePublicShop, usePublicProducts } from "@/hooks/usePublicCatalog";

export default function ShopDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { shop: dbShop, loading } = usePublicShop(id);
  const { data: dbProducts } = usePublicProducts({ shopId: dbShop?.id });

  if (loading) {
    return <MarketplaceLayout><div className="container py-16 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></div></MarketplaceLayout>;
  }
  if (!dbShop) {
    return <MarketplaceLayout><div className="container py-16 text-center text-sm text-muted-foreground">Boutique introuvable ou non publiée.</div></MarketplaceLayout>;
  }
  const shop = dbShop;
  const productsToShow = dbProducts;

  if (loading) {
    return <MarketplaceLayout><div className="container py-16 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></div></MarketplaceLayout>;
  }
  if (!shop) {
    return <MarketplaceLayout><div className="container py-16 text-center text-sm text-muted-foreground">Boutique introuvable ou non publiée.</div></MarketplaceLayout>;
  }

  return (
    <MarketplaceLayout>
      <div className="relative h-48 md:h-56 bg-secondary overflow-hidden">
        <img src={shop.cover} alt={shop.name} className="w-full h-full object-cover" />
      </div>
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start gap-4 -mt-8 relative z-10 mb-6">
          <div className="h-20 w-20 rounded-xl border-4 border-card bg-card overflow-hidden shadow-elevated">
            <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold">{shop.name}</h1>
              {shop.verified && <Badge variant="success">{t("common.verified")}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {shop.category} · {productsToShow.length} {t("common.products")}
              {shop.wilaya ? ` · ${shop.wilaya}` : ""}
            </p>
            {shop.description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{shop.description}</p>}
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{shop.rating}</span>
              <span className="text-sm text-muted-foreground">({shop.reviews} {t("common.reviews")})</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="me-1 h-3.5 w-3.5" /> {t("common.contact")}
          </Button>
        </div>

        <div className="py-6">
          <h2 className="font-heading text-lg font-bold mb-4">{t("shops.productsOf")} {shop.name}</h2>
          {productsToShow.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground border rounded-lg">
              Cette boutique n'a pas encore publié de produit.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsToShow.map(p => <ProductCard key={p.id} {...p as any} />)}
            </div>
          )}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
