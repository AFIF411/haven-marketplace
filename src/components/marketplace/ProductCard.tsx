import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  shop: string;
  badge?: string;
}

export function ProductCard({ id, name, price, originalPrice, image, rating, reviews, shop, badge }: ProductCardProps) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <div className="group bg-card rounded-lg border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      <Link to={`/products/${id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {badge && (
          <Badge className="absolute top-2 left-2" variant="default">{badge}</Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2" variant="destructive">-{discount}%</Badge>
        )}
        <button className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </button>
      </Link>
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{shop}</p>
        <Link to={`/products/${id}`}>
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">{name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="text-xs font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-base">{price.toLocaleString('fr-FR')} €</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{originalPrice.toLocaleString('fr-FR')} €</span>
            )}
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
