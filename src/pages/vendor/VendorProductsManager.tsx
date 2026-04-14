import { useState } from "react";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, type Product } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

function ProductForm({ product, onSave, onCancel }: { product?: Product; onSave: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    code: product?.code || "",
    category: product?.category || "",
    purchase_price: product?.purchase_price || 0,
    sale_price: product?.sale_price || 0,
    stock: product?.stock || 0,
    min_stock: product?.min_stock || 5,
    unit: product?.unit || "pièce",
    description: product?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Nom du produit *</label>
          <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Code produit</label>
          <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="REF-001" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Catégorie</label>
          <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Prix d'achat (DA)</label>
          <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.purchase_price} onChange={e => setForm({ ...form, purchase_price: +e.target.value })} min={0} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Prix de vente (DA) *</label>
          <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: +e.target.value })} min={0} required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Stock</label>
          <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} min={0} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Stock minimum</label>
          <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: +e.target.value })} min={0} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Unité</label>
          <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
            <option value="pièce">Pièce</option>
            <option value="kg">Kg</option>
            <option value="litre">Litre</option>
            <option value="mètre">Mètre</option>
            <option value="lot">Lot</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[60px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{product ? "Mettre à jour" : "Ajouter"}</Button>
      </div>
    </form>
  );
}

export default function VendorProductsManager() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();

  if (!user) return <Navigate to="/login" replace />;

  const filtered = (products || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.code || "").toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = filtered.filter(p => p.stock <= p.min_stock);

  const handleSave = async (data: any) => {
    if (editProduct) {
      await updateProduct.mutateAsync({ id: editProduct.id, ...data });
    } else {
      await createProduct.mutateAsync(data);
    }
    setDialogOpen(false);
    setEditProduct(undefined);
  };

  const handleEdit = (p: Product) => {
    setEditProduct(p);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">{t("vendor.myProducts")}</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditProduct(undefined); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="me-1 h-4 w-4" /> {t("vendor.addProduct")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editProduct ? "Modifier le produit" : t("vendor.addProduct")}</DialogTitle>
            </DialogHeader>
            <ProductForm product={editProduct} onSave={handleSave} onCancel={() => { setDialogOpen(false); setEditProduct(undefined); }} />
          </DialogContent>
        </Dialog>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <p className="text-sm"><span className="font-medium">{lowStock.length} produit(s)</span> en stock faible</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder={t("vendor.searchProduct")} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} produit(s)</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-medium">Aucun produit</p>
          <p className="text-sm mt-1">Cliquez sur "Ajouter un produit" pour commencer</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-start px-4 py-2.5 font-medium">{t("table.product")}</th>
                <th className="text-start px-4 py-2.5 font-medium">Code</th>
                <th className="text-start px-4 py-2.5 font-medium">{t("vendor.category")}</th>
                <th className="text-end px-4 py-2.5 font-medium">P. Achat</th>
                <th className="text-end px-4 py-2.5 font-medium">P. Vente</th>
                <th className="text-end px-4 py-2.5 font-medium">{t("table.stock")}</th>
                <th className="text-end px-4 py-2.5 font-medium">{t("table.actions")}</th>
              </tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.code || "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category || "-"}</td>
                    <td className="px-4 py-3 text-end text-muted-foreground">{formatDZD(p.purchase_price || 0)}</td>
                    <td className="px-4 py-3 text-end font-medium">{formatDZD(p.sale_price)}</td>
                    <td className="px-4 py-3 text-end">
                      {p.stock <= p.min_stock ? (
                        <Badge variant="destructive">{p.stock} {p.unit}</Badge>
                      ) : (
                        <span>{p.stock} {p.unit}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(p)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
