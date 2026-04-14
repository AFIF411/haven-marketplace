import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ShopCard } from "@/components/marketplace/ShopCard";
import { mockShops } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

export default function ShopsPage() {
  const { t } = useTranslation();

  const filters = [
    t("shops.allFilter"),
    t("cat.fashion"),
    t("cat.leather"),
    t("cat.wellness"),
    t("cat.food"),
    t("cat.craft"),
  ];

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-heading text-2xl font-bold">{t("shops.title")}</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder={t("shops.search")} className="w-full h-9 ps-10 pe-4 rounded-md border bg-background text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f, i) => (
            <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...mockShops, ...mockShops].map((s, i) => <ShopCard key={`${s.id}-${i}`} {...s} />)}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
