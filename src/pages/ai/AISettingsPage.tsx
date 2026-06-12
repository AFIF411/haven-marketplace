import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AISettingsPage() {
  return (
    <DashboardLayout type="vendor" title="Paramètres IA">
      <PageHeader title="Paramètres IA" description="Configurez les préférences de génération." />
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Préférences de génération</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label>Langue par défaut</Label>
            <Select defaultValue="fr">
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="bilingual">Bilingue FR/AR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ton de communication</Label>
            <Select defaultValue="premium">
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium et chaleureux</SelectItem>
                <SelectItem value="casual">Décontracté</SelectItem>
                <SelectItem value="formal">Formel</SelectItem>
                <SelectItem value="playful">Ludique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Suggestions automatiques</Label><p className="text-xs text-muted-foreground">L'IA propose des améliorations dans tout l'espace vendeur.</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Sauvegarder l'historique</Label><p className="text-xs text-muted-foreground">Garder une trace des générations pour réutilisation.</p></div>
            <Switch defaultChecked />
          </div>
          <Button>Enregistrer</Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
