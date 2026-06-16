import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

export default function VendorAddProductPage() {
  const { t } = useTranslation();

  const mockImages = [
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=300",
    "https://images.unsplash.com/photo-1591561954555-607968c989ab?w=300",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300",
  ];

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("vendor.addProduct")}</h1>
      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.generalInfo")}</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("vendor.productName")}</label>
            <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="Sac à main berbère en cuir véritable" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("vendor.description")}</label>
            <textarea
              className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[100px]"
              defaultValue="Sac à main artisanal fabriqué à la main en Kabylie. Cuir tanné naturellement, motifs berbères traditionnels brodés à la main. Doublure intérieure en coton, fermeture éclair de qualité. Pièce unique, livraison soignée."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t("vendor.category")}</label>
              <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="craft">
                <option value="fashion">{t("cat.fashion")}</option>
                <option value="home">{t("cat.home")}</option>
                <option value="beauty">{t("cat.beauty")}</option>
                <option value="craft">{t("cat.craft")}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("vendor.subcategory")}</label>
              <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="sacs">
                <option value="sacs">Sacs</option>
                <option value="acc">Accessoires</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.images")}</h2>
          <div className="grid grid-cols-4 gap-3">
            {mockImages.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-md overflow-hidden border group">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button className="absolute top-1 end-1 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50">
              <Upload className="h-5 w-5 mb-1" />
              <span className="text-xs">{t("vendor.browse")}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("vendor.imageLimit")}</p>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.priceAndStock")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t("vendor.price")} (DA)</label>
              <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue={8500} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("vendor.strikePrice")} (DA)</label>
              <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue={11000} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("table.stock")}</label>
              <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue={24} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">SKU</label>
              <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="SAC-BRB-001" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="lg">{t("vendor.publish")}</Button>
          <Button size="lg" variant="outline">{t("vendor.saveDraft")}</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
