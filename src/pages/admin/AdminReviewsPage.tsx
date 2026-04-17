import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllReviews, reviewsApi } from "@/hooks/useMarketplace";
import { Star, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ProductReview } from "@/types/marketplace";

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<ProductReview["status"] | "all">("pending");
  const { data: reviews, loading, reload } = useAllReviews(tab === "all" ? undefined : tab);

  const setStatus = async (id: string, status: ProductReview["status"]) => {
    await reviewsApi.setStatus(id, status);
    toast.success(status === "approved" ? "Avis approuvé" : "Avis rejeté");
    reload();
  };

  return (
    <DashboardLayout type="admin" title="Avis">
      <PageHeader title="Modération des avis" description="Approuver, signaler ou supprimer les avis clients" />

      <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="mb-4">
        <TabsList>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="approved">Approuvés</TabsTrigger>
          <TabsTrigger value="rejected">Rejetés</TabsTrigger>
          <TabsTrigger value="all">Tous</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? <div className="p-6 text-sm text-muted-foreground">Chargement...</div>
        : (reviews || []).length === 0 ? <EmptyState icon={<Star className="h-10 w-10" />} title="Aucun avis" description="Aucun avis dans cette catégorie." />
        : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auteur</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(reviews || []).map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.userName}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md text-sm text-muted-foreground">{r.comment}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("fr-DZ")}</TableCell>
                  <TableCell className="text-end">
                    {r.status !== "approved" && <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "approved")}><Check className="h-4 w-4 text-success" /></Button>}
                    {r.status !== "rejected" && <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "rejected")}><X className="h-4 w-4 text-destructive" /></Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
