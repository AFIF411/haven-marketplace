import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const purchases = [
  { ref: "ACH-001", supplier: "Textile Sétif SARL", date: "08/06/2026", items: 12, total: 145000, status: "Reçu" },
  { ref: "ACH-002", supplier: "Importex Alger", date: "01/06/2026", items: 30, total: 320000, status: "En attente" },
];

export default function VendorSuppliersPage() {
  return (
    <DashboardLayout type="vendor" title="Achats fournisseurs">
      <PageHeader title="Achats fournisseurs" description="Réapprovisionnement du stock" actions={<Button><Plus className="h-4 w-4 me-2" />Nouvel achat</Button>} />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Référence</TableHead><TableHead>Fournisseur</TableHead><TableHead>Date</TableHead>
            <TableHead className="text-center">Articles</TableHead><TableHead className="text-end">Total</TableHead><TableHead>Statut</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {purchases.map(p => (
              <TableRow key={p.ref}>
                <TableCell className="font-mono text-xs">{p.ref}</TableCell>
                <TableCell className="text-sm font-medium">{p.supplier}</TableCell>
                <TableCell className="text-sm">{p.date}</TableCell>
                <TableCell className="text-center">{p.items}</TableCell>
                <TableCell className="text-end font-medium">{p.total.toLocaleString()} DA</TableCell>
                <TableCell><Badge variant={p.status === "Reçu" ? "default" : "outline"}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
