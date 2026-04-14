import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockProducts } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

export default function WishlistPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout type="client" title={t("sidebar.myAccount")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("client.myWishlist")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockProducts.slice(0, 6).map(p => <ProductCard key={p.id} {...p} />)}
      </div>
    </DashboardLayout>
  );
}
