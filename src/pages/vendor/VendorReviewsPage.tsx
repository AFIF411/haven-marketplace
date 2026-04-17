import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatCard } from "@/components/common/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllReviews } from "@/hooks/useMarketplace";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";

export default function VendorReviewsPage() {
  const { data: reviews, loading } = useAllReviews();
  const all = reviews || [];
  const avg = all.length ? (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1) : "—";
  const positive = all.filter(r => r.rating >= 4).length;

  return (
    <DashboardLayout type="vendor" title="Avis clients">
      <PageHeader title="Avis clients" description="Réponses et suivi des évaluations de vos produits" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Note moyenne" value={`${avg} ★`} icon={<Star className="h-5 w-5" />} />
        <StatCard label="Total avis" value={all.length} icon={<MessageSquare className="h-5 w-5" />} />
        <StatCard label="Avis positifs" value={positive} icon={<ThumbsUp className="h-5 w-5" />} trend="up" />
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? <div className="p-6 text-sm text-muted-foreground">Chargement...</div>
        : all.length === 0 ? <EmptyState icon={<Star className="h-10 w-10" />} title="Pas encore d'avis" description="Vos premiers avis clients s'afficheront ici." />
        : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auteur</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {all.map(r => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
