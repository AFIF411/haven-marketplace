import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts } from "@/data/mockData";

export default function WishlistPage() {
  return (
    <DashboardLayout type="client" title="Mon compte">
      <h1 className="font-heading text-xl font-bold mb-6">Ma wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockProducts.slice(0, 6).map(p => <ProductCard key={p.id} {...p} />)}
      </div>
    </DashboardLayout>
  );
}
