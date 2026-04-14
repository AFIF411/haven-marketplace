import { useState } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts, mockCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="w-full md:w-56 shrink-0 space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">Catégories</h3>
              <div className="space-y-1">
                {mockCategories.map(c => (
                  <button key={c.name} className="w-full text-left text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    {c.name} <span className="text-xs">({c.count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">Prix</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-full h-9 px-3 rounded-md border text-sm bg-background" />
                <input type="number" placeholder="Max" className="w-full h-9 px-3 rounded-md border text-sm bg-background" />
              </div>
              <Button size="sm" variant="secondary" className="w-full mt-2">Appliquer</Button>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">Note minimum</h3>
              <div className="space-y-1">
                {[4, 3, 2].map(r => (
                  <button key={r} className="w-full text-left text-sm py-1.5 px-2 rounded-md hover:bg-accent transition-colors text-muted-foreground">
                    {"★".repeat(r)}{"☆".repeat(5-r)} & plus
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{mockProducts.length} produits trouvés</p>
              <div className="flex items-center gap-2">
                <select className="h-9 px-3 rounded-md border text-sm bg-background">
                  <option>Pertinence</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                  <option>Mieux notés</option>
                  <option>Nouveautés</option>
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
