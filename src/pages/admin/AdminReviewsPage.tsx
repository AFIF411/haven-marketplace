import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Star } from "lucide-react";

export default function AdminReviewsPage() {
  return (
    <DashboardLayout type="admin" title="Avis">
      <PageHeader
        title="Modération des avis"
        description="Approuver, signaler ou supprimer les avis clients"
      />
      <div className="bg-card rounded-lg border p-8">
        <EmptyState icon={Star} title="Aucun avis à modérer" description="Les avis signalés apparaîtront ici." />
      </div>
    </DashboardLayout>
  );
}
