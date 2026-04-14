import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function ClientProfilePage() {
  return (
    <DashboardLayout type="client" title="Mon compte">
      <h1 className="font-heading text-xl font-bold mb-6">Mon profil</h1>
      <div className="bg-card rounded-lg border p-6 max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">JD</div>
          <div><p className="font-heading font-semibold">Jean Dupont</p><p className="text-sm text-muted-foreground">jean@email.com</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
          <div><label className="text-sm font-medium mb-1 block">Prénom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="Jean" /></div>
          <div><label className="text-sm font-medium mb-1 block">Nom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="Dupont" /></div>
          <div><label className="text-sm font-medium mb-1 block">Email</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="jean@email.com" /></div>
          <div><label className="text-sm font-medium mb-1 block">Téléphone</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="+33 6 12 34 56 78" /></div>
        </div>
        <Button>Sauvegarder</Button>
      </div>
    </DashboardLayout>
  );
}
