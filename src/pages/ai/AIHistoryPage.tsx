import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const history = [
  { date: "12/06/2026", type: "Description produit", input: "Sac cuir berbère", status: "Utilisé" },
  { date: "11/06/2026", type: "Page accueil", input: "Boutique mode femme", status: "Utilisé" },
  { date: "10/06/2026", type: "Catégories", input: "Bijoux artisanaux", status: "Sauvegardé" },
  { date: "09/06/2026", type: "Description produit", input: "Théière traditionnelle", status: "Brouillon" },
];

export default function AIHistoryPage() {
  return (
    <DashboardLayout type="vendor" title="Historique IA">
      <PageHeader title="Historique des générations" description="Retrouvez tous les contenus créés avec l'IA." />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Demande</TableHead><TableHead>Statut</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {history.map((h, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm">{h.date}</TableCell>
                <TableCell><Badge variant="outline">{h.type}</Badge></TableCell>
                <TableCell className="text-sm">{h.input}</TableCell>
                <TableCell><Badge variant={h.status === "Utilisé" ? "default" : "outline"}>{h.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
