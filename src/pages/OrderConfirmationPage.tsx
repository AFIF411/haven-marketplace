import { Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";

export default function OrderConfirmationPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-lg text-center">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-bold">Commande confirmée !</h1>
        <p className="text-muted-foreground mt-2">Votre commande <span className="font-mono font-medium text-foreground">CMD-2024-006</span> a été passée avec succès.</p>
        <div className="bg-card rounded-lg border p-6 mt-6 text-left space-y-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span>{new Date().toLocaleDateString('fr-FR')}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-medium">257,99 €</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Livraison</span><span>Standard (3-5 jours)</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Statut</span><span className="text-success font-medium">Confirmée</span></div>
        </div>
        <div className="flex gap-3 mt-6 justify-center">
          <Button asChild><Link to="/account/orders">Voir mes commandes <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          <Button variant="outline" asChild><Link to="/">Continuer mes achats</Link></Button>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
