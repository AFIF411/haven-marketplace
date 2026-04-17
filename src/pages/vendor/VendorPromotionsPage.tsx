import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";

export default function VendorPromotionsPage() {
  return (
    <DashboardLayout type="vendor" title="Promotions">
      <PageHeader
        title="Mes promotions"
        description="Codes promo et remises de votre boutique"
        actions={<Button><Plus className="h-4 w-4 me-2" />Nouvelle promotion</Button>}
      />
      <div className="bg-card rounded-lg border p-8">
        <EmptyState icon={<Tag className="h-10 w-10" />} title="Aucune promotion" description="Créez votre première promotion pour booster vos ventes." />
      </div>
    </DashboardLayout>
  );
}
