import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Star } from "lucide-react";

export default function VendorReviewsPage() {
  return (
    <DashboardLayout type="vendor" title="Avis clients">
      <PageHeader title="Avis clients" description="Réponses et suivi des évaluations de vos produits" />
      <div className="bg-card rounded-lg border p-8">
        <EmptyState icon={<Star className="h-10 w-10" />} title="Pas encore d'avis" description="Vos premiers avis clients s'afficheront ici." />
      </div>
    </DashboardLayout>
  );
}
