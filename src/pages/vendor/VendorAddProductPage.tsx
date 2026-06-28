import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";
import { useVendorShop } from "@/hooks/useVendorShop";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function VendorAddProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { shop, loading } = useVendorShop();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "fashion",
    price: 0,
    original_price: 0,
    stock: 1,
    sku: "",
    images: [] as string[],
  });
  const [imgUrl, setImgUrl] = useState("");

  const addImage = () => {
    if (!imgUrl.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, imgUrl.trim()] }));
    setImgUrl("");
  };
  const removeImage = (i: number) =>
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (status: "active" | "draft") => {
    if (!shop) { toast({ title: "Aucune boutique", description: "Créez d'abord votre boutique.", variant: "destructive" }); return; }
    if (!form.name.trim() || form.price <= 0) {
      toast({ title: "Champs requis", description: "Nom et prix obligatoires.", variant: "destructive" }); return;
    }
    setSubmitting(true);
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
    const { error } = await supabase.from("products").insert({
      shop_id: shop.id,
      name: form.name,
      slug,
      description: form.description || null,
      price: form.price,
      original_price: form.original_price || null,
      stock: form.stock,
      sku: form.sku || null,
      images: form.images.length ? form.images : null,
      status,
    });
    setSubmitting(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: status === "active" ? "Produit publié ✓" : "Brouillon enregistré", description: form.name });
    navigate("/vendor/products");
  };

  if (loading) {
    return <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}><div className="p-8 text-muted-foreground">Chargement…</div></DashboardLayout>;
  }

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("vendor.addProduct")}</h1>

      {!shop && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4 text-sm">
          Vous devez créer votre boutique avant d'ajouter des produits.
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.generalInfo")}</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("vendor.productName")} *</label>
            <input className="w-full h-10 px-3 rounded-md border bg-background text-sm"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Sac à main berbère en cuir véritable" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("vendor.description")}</label>
            <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[100px]"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Décrivez votre produit, matières, dimensions…" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("vendor.category")}</label>
            <select className="w-full h-10 px-3 rounded-md border bg-background text-sm"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="fashion">{t("cat.fashion")}</option>
              <option value="home">{t("cat.home")}</option>
              <option value="beauty">{t("cat.beauty")}</option>
              <option value="craft">{t("cat.craft")}</option>
            </select>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.images")}</h2>
          <div className="flex gap-2">
            <input className="flex-1 h-10 px-3 rounded-md border bg-background text-sm"
              placeholder="Coller une URL d'image…" value={imgUrl}
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
          <p className="text-xs text-muted-foreground">La 1ère image sera la principale.</p>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.priceAndStock")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t("vendor.price")} (DA) *</label>
              <input type="number" min={0} className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.price || ""} onChange={e => setForm({ ...form, price: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("vendor.strikePrice")} (DA)</label>
              <input type="number" min={0} className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.original_price || ""} onChange={e => setForm({ ...form, original_price: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("table.stock")}</label>
              <input type="number" min={0} className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">SKU</label>
              <input className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="REF-001" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="lg" disabled={submitting || !shop} onClick={() => handleSubmit("active")}>
            {submitting && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
            {t("vendor.publish")}
          </Button>
          <Button size="lg" variant="outline" disabled={submitting || !shop} onClick={() => handleSubmit("draft")}>
            {t("vendor.saveDraft")}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
