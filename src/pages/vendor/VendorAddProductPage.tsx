import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

export default function VendorAddProductPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("vendor.addProduct")}</h1>
      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.generalInfo")}</h2>
          <div><label className="text-sm font-medium mb-1 block">{t("vendor.productName")}</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder={t("vendor.productNamePlaceholder")} /></div>
          <div><label className="text-sm font-medium mb-1 block">{t("vendor.description")}</label><textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[100px]" placeholder={t("vendor.descriptionPlaceholder")} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">{t("vendor.category")}</label><select className="w-full h-10 px-3 rounded-md border bg-background text-sm"><option>{t("cat.fashion")}</option><option>{t("cat.home")}</option><option>{t("cat.beauty")}</option><option>{t("cat.craft")}</option></select></div>
            <div><label className="text-sm font-medium mb-1 block">{t("vendor.subcategory")}</label><select className="w-full h-10 px-3 rounded-md border bg-background text-sm"><option>Sacs</option><option>Accessoires</option></select></div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.images")}</h2>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t("vendor.dragImages")} <span className="text-primary cursor-pointer">{t("vendor.browse")}</span></p>
            <p className="text-xs text-muted-foreground mt-1">{t("vendor.imageLimit")}</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-semibold">{t("vendor.priceAndStock")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">{t("vendor.price")}</label><input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="0" /></div>
            <div><label className="text-sm font-medium mb-1 block">{t("vendor.strikePrice")}</label><input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder={t("vendor.optional")} /></div>
            <div><label className="text-sm font-medium mb-1 block">{t("table.stock")}</label><input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="0" /></div>
            <div><label className="text-sm font-medium mb-1 block">SKU</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="REF-001" /></div>
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
