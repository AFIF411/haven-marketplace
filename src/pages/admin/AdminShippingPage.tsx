import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const shipments = [
  { tracking: "YL-2026-1245", order: "#1245", from: "Alger", to: "Oran", partner: "Yalidine", status: "En cours" },
  { tracking: "MA-2026-0842", order: "#1240", from: "Sétif", to: "Constantine", partner: "Maystro", status: "Livré" },
  { tracking: "ZR-2026-0510", order: "#1238", from: "Annaba", to: "Skikda", partner: "ZR Express", status: "En préparation" },
];

const partners = [
  { name: "Yalidine Express", active: true, shipments: 4521, rating: 4.6 },
  { name: "Maystro Delivery", active: true, shipments: 2148, rating: 4.4 },
  { name: "ZR Express", active: true, shipments: 1052, rating: 4.2 },
  { name: "EMS Algérie Poste", active: false, shipments: 320, rating: 3.8 },
];

export default function AdminShippingPage() {
  return (
    <DashboardLayout type="admin" title="Livraisons">
      <PageHeader title="Livraisons globales" description="Expéditions et partenaires logistiques." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Expéditions en cours</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>N° Suivi</TableHead><TableHead>Cmde</TableHead><TableHead>Trajet</TableHead><TableHead>Partenaire</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader>
              <TableBody>
                {shipments.map(s => (
                  <TableRow key={s.tracking}>
                    <TableCell className="font-mono text-xs">{s.tracking}</TableCell>
                    <TableCell className="text-sm">{s.order}</TableCell>
                    <TableCell className="text-sm">{s.from} → {s.to}</TableCell>
                    <TableCell className="text-sm">{s.partner}</TableCell>
                    <TableCell><Badge variant={s.status === "Livré" ? "default" : "outline"}>{s.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Partenaires</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {partners.map(p => (
              <div key={p.name} className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{p.name}</div>
                  <Switch defaultChecked={p.active} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{p.shipments.toLocaleString()} envois • Note {p.rating}/5</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
