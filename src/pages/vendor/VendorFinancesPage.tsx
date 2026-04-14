import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { DollarSign, TrendingUp, ArrowDownToLine, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const transactions = [
  { id: "TRX-001", type: "Vente", date: "15/01/2024", amount: 234, commission: 23.4, net: 210.6, status: "completed" },
  { id: "TRX-002", type: "Vente", date: "14/01/2024", amount: 89, commission: 8.9, net: 80.1, status: "completed" },
  { id: "TRX-003", type: "Retrait", date: "10/01/2024", amount: -500, commission: 0, net: -500, status: "pending" },
  { id: "TRX-004", type: "Vente", date: "08/01/2024", amount: 156, commission: 15.6, net: 140.4, status: "completed" },
];

export default function VendorFinancesPage() {
  return (
    <DashboardLayout type="vendor" title="Espace vendeur">
      <h1 className="font-heading text-xl font-bold mb-6">Finances</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Solde disponible", value: "2 340 €", icon: DollarSign },
          { label: "En attente", value: "450 €", icon: CreditCard },
          { label: "CA total", value: "12 450 €", icon: TrendingUp },
          { label: "Retraits", value: "8 200 €", icon: ArrowDownToLine },
        ].map(s => (
          <div key={s.label} className="bg-card p-4 rounded-lg border">
            <s.icon className="h-5 w-5 text-primary mb-2" />
            <p className="font-heading text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-semibold">Transactions</h2>
        <Button size="sm"><ArrowDownToLine className="mr-1 h-4 w-4" /> Demander un retrait</Button>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium">Réf.</th>
            <th className="text-left px-4 py-2.5 font-medium">Type</th>
            <th className="text-left px-4 py-2.5 font-medium">Date</th>
            <th className="text-right px-4 py-2.5 font-medium">Montant</th>
            <th className="text-right px-4 py-2.5 font-medium">Commission</th>
            <th className="text-right px-4 py-2.5 font-medium">Net</th>
            <th className="text-left px-4 py-2.5 font-medium">Statut</th>
          </tr></thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                <td className="px-4 py-3">{t.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                <td className="px-4 py-3 text-right font-medium">{t.amount > 0 ? '+' : ''}{t.amount} €</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{t.commission > 0 ? `-${t.commission}` : '-'} €</td>
                <td className="px-4 py-3 text-right font-medium">{t.net > 0 ? '+' : ''}{t.net} €</td>
                <td className="px-4 py-3"><Badge variant={t.status === 'completed' ? 'success' : 'warning'}>{t.status === 'completed' ? 'Complété' : 'En attente'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
