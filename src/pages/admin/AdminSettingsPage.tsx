import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <DashboardLayout type="admin" title="Paramètres plateforme">
      <PageHeader title="Paramètres généraux" description="Configuration globale de OneClick Tijara." />
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        <Card>
          <CardHeader><CardTitle>Identité</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Nom de la plateforme</Label><Input defaultValue="OneClick Tijara" className="mt-1" /></div>
            <div><Label>Email contact</Label><Input defaultValue="contact@soukdz.com" className="mt-1" /></div>
            <div><Label>Devise</Label><Input defaultValue="DA (Dinar algérien)" className="mt-1" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Commissions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Commission standard (%)</Label><Input defaultValue="5" type="number" className="mt-1" /></div>
            <div><Label>Commission max (%)</Label><Input defaultValue="10" type="number" className="mt-1" /></div>
            <div><Label>Seuil retrait minimum (DA)</Label><Input defaultValue="5000" type="number" className="mt-1" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Modération</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><Label>Validation boutique manuelle</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Validation produits manuelle</Label><Switch /></div>
            <div className="flex items-center justify-between"><Label>Modération automatique des avis</Label><Switch defaultChecked /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Maintenance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><Label>Mode maintenance</Label><Switch /></div>
            <div className="flex items-center justify-between"><Label>Inscriptions ouvertes</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Activer IA</Label><Switch defaultChecked /></div>
          </CardContent>
        </Card>
      </div>
      <Button className="mt-6">Enregistrer les paramètres</Button>
    </DashboardLayout>
  );
}
