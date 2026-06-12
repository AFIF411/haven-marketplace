import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tickets = [
  { id: "T-204", user: "Karim B.", role: "Client", subject: "Problème de livraison", priority: "Haute", status: "Ouvert", date: "12/06" },
  { id: "T-203", user: "Boutique Sahara", role: "Vendeur", subject: "Question facturation", priority: "Moyenne", status: "En cours", date: "11/06" },
  { id: "T-202", user: "Lina M.", role: "Client", subject: "Remboursement", priority: "Haute", status: "Résolu", date: "10/06" },
  { id: "T-201", user: "Tech Oran", role: "Vendeur", subject: "Modification de plan", priority: "Basse", status: "Ouvert", date: "09/06" },
];

export default function AdminSupportPage() {
  return (
    <DashboardLayout type="admin" title="Support">
      <PageHeader title="Demandes de support" description="Réclamations clients et vendeurs." />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>ID</TableHead><TableHead>Utilisateur</TableHead><TableHead>Type</TableHead>
            <TableHead>Sujet</TableHead><TableHead>Priorité</TableHead><TableHead>Statut</TableHead>
            <TableHead>Date</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {tickets.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.id}</TableCell>
                <TableCell className="text-sm font-medium">{t.user}</TableCell>
                <TableCell><Badge variant="outline">{t.role}</Badge></TableCell>
                <TableCell className="text-sm">{t.subject}</TableCell>
                <TableCell><Badge variant={t.priority === "Haute" ? "destructive" : "outline"}>{t.priority}</Badge></TableCell>
                <TableCell><Badge variant={t.status === "Résolu" ? "default" : "outline"}>{t.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.date}</TableCell>
                <TableCell><Button size="sm" variant="ghost">Ouvrir</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
