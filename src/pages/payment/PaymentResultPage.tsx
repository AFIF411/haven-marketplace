import { Link, useSearchParams } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const success = params.get("status") !== "failed";

  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-md text-center">
        {success ? (
          <>
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-bold">Paiement réussi</h1>
            <p className="text-sm text-muted-foreground mt-2">Votre commande a été confirmée. Vous recevrez un email de confirmation dans quelques minutes.</p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild><Link to="/account/orders">Voir mes commandes</Link></Button>
              <Button variant="outline" asChild><Link to="/">Continuer mes achats</Link></Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="font-heading text-2xl font-bold">Échec du paiement</h1>
            <p className="text-sm text-muted-foreground mt-2">Une erreur s'est produite. Aucun montant n'a été débité. Vous pouvez réessayer.</p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild><Link to="/checkout">Réessayer</Link></Button>
              <Button variant="outline" asChild><Link to="/cart">Retour au panier</Link></Button>
            </div>
          </>
        )}
      </div>
    </MarketplaceLayout>
  );
}
