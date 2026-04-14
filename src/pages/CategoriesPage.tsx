import { Link } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { mockCategories } from "@/data/mockData";

export default function CategoriesPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <h1 className="font-heading text-2xl font-bold mb-6">Toutes les catégories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockCategories.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`} className="group bg-card rounded-lg border shadow-card hover:shadow-card-hover transition-all overflow-hidden">
              <div className="aspect-video overflow-hidden bg-secondary">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.count.toLocaleString()} articles</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
