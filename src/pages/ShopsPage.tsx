import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ShopCard } from "@/components/marketplace/ShopCard";
import { mockShops } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ShopsPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-heading text-2xl font-bold">Toutes les boutiques</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Rechercher une boutique..." className="w-full h-9 pl-10 pr-4 rounded-md border bg-background text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {["Toutes", "Mode", "Maroquinerie", "Bien-être", "Alimentation", "Artisanat"].map((f, i) => (
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
