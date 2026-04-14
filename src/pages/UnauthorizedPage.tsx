import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-20 text-center max-w-md">
        <ShieldX className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Accès refusé</h1>
        <p className="text-muted-foreground mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
