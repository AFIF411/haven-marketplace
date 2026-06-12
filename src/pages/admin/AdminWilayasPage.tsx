import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const wilayas = [
  { code: "16", name: "Alger", zone: "Nord", home: 400, desk: 250, active: true },
  { code: "31", name: "Oran", zone: "Ouest", home: 600, desk: 400, active: true },
  { code: "25", name: "Constantine", zone: "Est", home: 550, desk: 350, active: true },
  { code: "06", name: "Béjaïa", zone: "Nord-Est", home: 500, desk: 300, active: true },
  { code: "19", name: "Sétif", zone: "Est", home: 550, desk: 350, active: true },
  { code: "07", name: "Biskra", zone: "Sud-Est", home: 800, desk: 500, active: true },
  { code: "01", name: "Adrar", zone: "Sud", home: 1200, desk: 800, active: false },
  { code: "11", name: "Tamanrasset", zone: "Grand Sud", home: 1500, desk: 1000, active: false },
];

export default function AdminWilayasPage() {
  return (
    <DashboardLayout type="admin" title="Wilayas">
      <PageHeader title="Gestion des wilayas" description="Configurez les zones et tarifs de livraison pour les 58 wilayas." actions={<Button>Enregistrer tout</Button>} />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="w-16">Code</TableHead><TableHead>Wilaya</TableHead><TableHead>Zone</TableHead>
            <TableHead>Domicile (DA)</TableHead><TableHead>Bureau (DA)</TableHead><TableHead>Active</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {wilayas.map(w => (
              <TableRow key={w.code}>
                <TableCell className="font-mono text-xs">{w.code}</TableCell>
                <TableCell className="font-medium text-sm">{w.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{w.zone}</TableCell>
                <TableCell><Input className="h-8 w-24" defaultValue={w.home} /></TableCell>
                <TableCell><Input className="h-8 w-24" defaultValue={w.desk} /></TableCell>
                <TableCell><Switch defaultChecked={w.active} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
