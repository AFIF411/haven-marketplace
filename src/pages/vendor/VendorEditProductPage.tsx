import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Loader2, Save, Upload, X, Trash2, Eye, AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";
import { useVendorShop } from "@/hooks/useVendorShop";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { validateProductForPublish, type ValidationReport } from "@/lib/validation/productSchema";

type Status = "active" | "draft" | "archived" | "out_of_stock";

interface ProductRow {
  id: string;
  shop_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  sku: string | null;
  images: string[] | null;
  status: Status;
}

export default function VendorEditProductPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shop, loading: shopLoading } = useVendorShop();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", price: 0, original_price: 0,
    stock: 0, sku: "", images: [] as string[], status: "active" as Status,
  });
  const [imgUrl, setImgUrl] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("products").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        toast({ title: "Introuvable", description: error?.message || "Produit non trouvé", variant: "destructive" });
        navigate("/vendor/products"); return;
      }
      const p = data as unknown as ProductRow;
      setProduct(p);
      setForm({
        name: p.name, description: p.description || "",
        price: Number(p.price), original_price: Number(p.original_price || 0),
        stock: p.stock, sku: p.sku || "",
        images: Array.isArray(p.images) ? p.images : [],
        status: p.status,
      });
      setLoading(false);
    })();
  }, [id, navigate]);

  // Ownership guard
  useEffect(() => {
    if (!loading && !shopLoading && product && shop && product.shop_id !== shop.id) {
      toast({ title: "Accès refusé", description: "Ce produit ne vous appartient pas.", variant: "destructive" });
      navigate("/vendor/products");
    }
  }, [loading, shopLoading, product, shop, navigate]);

  const addImage = () => {
    if (!imgUrl.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, imgUrl.trim()] }));
    setImgUrl("");
  };
  const removeImage = (i: number) =>
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const save = async (republish: boolean) => {
    if (!product) return;
    if (!form.name.trim() || form.price <= 0) {
      toast({ title: "Champs requis", description: "Nom et prix obligatoires.", variant: "destructive" }); return;
    }
    setSaving(true);
    const nextStatus: Status = republish
      ? (form.stock > 0 ? "active" : "out_of_stock")
      : form.status;
    const { error } = await supabase.from("products").update({
      name: form.name,
      description: form.description || null,
      price: form.price,
      original_price: form.original_price || null,
      stock: form.stock,
      sku: form.sku || null,
      images: form.images.length ? form.images : null,
      status: nextStatus,
    }).eq("id", product.id);
    setSaving(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({
      title: republish
        ? (nextStatus === "active" ? "Produit republié ✓" : "Produit mis à jour (rupture de stock)")
        : "Modifications enregistrées",
      description: form.name,
    });
    setForm(f => ({ ...f, status: nextStatus }));
  };

  const quickStock = async (delta: number) => {
    if (!product) return;
    const next = Math.max(0, form.stock + delta);
    setForm(f => ({ ...f, stock: next }));
    const nextStatus: Status = next > 0 ? "active" : "out_of_stock";
    const { error } = await supabase.from("products")
      .update({ stock: next, status: nextStatus }).eq("id", product.id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    setForm(f => ({ ...f, status: nextStatus }));
    toast({ title: "Stock mis à jour", description: `Nouveau stock : ${next}` });
  };

  const removeProduct = async () => {
    if (!product) return;
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Produit supprimé" });
    navigate("/vendor/products");
  };

  if (loading || shopLoading) {
    return <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <div className="p-8 text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Chargement…</div>
    </DashboardLayout>;
  }

  const statusLabel: Record<Status, string> = {
    active: "Publié", draft: "Brouillon", archived: "Archivé", out_of_stock: "Rupture",
  };
  const statusVariant: Record<Status, "success" | "secondary" | "destructive" | "outline"> = {
    active: "success", draft: "secondary", archived: "outline", out_of_stock: "destructive",
  };

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/vendor/products"><ArrowLeft className="h-4 w-4 me-1" />Retour</Link>
          </Button>
          <h1 className="font-heading text-xl font-bold">Modifier le produit</h1>
          <Badge variant={statusVariant[form.status]}>{statusLabel[form.status]}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {product && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/products/${product.id}`} target="_blank"><Eye className="h-4 w-4 me-1" />Aperçu</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-destructive" onClick={removeProduct}>
            <Trash2 className="h-4 w-4 me-1" />Supprimer
          </Button>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Stock rapide */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="font-heading font-semibold mb-3">Mise à jour rapide du stock</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => quickStock(-1)} disabled={form.stock <= 0}>−1</Button>
            <Button variant="outline" size="sm" onClick={() => quickStock(-10)} disabled={form.stock < 10}>−10</Button>
            <div className="px-4 h-10 flex items-center rounded-md border bg-background text-lg font-semibold min-w-[80px] justify-center">
              {form.stock}
            </div>
            <Button variant="outline" size="sm" onClick={() => quickStock(10)}>+10</Button>
            <Button variant="outline" size="sm" onClick={() => quickStock(1)}>+1</Button>
            <span className="text-xs text-muted-foreground ms-2">
              Statut auto : stock = 0 → rupture, stock &gt; 0 → publié
            </span>
          </div>
        </div>

        {/* Infos */}
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">Informations</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">Nom *</label>
            <input className="w-full h-10 px-3 rounded-md border bg-background text-sm"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[100px]"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        {/* Images */}
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">Images</h2>
          <div className="flex gap-2">
            <input className="flex-1 h-10 px-3 rounded-md border bg-background text-sm"
              placeholder="URL d'image…" value={imgUrl}
              onChange={e => setImgUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImage())} />
            <Button type="button" variant="outline" onClick={addImage}><Upload className="h-4 w-4 me-1" />Ajouter</Button>
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {form.images.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden border group">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 end-1 h-6 w-6 rounded-full bg-background/90 flex items-center justify-center">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prix & stock détaillé */}
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">Prix et stock</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Prix (DA) *</label>
              <input type="number" min={0} className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.price || ""} onChange={e => setForm({ ...form, price: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Prix barré (DA)</label>
              <input type="number" min={0} className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.original_price || ""} onChange={e => setForm({ ...form, original_price: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Stock</label>
              <input type="number" min={0} className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">SKU</label>
              <input className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Statut</label>
              <select className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Status })}>
                <option value="active">Publié</option>
                <option value="draft">Brouillon</option>
                <option value="out_of_stock">Rupture de stock</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button size="lg" disabled={saving} onClick={() => save(true)}>
            {saving ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Save className="h-4 w-4 me-2" />}
            Enregistrer et republier
          </Button>
          <Button size="lg" variant="outline" disabled={saving} onClick={() => save(false)}>
            Enregistrer sans republier
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
