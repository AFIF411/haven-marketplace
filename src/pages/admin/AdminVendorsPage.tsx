import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Ban, Check } from "lucide-react";
import { mockShops, formatDZD } from "@/data/mockData";

export default function AdminVendorsPage() {
  return (
    <DashboardLayout type="admin" title="Administration">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Gestion vendeurs</h1>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 pl-10 pr-3 rounded-md border bg-background text-sm" placeholder="Rechercher..." />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {["Tous", "Actifs", "En attente", "Suspendus"].map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium">Vendeur</th>
            <th className="text-left px-4 py-2.5 font-medium">Boutique</th>
            <th className="text-left px-4 py-2.5 font-medium">Produits</th>
            <th className="text-left px-4 py-2.5 font-medium">CA</th>
            <th className="text-left px-4 py-2.5 font-medium">Statut</th>
            <th className="text-right px-4 py-2.5 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {mockShops.map(s => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 flex items-center gap-2">
                  <img src={s.logo} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                  <span className="font-medium">{s.name}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                <td className="px-4 py-3">{s.products}</td>
                <td className="px-4 py-3">{formatDZD(s.reviews * 800)}</td>
                <td className="px-4 py-3"><Badge variant={s.verified ? "success" : "warning"}>{s.verified ? "Vérifié" : "En attente"}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Check className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Ban className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
