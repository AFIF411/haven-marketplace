import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts } from "@/data/mockData";
import { Percent } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

export default function PromotionsPage() {
  const promoProducts = mockProducts.filter(p => p.originalPrice);
  const { t } = useTranslation();

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="bg-primary rounded-xl p-8 mb-8 text-center">
          <Percent className="h-10 w-10 text-primary-foreground mx-auto mb-2" />
          <h1 className="font-heading text-2xl font-bold text-primary-foreground">{t("promotions.title")}</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">{t("promotions.subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...promoProducts, ...promoProducts, ...promoProducts, ...promoProducts].map((p, i) => (
            <ProductCard key={`${p.id}-${i}`} {...p} />
          ))}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
