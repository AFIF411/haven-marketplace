import { useState } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts, mockCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Grid3X3, LayoutList } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { t } = useTranslation();

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-56 shrink-0 space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">{t("nav.categories")}</h3>
              <div className="space-y-1">
                {mockCategories.map(c => (
                  <button key={c.name} className="w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    {c.name} <span className="text-xs">({c.count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">{t("products.price")}</h3>
              <div className="flex gap-2">
                <input type="number" placeholder={t("products.min")} className="w-full h-9 px-3 rounded-md border text-sm bg-background" />
                <input type="number" placeholder={t("products.max")} className="w-full h-9 px-3 rounded-md border text-sm bg-background" />
              </div>
              <Button size="sm" variant="secondary" className="w-full mt-2">{t("common.apply")}</Button>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">{t("products.minRating")}</h3>
              <div className="space-y-1">
                {[4, 3, 2].map(r => (
                  <button key={r} className="w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors text-muted-foreground">
                    {"★".repeat(r)}{"☆".repeat(5 - r)} {t("common.andMore")}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{mockProducts.length} {t("products.found")}</p>
              <div className="flex items-center gap-2">
                <select className="h-9 px-3 rounded-md border text-sm bg-background">
                  <option>{t("products.relevance")}</option>
                  <option>{t("products.priceAsc")}</option>
                  <option>{t("products.priceDesc")}</option>
                  <option>{t("products.bestRated")}</option>
                  <option>{t("products.newest")}</option>
                </select>
                <Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} className="h-9 w-9" onClick={() => setView("grid")}>
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant={view === "list" ? "secondary" : "ghost"} className="h-9 w-9" onClick={() => setView("list")}>
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[...mockProducts, ...mockProducts].map((p, i) => <ProductCard key={`${p.id}-${i}`} {...p} />)}
            </div>
            <div className="flex justify-center mt-8 gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <Button key={n} size="sm" variant={n === 1 ? "default" : "ghost"} className="h-9 w-9 p-0">{n}</Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
