import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";
import { useOrder } from "@/hooks/useMarketplace";

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const orderId = params.get("id") ?? undefined;
  const { data: order, loading } = useOrder(orderId);

  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-lg text-center">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-bold">{t("orderConfirm.title")}</h1>
        <p className="text-muted-foreground mt-2">
          {order ? (
            <><span className="font-mono font-medium text-foreground">#{order.id}</span> {t("orderConfirm.success")}</>
          ) : loading ? "Chargement…" : t("orderConfirm.success")}
        </p>
        <div className="bg-card rounded-lg border p-6 mt-6 text-start space-y-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.date")}</span><span>{order ? new Date(order.createdAt).toLocaleDateString('fr-DZ') : new Date().toLocaleDateString('fr-DZ')}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.total")}</span><span className="font-medium">{order ? formatDZD(order.total) : "—"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.delivery")}</span><span>{order?.deliveryMode === "relay" ? "Point relais" : order?.deliveryMode === "express" ? "Express" : t("orderConfirm.standard")}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.wilaya")}</span><span>{order?.shippingAddress?.wilaya ?? "—"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orderConfirm.status")}</span><span className="text-success font-medium">{t("orderConfirm.confirmed")}</span></div>
        </div>
        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          <Button asChild><Link to={order ? `/account/orders/${order.id}` : "/account/orders"}>{t("orderConfirm.viewOrders")} <ArrowRight className="ms-2 h-4 w-4" /></Link></Button>
          <Button variant="outline" asChild><Link to="/">{t("orderConfirm.continueShopping")}</Link></Button>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
