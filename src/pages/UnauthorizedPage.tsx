import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ShieldX, RefreshCw, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { defaultHomeForRole } from "@/lib/routeGuards";

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
      <div className="container py-20 text-center max-w-md">
        <ShieldX className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Accès refusé</h1>
        <p className="text-muted-foreground mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          {user && " Si vos droits ont récemment changé, actualisez-les."}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild variant="outline">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          {user ? (
            <Button onClick={handleRefresh} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <RefreshCw className="h-4 w-4 me-2" />}
              Actualiser mes droits
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          )}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
