import { Link, useParams } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, FileText } from "lucide-react";

export default function ClientOrderDetailPage() {
  const { id } = useParams();
  return (
    <MarketplaceLayout>
      <div className="container py-8 max-w-4xl">
        <Link to="/account/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 me-1" /> Retour aux commandes
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-2xl font-bold">Commande #{id}</h1>
            <p className="text-sm text-muted-foreground mt-1">Passée le 10 juin 2026</p>
          </div>
          <Badge className="bg-primary">En cours de livraison</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 rounded-lg border bg-card">
              <h2 className="font-heading font-semibold mb-3">Produits</h2>
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0">
                  <div className="w-16 h-16 rounded bg-muted" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Produit exemple {i}</div>
                    <div className="text-xs text-muted-foreground">Quantité : 1</div>
                  </div>
                  <div className="text-sm font-semibold">2 500 DA</div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h2 className="font-heading font-semibold mb-3">Adresse de livraison</h2>
              <p className="text-sm text-muted-foreground">Mohamed Benali<br />Cité 1000 logements, Bt A4<br />16000 Alger</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-card">
              <h2 className="font-heading font-semibold mb-3">Résumé</h2>
              <dl className="text-sm space-y-1">
                <div className="flex justify-between"><dt className="text-muted-foreground">Sous-total</dt><dd>5 000 DA</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Livraison</dt><dd>500 DA</dd></div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2"><dt>Total</dt><dd>5 500 DA</dd></div>
              </dl>
            </div>
            <Button asChild className="w-full"><Link to={`/account/orders/${id}/tracking`}><Truck className="h-4 w-4 me-2" />Suivre la livraison</Link></Button>
            <Button variant="outline" className="w-full"><FileText className="h-4 w-4 me-2" />Télécharger la facture</Button>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
