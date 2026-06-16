import { useMemo, useState } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts, mockCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Grid3X3, LayoutList } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

const PAGE_SIZE = 12;

type Sort = "relevance" | "price-asc" | "price-desc" | "rating" | "newest";

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<string | null>(null);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("relevance");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    let list = [...mockProducts];
    if (category) list = list.filter(p => (p as any).category === category);
    if (priceRange.min != null) list = list.filter(p => p.price >= priceRange.min!);
    if (priceRange.max != null) list = list.filter(p => p.price <= priceRange.max!);
    if (minRating != null) list = list.filter(p => (p.rating ?? 0) >= minRating);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "newest": list.reverse(); break;
    }
    return list;
  }, [category, priceRange, minRating, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const applyPrice = () => {
    setPriceRange({
      min: minPriceInput ? Number(minPriceInput) : undefined,
      max: maxPriceInput ? Number(maxPriceInput) : undefined,
    });
    setPage(1);
  };

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-56 shrink-0 space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">{t("nav.categories")}</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setCategory(null); setPage(1); }}
                  className={`w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors ${category === null ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground'}`}
                >
                  {t("filter.all")}
                </button>
                {mockCategories.map(c => (
                  <button
                    key={c.name}
                    onClick={() => { setCategory(c.name); setPage(1); }}
                    className={`w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors ${category === c.name ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {c.name} <span className="text-xs">({c.count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">{t("products.price")}</h3>
              <div className="flex gap-2">
                <input type="number" value={minPriceInput} onChange={e => setMinPriceInput(e.target.value)} placeholder={t("products.min")} className="w-full h-9 px-3 rounded-md border text-sm bg-background" />
                <input type="number" value={maxPriceInput} onChange={e => setMaxPriceInput(e.target.value)} placeholder={t("products.max")} className="w-full h-9 px-3 rounded-md border text-sm bg-background" />
              </div>
              <Button onClick={applyPrice} size="sm" variant="secondary" className="w-full mt-2">{t("common.apply")}</Button>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">{t("products.minRating")}</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setMinRating(null); setPage(1); }}
                  className={`w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors ${minRating === null ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground'}`}
                >
                  {t("filter.all")}
                </button>
                {[4, 3, 2].map(r => (
                  <button
                    key={r}
                    onClick={() => { setMinRating(r); setPage(1); }}
                    className={`w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors ${minRating === r ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground'}`}
                  >
                    {"★".repeat(r)}{"☆".repeat(5 - r)} {t("common.andMore")}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{filtered.length} {t("products.found")}</p>
              <div className="flex items-center gap-2">
                <select value={sort} onChange={e => { setSort(e.target.value as Sort); setPage(1); }} className="h-9 px-3 rounded-md border text-sm bg-background">
                  <option value="relevance">{t("products.relevance")}</option>
                  <option value="price-asc">{t("products.priceAsc")}</option>
                  <option value="price-desc">{t("products.priceDesc")}</option>
                  <option value="rating">{t("products.bestRated")}</option>
                  <option value="newest">{t("products.newest")}</option>
                </select>
                <Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} className="h-9 w-9" onClick={() => setView("grid")}>
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant={view === "list" ? "secondary" : "ghost"} className="h-9 w-9" onClick={() => setView("list")}>
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {pageItems.length === 0 ? (
              <div className="text-center py-16 text-sm text-muted-foreground border rounded-lg">
                Aucun produit ne correspond à ces filtres.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {pageItems.map(p => <ProductCard key={p.id} {...p} />)}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <Button key={n} onClick={() => setPage(n)} size="sm" variant={n === safePage ? "default" : "ghost"} className="h-9 w-9 p-0">{n}</Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
