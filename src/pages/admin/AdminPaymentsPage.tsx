import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, RotateCcw, Wallet } from "lucide-react";

const payments = [
  { id: "PAY-1024", date: "12/06", vendor: "Artisan Kabyle", method: "CIB", amount: 12500, commission: 625, status: "Réussi" },
  { id: "PAY-1023", date: "12/06", vendor: "Mode Alger", method: "Edahabia", amount: 8400, commission: 420, status: "Réussi" },
  { id: "PAY-1022", date: "11/06", vendor: "Tech Oran", method: "COD", amount: 35000, commission: 1750, status: "En attente" },
  { id: "PAY-1021", date: "11/06", vendor: "Bijoux DZ", method: "BaridiMob", amount: 5200, commission: 260, status: "Remboursé" },
];

export default function AdminPaymentsPage() {
  return (
    <DashboardLayout type="admin" title="Paiements">
      <PageHeader title="Paiements & Commissions" description="Vue globale sur toutes les transactions." />
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Volume total" value="2 450 000 DA" icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Commissions" value="122 500 DA" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Transactions" value="847" icon={<CreditCard className="h-4 w-4" />} />
        <StatCard label="Remboursements" value="12" icon={<RotateCcw className="h-4 w-4" />} />
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Référence</TableHead><TableHead>Date</TableHead><TableHead>Vendeur</TableHead>
            <TableHead>Méthode</TableHead><TableHead className="text-end">Montant</TableHead>
            <TableHead className="text-end">Commission</TableHead><TableHead>Statut</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {payments.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell className="text-sm">{p.date}</TableCell>
                <TableCell className="text-sm font-medium">{p.vendor}</TableCell>
                <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                <TableCell className="text-end">{p.amount.toLocaleString()} DA</TableCell>
                <TableCell className="text-end text-primary font-medium">{p.commission.toLocaleString()} DA</TableCell>
                <TableCell><Badge variant={p.status === "Réussi" ? "default" : p.status === "Remboursé" ? "destructive" : "outline"}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
