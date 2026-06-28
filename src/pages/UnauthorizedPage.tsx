import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ShieldX, RefreshCw, Loader2, Home, LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { defaultHomeForRole } from "@/lib/routeGuards";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const { user, roles, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await refreshRoles();
    setLoading(false);
    toast({ title: "Droits actualisés", description: "Vos rôles ont été synchronisés." });
    if (roles.length > 0) navigate(defaultHomeForRole(roles));
  };

  return (
    <MarketplaceLayout>
      <div className="container py-16 md:py-24 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-lg border-none shadow-lg">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <ShieldX className="h-10 w-10 text-destructive" />
            </div>

            <h1 className="font-heading text-3xl font-bold mb-3">
              Accès refusé
            </h1>

            <p className="text-muted-foreground text-lg mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>

            <div className="text-sm text-muted-foreground mb-8 space-y-2 text-left bg-muted/50 rounded-lg p-4">
              <p className="font-medium text-foreground">Cela peut être dû à :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Une connexion avec un compte n'ayant pas les droits requis.</li>
                <li>Un changement récent de vos rôles non encore synchronisés.</li>
                <li>Une tentative d'accès à une page réservée à un autre espace.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default" size="lg">
                <Link to="/">
                  <Home className="h-4 w-4 me-2" />
                  Retour à l'accueil
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link to="/" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
                  <ArrowLeft className="h-4 w-4 me-2" />
                  Page précédente
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex justify-center">
              {user ? (
                <Button onClick={handleRefresh} disabled={loading} variant="ghost" size="sm">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <RefreshCw className="h-4 w-4 me-2" />}
                  Actualiser mes droits
                </Button>
              ) : (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 me-2" />
                    Se connecter avec un autre compte
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketplaceLayout>
  );
}
