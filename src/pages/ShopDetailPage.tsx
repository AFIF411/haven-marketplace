import { Link } from "react-router-dom";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts, mockShops } from "@/data/mockData";

export default function ShopDetailPage() {
  const shop = mockShops[0];

  return (
    <MarketplaceLayout>
      {/* Cover */}
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
              {shop.verified && <Badge variant="success">Vérifié</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{shop.category} · {shop.products} produits</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{shop.rating}</span>
              <span className="text-sm text-muted-foreground">({shop.reviews} avis)</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1 h-3.5 w-3.5" /> Contacter
          </Button>
        </div>

        <div className="py-6">
          <h2 className="font-heading text-lg font-bold mb-4">Produits de {shop.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockProducts.map(p => <ProductCard key={p.id} {...p} shop={shop.name} />)}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
