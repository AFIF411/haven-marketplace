import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShopCardProps {
  id: string;
  name: string;
  logo: string;
  cover: string;
  rating: number;
  reviews: number;
  products: number;
  category: string;
  verified?: boolean;
}

export function ShopCard({ id, name, logo, cover, rating, reviews, products, category, verified }: ShopCardProps) {
  return (
    <Link to={`/shops/${id}`} className="group block bg-card rounded-lg border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      <div className="relative h-28 bg-secondary overflow-hidden">
        <img src={cover} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 relative">
        <div className="absolute -top-6 left-4 h-12 w-12 rounded-lg border-2 border-card bg-card overflow-hidden shadow-card">
          <img src={logo} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="ml-14 -mt-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading font-semibold text-sm">{name}</h3>
            {verified && <Badge variant="success" className="text-[10px] px-1.5 py-0">Vérifié</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-medium text-foreground">{rating}</span>
            <span>({reviews} avis)</span>
          </div>
          <span>{products} produits</span>
        </div>
      </div>
    </Link>
  );
}
