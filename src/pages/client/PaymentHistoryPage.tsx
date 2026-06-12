import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const history = [
  { id: "PAY-1024", date: "12/06/2026", order: "#1245", method: "Edahabia", amount: 6400, status: "Réussi" },
  { id: "PAY-0998", date: "05/06/2026", order: "#1238", method: "Paiement à la livraison", amount: 2800, status: "Réussi" },
  { id: "PAY-0942", date: "28/05/2026", order: "#1220", method: "CIB", amount: 12500, status: "Réussi" },
];

export default function PaymentHistoryPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-8 max-w-4xl">
        <h1 className="font-heading text-2xl font-bold">Historique des paiements</h1>
        <p className="text-sm text-muted-foreground mt-1">Tous vos paiements effectués sur Souk DZ.</p>
        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Référence</TableHead><TableHead>Date</TableHead><TableHead>Commande</TableHead>
              <TableHead>Méthode</TableHead><TableHead className="text-end">Montant</TableHead>
              <TableHead>Statut</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {history.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono text-xs">{h.id}</TableCell>
                  <TableCell className="text-sm">{h.date}</TableCell>
                  <TableCell className="text-sm">{h.order}</TableCell>
                  <TableCell><Badge variant="outline">{h.method}</Badge></TableCell>
                  <TableCell className="text-end font-medium">{h.amount.toLocaleString()} DA</TableCell>
                  <TableCell><Badge>{h.status}</Badge></TableCell>
                  <TableCell><Button asChild variant="ghost" size="sm"><Link to={`/invoice/${h.id}`}><FileText className="h-4 w-4" /></Link></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
