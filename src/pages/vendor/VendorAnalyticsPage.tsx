import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { BarChart3, Eye, ShoppingBag, TrendingUp } from "lucide-react";

export default function VendorAnalyticsPage() {
  return (
    <DashboardLayout type="vendor" title="Analytics">
      <PageHeader title="Analytics" description="Performance de votre boutique" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Vues boutique" value="—" icon={Eye} />
        <StatCard label="Commandes" value="—" icon={ShoppingBag} />
        <StatCard label="CA (DZD)" value="—" icon={BarChart3} />
        <StatCard label="Taux conversion" value="—" icon={TrendingUp} />
      </div>
      <div className="bg-card rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Graphiques à brancher sur votre backend.
      </div>
    </DashboardLayout>
  );
}
