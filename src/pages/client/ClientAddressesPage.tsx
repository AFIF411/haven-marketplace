import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

const addresses = [
  { id: 1, name: "Mohamed Benali", address: "123 Rue Didouche Mourad", wilaya: "Alger", commune: "Sidi M'Hamed", default: true },
  { id: 2, name: "Mohamed Benali", address: "45 Boulevard Amirouche", wilaya: "Tizi Ouzou", commune: "Centre", default: false },
];

export default function ClientAddressesPage() {
  return (
    <DashboardLayout type="client" title="Mon compte">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Mes adresses</h1>
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Ajouter</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {addresses.map(a => (
          <div key={a.id} className={`bg-card rounded-lg border p-4 ${a.default ? 'border-primary' : ''}`}>
            {a.default && <span className="text-xs text-primary font-medium">Par défaut</span>}
            <p className="font-medium text-sm mt-1">{a.name}</p>
            <p className="text-sm text-muted-foreground">{a.address}</p>
            <p className="text-sm text-muted-foreground">{a.commune}, {a.wilaya}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline"><Edit className="h-3 w-3 mr-1" /> Modifier</Button>
              <Button size="sm" variant="ghost"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
