import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const expenses = [
  { date: "10/06/2026", category: "Marketing", desc: "Campagne Facebook", amount: 15000 },
  { date: "08/06/2026", category: "Logistique", desc: "Frais Yalidine", amount: 8500 },
  { date: "05/06/2026", category: "Stock", desc: "Achat emballages", amount: 4200 },
];

export default function VendorExpensesPage() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return (
    <DashboardLayout type="vendor" title="Dépenses">
      <PageHeader title="Dépenses" description="Suivi des charges de la boutique" actions={<Button><Plus className="h-4 w-4 me-2" />Nouvelle dépense</Button>} />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg border bg-card"><div className="text-xs text-muted-foreground">Total ce mois</div><div className="text-2xl font-bold mt-1">{total.toLocaleString()} DA</div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="text-xs text-muted-foreground">Catégories</div><div className="text-2xl font-bold mt-1">3</div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="text-xs text-muted-foreground">Transactions</div><div className="text-2xl font-bold mt-1">{expenses.length}</div></div>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Catégorie</TableHead><TableHead>Description</TableHead><TableHead className="text-end">Montant</TableHead></TableRow></TableHeader>
          <TableBody>
            {expenses.map((e, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm">{e.date}</TableCell>
                <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                <TableCell className="text-sm">{e.desc}</TableCell>
                <TableCell className="text-end font-medium">{e.amount.toLocaleString()} DA</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
