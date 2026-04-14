import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, Eye } from "lucide-react";
import { mockProducts, formatDZD } from "@/data/mockData";

export default function AdminProductsPage() {
  return (
    <DashboardLayout type="admin" title="Administration">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Gestion produits</h1>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 pl-10 pr-3 rounded-md border bg-background text-sm" placeholder="Rechercher..." />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {["Tous", "Approuvés", "En attente", "Rejetés"].map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium">Produit</th>
            <th className="text-left px-4 py-2.5 font-medium">Boutique</th>
            <th className="text-left px-4 py-2.5 font-medium">Prix</th>
            <th className="text-left px-4 py-2.5 font-medium">Statut</th>
            <th className="text-right px-4 py-2.5 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {mockProducts.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                  <span className="font-medium line-clamp-1">{p.name}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.shop}</td>
                <td className="px-4 py-3">{formatDZD(p.price)}</td>
                <td className="px-4 py-3"><Badge variant="success">Approuvé</Badge></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><X className="h-3.5 w-3.5" /></Button>
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
