import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Grid3X3, LayoutList, Loader2, X } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";
import { usePublicProducts } from "@/hooks/usePublicCatalog";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 12;
const PRICE_MIN = 0;
const PRICE_MAX = 100000;
type Sort = "relevance" | "price-asc" | "price-desc" | "rating" | "newest";

interface DbCategory { id: string; name: string; slug: string; }

export default function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dbProducts, loading } = usePublicProducts();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [categorySlug, setCategorySlug] = useState<string | null>(
    searchParams.get("category")
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("relevance");
  const [page, setPage] = useState(1);

  // Load real categories
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug")
        .order("name");
      setCategories((data || []) as DbCategory[]);
    })();
  }, []);

  // Sync URL ?category=
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (categorySlug) next.set("category", categorySlug);
    else next.delete("category");
    setSearchParams(next, { replace: true });
  }, [categorySlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const allProducts = useMemo(
    () => [...dbProducts, ...mockProducts],
    [dbProducts]
  );

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (categorySlug) {
      list = list.filter((p: any) => {
        const slug = p.category_slug ?? null;
        const name = p.category ?? null;
        return (
          slug === categorySlug ||
          (typeof name === "string" &&
            name.toLowerCase() === categorySlug.toLowerCase())
        );
      });
    }
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (minRating != null)
      list = list.filter((p) => (p.rating ?? 0) >= minRating);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "newest": list.reverse(); break;
    }
    return list;
  }, [allProducts, categorySlug, priceRange, minRating, sort]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [categorySlug, priceRange, minRating, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeCategoryLabel =
    categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug;
  const hasActiveFilters =
    !!categorySlug ||
    priceRange[0] !== PRICE_MIN ||
    priceRange[1] !== PRICE_MAX ||
    minRating != null;

  const clearAll = () => {
    setCategorySlug(null);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setMinRating(null);
  };

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-60 shrink-0 space-y-6">
            {/* Catégories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-sm">
                  {t("nav.categories")}
                </h3>
                {categorySlug && (
                  <button
                    onClick={() => setCategorySlug(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-64 overflow-auto pr-1">
                <button
                  onClick={() => setCategorySlug(null)}
                  className={`w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors ${
                    categorySlug === null
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("filter.all")}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategorySlug(c.slug)}
                    className={`w-full text-start text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors ${
                      categorySlug === c.slug
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
                {categories.length === 0 && (
                  <div className="text-xs text-muted-foreground px-2 py-1">
                    Aucune catégorie.
                  </div>
                )}
              </div>
            </div>

            {/* Prix */}
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">
                {t("products.price")}
              </h3>
              <Slider
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={500}
                minStepsBetweenThumbs={1}
                className="my-3"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{priceRange[0].toLocaleString()} DA</span>
                <span>{priceRange[1].toLocaleString()} DA</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  min={PRICE_MIN}
                  max={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      Math.max(PRICE_MIN, Math.min(+e.target.value || 0, priceRange[1])),
                      priceRange[1],
                    ])
                  }
                  className="w-full h-9 px-2 rounded-md border text-sm bg-background"
                  placeholder={t("products.min")}
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  min={priceRange[0]}
                  max={PRICE_MAX}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      Math.min(PRICE_MAX, Math.max(+e.target.value || 0, priceRange[0])),
                    ])
                  }
                  className="w-full h-9 px-2 rounded-md border text-sm bg-background"
                  placeholder={t("products.max")}
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">Note minimale</h3>
              <div className="flex gap-1.5 flex-wrap">
                {[null, 3, 4, 4.5].map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setMinRating(r)}
                    className={`px-2.5 h-8 rounded-md border text-xs ${
                      minRating === r
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-accent"
                    }`}
                  >
                    {r == null ? "Toutes" : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <X className="h-3.5 w-3.5 me-1" />
                Effacer les filtres
              </Button>
            )}
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div>
                <h1 className="font-heading text-xl font-bold">
                  {activeCategoryLabel ?? t("nav.products")}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {filtered.length} produit(s) — {dbProducts.length} publiés par les
                  vendeurs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-9 px-2 rounded-md border bg-background text-sm"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                  <option value="newest">Plus récents</option>
                </select>
                <Button
                  size="icon"
                  variant={view === "grid" ? "default" : "outline"}
                  className="h-9 w-9"
                  onClick={() => setView("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={view === "list" ? "default" : "outline"}
                  className="h-9 w-9"
                  onClick={() => setView("list")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chips de filtres actifs */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {categorySlug && (
                  <button
                    onClick={() => setCategorySlug(null)}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-accent text-xs"
                  >
                    {activeCategoryLabel}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {(priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX) && (
                  <button
                    onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-accent text-xs"
                  >
                    {priceRange[0].toLocaleString()}–
                    {priceRange[1].toLocaleString()} DA
                    <X className="h-3 w-3" />
                  </button>
                )}
                {minRating != null && (
                  <button
                    onClick={() => setMinRating(null)}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-accent text-xs"
                  >
                    {minRating}★+
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin inline" />
              </div>
            ) : pageItems.length === 0 ? (
              <div className="text-center py-16 text-sm text-muted-foreground border rounded-lg">
                Aucun produit ne correspond à ces filtres.
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "space-y-3"
                }
              >
                {pageItems.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                >
                  Précédent
                </Button>
                <span className="text-sm">
                  {safePage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
