import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const partners = [
  { name: "Yalidine Express", enabled: true, coverage: "58 wilayas" },
  { name: "Maystro Delivery", enabled: true, coverage: "48 wilayas" },
  { name: "ZR Express", enabled: false, coverage: "30 wilayas" },
  { name: "Livraison interne", enabled: true, coverage: "Wilayas proches" },
];

const sampleWilayas = [
  { code: "16", name: "Alger", home: 400, desk: 250 },
  { code: "31", name: "Oran", home: 600, desk: 400 },
  { code: "25", name: "Constantine", home: 550, desk: 350 },
  { code: "06", name: "Béjaïa", home: 500, desk: 300 },
];

export default function VendorShippingPage() {
  return (
    <DashboardLayout type="vendor" title="Gestion livraison">
      <PageHeader title="Gestion de la livraison" description="Sociétés partenaires, tarifs et zones desservies" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Sociétés de livraison</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {partners.map(p => (
              <div key={p.name} className="flex items-center justify-between p-3 rounded-md border">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.coverage}</div>
                </div>
                <Switch defaultChecked={p.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tarifs par wilaya (DA)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {sampleWilayas.map(w => (
              <div key={w.code} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                <div className="text-sm"><span className="text-muted-foreground me-2">{w.code}</span>{w.name}</div>
                <div><Label className="text-[10px] text-muted-foreground">Domicile</Label><Input className="h-8 w-20" defaultValue={w.home} /></div>
                <div><Label className="text-[10px] text-muted-foreground">Bureau</Label><Input className="h-8 w-20" defaultValue={w.desk} /></div>
              </div>
            ))}
            <Button className="w-full mt-2">Enregistrer les tarifs</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
