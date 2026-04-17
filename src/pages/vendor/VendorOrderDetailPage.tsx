import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Printer, Phone, MapPin } from "lucide-react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useOrder, ordersApi } from "@/hooks/useMarketplace";
import { formatDZD } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import type { OrderStatus } from "@/types/marketplace";
import { useState } from "react";

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "preparing", "shipped", "delivered"];

export default function VendorOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, reload, loading } = useOrder(id);
  const [busy, setBusy] = useState(false);

  if (loading) return <DashboardLayout type="vendor" title="Commande"><p className="text-sm text-muted-foreground">Chargement...</p></DashboardLayout>;
  if (!order) return <DashboardLayout type="vendor" title="Commande"><p>Introuvable.</p></DashboardLayout>;

  const advance = async (next: OrderStatus) => {
    setBusy(true);
    await ordersApi.updateStatus(order.id, next);
    await reload();
    toast({ title: "Statut mis à jour" });
    setBusy(false);
  };

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const nextStatus = STATUS_FLOW[currentIdx + 1];

  return (
    <DashboardLayout type="vendor" title={order.number}>
      <PageHeader
        title={`Commande ${order.number}`}
        description={`Passée le ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 me-1" />Retour</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 me-1" />Imprimer</Button>
            {nextStatus && <Button onClick={() => advance(nextStatus)} disabled={busy}>Passer à : {nextStatus}</Button>}
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <Button variant="destructive" onClick={() => advance("cancelled")} disabled={busy}>Annuler</Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Statut + timeline */}
          <section className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold">Statut</h2>
              <StatusBadge kind="order" status={order.status} />
            </div>
            <div className="space-y-2">
              {order.history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium capitalize">{h.status}</span>
                  <span className="text-muted-foreground text-xs">{new Date(h.at).toLocaleString("fr-FR")}</span>
                  {h.note && <span className="text-muted-foreground italic">— {h.note}</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Articles */}
          <section className="bg-card border rounded-lg p-6">
            <h2 className="font-heading font-semibold mb-4">Articles ({order.items.length})</h2>
            <div className="space-y-3">
              {order.items.map(it => (
                <div key={it.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                  {it.imageUrl && <img src={it.imageUrl} alt={it.productName} className="h-14 w-14 rounded-md object-cover" />}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${it.productId}`} className="text-sm font-medium hover:text-primary">{it.productName}</Link>
                    <p className="text-xs text-muted-foreground">{it.shopName} · {it.quantity} × {formatDZD(it.unitPrice)}</p>
                  </div>
                  <div className="font-medium text-sm">{formatDZD(it.total)}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-card border rounded-lg p-6">
            <h2 className="font-heading font-semibold mb-3">Client</h2>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Phone className="h-3 w-3" />{order.customerPhone}</p>
            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
              <p className="flex items-start gap-1"><MapPin className="h-3 w-3 mt-0.5" /><span>{order.shippingAddress.street}, {order.shippingAddress.commune}, {order.shippingAddress.wilaya}</span></p>
            </div>
          </section>

          <section className="bg-card border rounded-lg p-6 space-y-2 text-sm">
            <h2 className="font-heading font-semibold mb-2">Récapitulatif</h2>
            <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatDZD(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{formatDZD(order.shippingFee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-success"><span>Remise</span><span>-{formatDZD(order.discount)}</span></div>}
            <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>{formatDZD(order.total)}</span></div>
            <div className="pt-3 mt-3 border-t flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Paiement</span>
              <StatusBadge kind="payment" status={order.paymentStatus} />
            </div>
          </section>
        </aside>
      </div>
    </DashboardLayout>
  );
}
