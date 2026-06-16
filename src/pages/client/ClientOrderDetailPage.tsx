import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, FileText } from "lucide-react";
import { useOrder } from "@/hooks/useMarketplace";
import { formatDZD } from "@/data/mockData";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "En attente", variant: "secondary" },
  processing: { label: "En préparation", variant: "default" },
  shipped: { label: "En cours de livraison", variant: "default" },
  delivered: { label: "Livrée", variant: "default" },
  cancelled: { label: "Annulée", variant: "destructive" },
};

export default function ClientOrderDetailPage() {
  const { id } = useParams();
  const { data: order, loading } = useOrder(id);

  const status = order ? STATUS_LABELS[order.status] ?? { label: order.status, variant: "default" as const } : null;

  return (
    <DashboardLayout type="client" title="Détail de commande">
      <div className="max-w-4xl">
        <Link to="/account/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 me-1" /> Retour aux commandes
        </Link>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Chargement…</div>
        ) : !order ? (
          <div className="py-16 text-center">
            <h1 className="font-heading text-xl font-bold">Commande introuvable</h1>
            <p className="text-sm text-muted-foreground mt-2">L'identifiant <span className="font-mono">{id}</span> n'existe pas.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-heading text-2xl font-bold">Commande #{order.id}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Passée le {new Date(order.createdAt).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {status && <Badge variant={status.variant}>{status.label}</Badge>}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h2 className="font-heading font-semibold mb-3">Produits</h2>
                  {order.items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                      {it.imageUrl ? (
                        <img src={it.imageUrl} alt={it.productName} className="w-16 h-16 rounded object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded bg-muted" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{it.productName}</div>
                        <div className="text-xs text-muted-foreground">Quantité : {it.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold">{formatDZD(it.total)}</div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h2 className="font-heading font-semibold mb-3">Adresse de livraison</h2>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.commune}, {order.shippingAddress.wilaya}<br />
                    📞 {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h2 className="font-heading font-semibold mb-3">Résumé</h2>
                  <dl className="text-sm space-y-1">
                    <div className="flex justify-between"><dt className="text-muted-foreground">Sous-total</dt><dd>{formatDZD(order.subtotal)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Livraison</dt><dd>{formatDZD(order.shippingFee)}</dd></div>
                    {order.discount > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Remise</dt><dd>-{formatDZD(order.discount)}</dd></div>}
                    <div className="flex justify-between font-semibold border-t pt-2 mt-2"><dt>Total</dt><dd>{formatDZD(order.total)}</dd></div>
                  </dl>
                </div>
                <Button asChild className="w-full"><Link to={`/account/orders/${order.id}/tracking`}><Truck className="h-4 w-4 me-2" />Suivre la livraison</Link></Button>
                <Button asChild variant="outline" className="w-full"><Link to={`/invoice/${order.id}`}><FileText className="h-4 w-4 me-2" />Voir la facture</Link></Button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
