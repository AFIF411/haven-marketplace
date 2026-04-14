import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { mockProducts } from "@/data/mockData";

export default function VendorProductsPage() {
  return (
    <DashboardLayout type="vendor" title="Espace vendeur">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Mes produits</h1>
        <Button size="sm" asChild><Link to="/vendor/products/new"><Plus className="mr-1 h-4 w-4" /> Ajouter</Link></Button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 pl-10 pr-3 rounded-md border bg-background text-sm" placeholder="Rechercher un produit..." />
        </div>
        <select className="h-9 px-3 rounded-md border text-sm bg-background"><option>Tous les statuts</option><option>Actif</option><option>Brouillon</option></select>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary/50">
              <th className="text-left px-4 py-2.5 font-medium">Produit</th>
              <th className="text-left px-4 py-2.5 font-medium">Prix</th>
              <th className="text-left px-4 py-2.5 font-medium">Stock</th>
              <th className="text-left px-4 py-2.5 font-medium">Statut</th>
              <th className="text-left px-4 py-2.5 font-medium">Ventes</th>
              <th className="text-right px-4 py-2.5 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {mockProducts.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-accent/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover bg-secondary" />
                      <span className="font-medium line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.price} €</td>
                  <td className="px-4 py-3">{Math.floor(Math.random() * 100)}</td>
                  <td className="px-4 py-3"><Badge variant="success">Actif</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.reviews}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
