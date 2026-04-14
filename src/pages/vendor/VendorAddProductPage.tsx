import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function VendorAddProductPage() {
  return (
    <DashboardLayout type="vendor" title="Espace vendeur">
      <h1 className="font-heading text-xl font-bold mb-6">Ajouter un produit</h1>
      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">Informations générales</h2>
          <div><label className="text-sm font-medium mb-1 block">Nom du produit</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Ex: Sac en cuir artisanal" /></div>
          <div><label className="text-sm font-medium mb-1 block">Description</label><textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[100px]" placeholder="Décrivez votre produit..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Catégorie</label><select className="w-full h-10 px-3 rounded-md border bg-background text-sm"><option>Mode</option><option>Maison</option><option>Beauté</option><option>Artisanat</option></select></div>
            <div><label className="text-sm font-medium mb-1 block">Sous-catégorie</label><select className="w-full h-10 px-3 rounded-md border bg-background text-sm"><option>Sacs</option><option>Accessoires</option></select></div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">Images</h2>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Glissez vos images ici ou <span className="text-primary cursor-pointer">parcourez</span></p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu'à 5 Mo</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">Prix et stock</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Prix (DA)</label><input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="0" /></div>
            <div><label className="text-sm font-medium mb-1 block">Prix barré (DA)</label><input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Optionnel" /></div>
            <div><label className="text-sm font-medium mb-1 block">Stock</label><input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="0" /></div>
            <div><label className="text-sm font-medium mb-1 block">SKU</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="REF-001" /></div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="lg">Publier le produit</Button>
          <Button size="lg" variant="outline">Sauvegarder en brouillon</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
