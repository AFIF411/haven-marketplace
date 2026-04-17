import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { FolderTree, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  return (
    <DashboardLayout type="admin" title="Catégories">
      <PageHeader
        title="Catégories"
        description="Gérer l'arborescence des catégories de la marketplace"
        actions={<Button><Plus className="h-4 w-4 me-2" />Nouvelle catégorie</Button>}
      />
      <div className="bg-card rounded-lg border p-8">
        <EmptyState
          icon={<FolderTree className="h-10 w-10" />}
          title="Arborescence à construire"
          description="Créez vos catégories racines puis ajoutez des sous-catégories par glisser-déposer."
        />
      </div>
    </DashboardLayout>
  );
}
