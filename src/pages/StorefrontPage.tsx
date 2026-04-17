import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail, BadgeCheck } from "lucide-react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useShopBySlug, useShopPage, useProductsList } from "@/hooks/useMarketplace";
import { BlocksList } from "@/lib/pageBuilder/BlockRenderer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

export default function StorefrontPage() {
  const { slug } = useParams();
  const { data: shop, loading } = useShopBySlug(slug);
  const { data: page } = useShopPage(shop?.id);
  const { data: products } = useProductsList({ shopId: shop?.id });

  if (loading) return <MarketplaceLayout><div className="container py-8"><Skeleton className="h-64 w-full" /></div></MarketplaceLayout>;
  if (!shop) return <MarketplaceLayout><div className="container py-12"><EmptyState title="Boutique introuvable" description="Cette boutique n'existe pas." /></div></MarketplaceLayout>;

  return (
    <MarketplaceLayout>
      {/* Header boutique */}
      <div className="relative h-48 md:h-64 bg-secondary">
        {shop.coverUrl && <img src={shop.coverUrl} alt={shop.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="container -mt-16 relative z-10">
        <div className="bg-card rounded-xl border p-4 md:p-6 flex flex-wrap items-end gap-4">
          <div className="h-24 w-24 rounded-xl border-4 border-card overflow-hidden bg-muted shrink-0 -mt-12">
            {shop.logoUrl && <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-2xl font-bold">{shop.name}</h1>
              {shop.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{shop.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {shop.rating} ({shop.reviewsCount} avis)</span>
              {shop.wilaya && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {shop.wilaya}</span>}
              {shop.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {shop.phone}</span>}
              {shop.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {shop.email}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Page Builder rendu */}
      <div className="container py-8 space-y-8">
        {page && page.blocks.length > 0 && <BlocksList blocks={page.blocks} />}

        {/* Tous les produits */}
        <div id="products">
          <h2 className="font-heading text-2xl font-bold mb-4">Tous nos produits</h2>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} originalPrice={p.originalPrice}
                  image={p.images[0]?.url || ""} rating={p.rating} reviews={p.reviewsCount} shop={p.shopName} badge={p.badge} />
              ))}
            </div>
          ) : (
            <EmptyState title="Aucun produit" description="Cette boutique n'a pas encore publié de produits." />
          )}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
