import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const reports = [
  { id: "R-512", target: "Produit : iPhone copie", type: "Produit", reason: "Contrefaçon", reporter: "Karim B.", date: "12/06" },
  { id: "R-511", target: "Boutique : Quick Deals", type: "Boutique", reason: "Pratiques trompeuses", reporter: "3 utilisateurs", date: "11/06" },
  { id: "R-510", target: "Avis sur 'Sac cuir'", type: "Avis", reason: "Contenu inapproprié", reporter: "Vendeur", date: "10/06" },
];

export default function AdminReportsModerationPage() {
  return (
    <DashboardLayout type="admin" title="Signalements">
      <PageHeader title="Signalements" description="Modération des contenus signalés." />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>ID</TableHead><TableHead>Cible</TableHead><TableHead>Type</TableHead>
            <TableHead>Motif</TableHead><TableHead>Signalé par</TableHead><TableHead>Date</TableHead><TableHead className="text-end">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {reports.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="text-sm font-medium">{r.target}</TableCell>
                <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                <TableCell className="text-sm">{r.reason}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.reporter}</TableCell>
                <TableCell className="text-sm">{r.date}</TableCell>
                <TableCell className="text-end">
                  <Button size="sm" variant="ghost"><CheckCircle className="h-4 w-4 text-primary" /></Button>
                  <Button size="sm" variant="ghost"><XCircle className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
