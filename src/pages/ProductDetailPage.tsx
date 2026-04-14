import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Truck, Shield, Minus, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts, formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const product = mockProducts[0];
  const images = [product.image, mockProducts[1].image, mockProducts[2].image, mockProducts[3].image];
  const { t } = useTranslation();

  return (
    <MarketplaceLayout>
      <div className="container py-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/categories" className="hover:text-foreground">Mode</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary border">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent hover:border-border'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Badge variant="success" className="mb-2">{t("product.inStock")}</Badge>
            <h1 className="font-heading text-2xl font-bold">{product.name}</h1>
            <Link to={`/shops/${product.shop}`} className="text-sm text-primary hover:underline mt-1 block">{product.shop}</Link>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-border'}`} />)}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} {t("product.reviews")})</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-heading text-3xl font-bold">{formatDZD(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatDZD(product.originalPrice)}</span>
                  <Badge variant="destructive">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>
                </>
              )}
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("product.description")}
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-16">{t("product.quantity")}</span>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
                  <span className="w-10 text-center text-sm font-medium">{qty}</span>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="me-2 h-4 w-4" /> {t("product.addToCart")}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" /> {t("product.delivery58")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" /> {t("product.freeReturn")}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="font-heading text-xl font-bold mb-4">{t("product.similar")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockProducts.slice(1, 5).map(p => <ProductCard key={p.id} {...p} />)}
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
}
