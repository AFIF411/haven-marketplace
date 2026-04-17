import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { BarChart3, ShoppingBag, Store, Users } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <DashboardLayout type="admin" title="Rapports">
      <PageHeader title="Rapports plateforme" description="Vue d'ensemble des performances de la marketplace" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Boutiques actives" value="—" icon={<Store className="h-5 w-5" />} />
        <StatCard label="Commandes (mois)" value="—" icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard label="GMV (DZD)" value="—" icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard label="Utilisateurs" value="—" icon={<Users className="h-5 w-5" />} />
      </div>
      <div className="bg-card rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Graphiques à brancher sur votre backend (recharts).
      </div>
    </DashboardLayout>
  );
}
