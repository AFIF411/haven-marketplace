import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";

export default function AdminPromotionsPage() {
  return (
    <DashboardLayout type="admin" title="Promotions">
      <PageHeader
        title="Promotions plateforme"
        description="Codes promo et campagnes globales sur la marketplace"
        actions={<Button><Plus className="h-4 w-4 me-2" />Nouvelle promotion</Button>}
      />
      <div className="bg-card rounded-lg border p-8">
        <EmptyState icon={<Tag className="h-10 w-10" />} title="Aucune promotion active" description="Créez des codes promo applicables à toute la marketplace." />
      </div>
    </DashboardLayout>
  );
}
