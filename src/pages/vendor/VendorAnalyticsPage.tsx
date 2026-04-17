import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { BarChart3, Eye, ShoppingBag, TrendingUp } from "lucide-react";

export default function VendorAnalyticsPage() {
  return (
    <DashboardLayout type="vendor" title="Analytics">
      <PageHeader title="Analytics" description="Performance de votre boutique" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Vues boutique" value="—" icon={<Eye className="h-5 w-5" />} />
        <StatCard label="Commandes" value="—" icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard label="CA (DZD)" value="—" icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard label="Taux conversion" value="—" icon={<TrendingUp className="h-5 w-5" />} />
      </div>
      <div className="bg-card rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Graphiques à brancher sur votre backend.
      </div>
    </DashboardLayout>
  );
}
