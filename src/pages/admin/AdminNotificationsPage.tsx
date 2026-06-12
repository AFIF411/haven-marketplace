import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const recent = [
  { title: "Mise à jour de la plateforme", target: "Tous", date: "11/06", sent: 1245 },
  { title: "Nouvelles conditions vendeurs", target: "Vendeurs", date: "08/06", sent: 405 },
  { title: "Promotion Aïd", target: "Clients", date: "01/06", sent: 840 },
];

export default function AdminNotificationsPage() {
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Notification envoyée" });
  };
  return (
    <DashboardLayout type="admin" title="Notifications">
      <PageHeader title="Notifications plateforme" description="Envoyer des alertes aux utilisateurs." />
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        <Card>
          <CardHeader><CardTitle>Nouvelle notification</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={send} className="space-y-4">
              <div><Label>Cible</Label>
                <Select defaultValue="all"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    <SelectItem value="clients">Clients</SelectItem>
                    <SelectItem value="vendors">Vendeurs</SelectItem>
                    <SelectItem value="admins">Administrateurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Titre</Label><Input required className="mt-1" /></div>
              <div><Label>Message</Label><Textarea required rows={4} className="mt-1" /></div>
              <Button type="submit"><Bell className="h-4 w-4 me-2" />Envoyer</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Récentes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recent.map((r, i) => (
              <div key={i} className="p-3 rounded-md border">
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.target} • {r.date} • {r.sent.toLocaleString()} destinataires</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
