import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function ClientProfilePage() {
  return (
    <DashboardLayout type="client" title="Mon compte">
      <h1 className="font-heading text-xl font-bold mb-6">Mon profil</h1>
      <div className="bg-card rounded-lg border p-6 max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">MB</div>
          <div><p className="font-heading font-semibold">Mohamed Benali</p><p className="text-sm text-muted-foreground">mohamed@email.com</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
          <div><label className="text-sm font-medium mb-1 block">Prénom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="Mohamed" /></div>
          <div><label className="text-sm font-medium mb-1 block">Nom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="Benali" /></div>
          <div><label className="text-sm font-medium mb-1 block">Email</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="mohamed@email.com" /></div>
          <div><label className="text-sm font-medium mb-1 block">Téléphone</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="+213 5 55 12 34 56" /></div>
        </div>
        <Button>Sauvegarder</Button>
      </div>
    </DashboardLayout>
  );
}
