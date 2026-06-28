import { useMemo, useState } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ShopCard } from "@/components/marketplace/ShopCard";
import { mockShops } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";
import { usePublicShops } from "@/hooks/usePublicCatalog";

export default function ShopsPage() {
  const { t } = useTranslation();
  const { data: dbShops, loading } = usePublicShops();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);

  const filters = [
    t("shops.allFilter"),
    t("cat.fashion"),
    t("cat.leather"),
    t("cat.wellness"),
    t("cat.food"),
    t("cat.craft"),
  ];

  const allShops = useMemo(() => {
    // Vraies boutiques publiées d'abord, puis quelques démos pour ne pas avoir de page vide.
    const real = dbShops;
    return [...real, ...mockShops.map(s => ({ ...s, verified: !!s.verified }))];
  }, [dbShops]);

  const filtered = useMemo(() => {
    let list = allShops;
    if (activeFilter > 0) {
      const f = filters[activeFilter].toLowerCase();
      list = list.filter(s => (s.category ?? "").toLowerCase().includes(f));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || (s as any).description?.toLowerCase().includes(q));
    }
    return list;
  }, [allShops, query, activeFilter, filters]);

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">{t("shops.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{dbShops.length} boutique(s) publiée(s)</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder={t("shops.search")}
              className="w-full h-9 ps-10 pe-4 rounded-md border bg-background text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f, i) => (
            <Button key={f} onClick={() => setActiveFilter(i)} size="sm"
              variant={i === activeFilter ? "default" : "outline"} className="rounded-full">{f}</Button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground border rounded-lg">Aucune boutique ne correspond.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => <ShopCard key={s.id} {...s} />)}
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
}
