import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Store } from "lucide-react";

export default function AdminShopsPage() {
  return (
    <DashboardLayout type="admin" title="Boutiques">
      <PageHeader
        title="Boutiques"
        description="Validation, suspension et modération des boutiques vendeurs"
      />
      <div className="bg-card rounded-lg border p-8">
        <EmptyState
          icon={<Store className="h-10 w-10" />}
          title="Aucune boutique en attente"
          description="Les nouvelles demandes d'inscription apparaîtront ici pour validation."
        />
      </div>
    </DashboardLayout>
  );
}
