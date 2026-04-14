import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-lg text-center">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-bold">{t("orderConfirm.title")}</h1>
        <p className="text-muted-foreground mt-2"><span className="font-mono font-medium text-foreground">CMD-2024-006</span> {t("orderConfirm.success")}</p>
        <div className="bg-card rounded-lg border p-6 mt-6 text-start space-y-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.date")}</span><span>{new Date().toLocaleDateString('fr-DZ')}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.total")}</span><span className="font-medium">{formatDZD(17000)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.delivery")}</span><span>{t("orderConfirm.standard")}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.wilaya")}</span><span>Alger</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.status")}</span><span className="text-success font-medium">{t("orderConfirm.confirmed")}</span></div>
        </div>
        <div className="flex gap-3 mt-6 justify-center">
          <Button asChild><Link to="/account/orders">{t("orderConfirm.viewOrders")} <ArrowRight className="ms-2 h-4 w-4" /></Link></Button>
          <Button variant="outline" asChild><Link to="/">{t("orderConfirm.continueShopping")}</Link></Button>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
