import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Save, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/common/ImageUploader";
import { PriceInput } from "@/components/common/PriceInput";
import { useCategories, productsApi } from "@/hooks/useMarketplace";
import { toast } from "@/hooks/use-toast";
import type { Product, ProductStatus } from "@/types/marketplace";

const productSchema = z.object({
  name: z.string().min(3, "Nom trop court"),
  description: z.string().optional(),
  price: z.number().min(0),
  originalPrice: z.number().optional(),
  stock: z.number().min(0),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["draft", "active", "archived", "out_of_stock"]),
});

interface ProductFormProps { mode: "create" | "edit" }

export default function ProductFormPage({ mode }: ProductFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({
    name: "", description: "", price: 0, originalPrice: undefined, stock: 0, sku: "",
    categoryId: undefined, images: [], status: "draft", shopId: "s1", shopName: "Ma boutique", slug: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (mode === "edit" && id) {
      productsApi.get(id).then(p => {
        if (p) { setForm(p); setImageUrls(p.images.map(i => i.url)); }
        setLoading(false);
      });
    }
  }, [id, mode]);

  const update = (patch: Partial<Product>) => setForm(f => ({ ...f, ...patch }));

  const submit = async () => {
    const slug = form.slug || (form.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const parsed = productSchema.safeParse({
      name: form.name, description: form.description, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock), sku: form.sku, categoryId: form.categoryId, status: form.status as ProductStatus,
    });
    if (!parsed.success) { toast({ title: "Champs manquants", description: parsed.error.errors[0].message, variant: "destructive" }); return; }

    setSubmitting(true);
    try {
      const images = imageUrls.map((url, i) => ({ id: `img-${i}`, url, position: i }));
      const payload = { ...form, slug, images, shopId: "s1", shopName: "Ma boutique" } as Omit<Product, "id" | "createdAt" | "updatedAt" | "rating" | "reviewsCount">;
      if (mode === "edit" && id) await productsApi.update(id, payload);
      else await productsApi.create(payload);
      toast({ title: mode === "edit" ? "Produit mis à jour" : "Produit créé" });
      navigate("/manage/products");
    } finally { setSubmitting(false); }
  };

  if (loading) return <DashboardLayout type="manage" title="Produit"><p className="text-sm text-muted-foreground">Chargement...</p></DashboardLayout>;

  return (
    <DashboardLayout type="manage" title={mode === "edit" ? "Modifier le produit" : "Nouveau produit"}>
      <PageHeader
        title={mode === "edit" ? "Modifier le produit" : "Nouveau produit"}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/manage/products")}><ArrowLeft className="h-4 w-4 me-1" />Retour</Button>
            <Button onClick={submit} disabled={submitting}><Save className="h-4 w-4 me-1" />{submitting ? "..." : "Enregistrer"}</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="font-heading font-semibold">Informations générales</h2>
            <div><Label>Nom du produit *</Label><Input value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="Ex: Sac en cuir tressé" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => update({ description: e.target.value })} className="min-h-[120px]" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Catégorie</Label>
                <select value={form.categoryId || ""} onChange={(e) => update({ categoryId: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                  <option value="">— Aucune —</option>
                  {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><Label>SKU / Référence</Label><Input value={form.sku} onChange={(e) => update({ sku: e.target.value })} placeholder="REF-001" /></div>
            </div>
          </section>

          <section className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="font-heading font-semibold">Images</h2>
            <ImageUploader value={imageUrls} onChange={setImageUrls} max={6} />
          </section>

          <section className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="font-heading font-semibold">Prix et stock</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Prix de vente *</Label><PriceInput value={form.price} onChange={(e) => update({ price: Number(e.target.value) })} /></div>
              <div><Label>Prix barré (promo)</Label><PriceInput value={form.originalPrice ?? ""} onChange={(e) => update({ originalPrice: e.target.value ? Number(e.target.value) : undefined })} /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => update({ stock: Number(e.target.value) })} /></div>
              <div><Label>Stock minimum (alerte)</Label><Input type="number" value={form.minStock || 5} onChange={(e) => update({ minStock: Number(e.target.value) })} /></div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-card border rounded-lg p-6 space-y-3">
            <h2 className="font-heading font-semibold">Statut</h2>
            <select value={form.status} onChange={(e) => update({ status: e.target.value as ProductStatus })} className="w-full h-10 px-3 rounded-md border bg-background text-sm">
              <option value="draft">Brouillon</option>
              <option value="active">Actif (publié)</option>
              <option value="archived">Archivé</option>
            </select>
          </section>
          <section className="bg-card border rounded-lg p-6 space-y-3">
            <h2 className="font-heading font-semibold">Slug</h2>
            <Input value={form.slug} onChange={(e) => update({ slug: e.target.value })} placeholder="auto-généré" />
            <p className="text-xs text-muted-foreground">Utilisé dans l'URL du produit.</p>
          </section>
        </aside>
      </div>
    </DashboardLayout>
  );
}
