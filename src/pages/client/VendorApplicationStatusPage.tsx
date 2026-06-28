import { useEffect, useState, useCallback } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, RefreshCw, Store, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type ShopStatus = "pending" | "active" | "suspended" | "rejected";

interface ShopRow {
  id: string;
  name: string;
  slug: string;
  status: ShopStatus;
  wilaya: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_META: Record<ShopStatus, { label: string; description: string; icon: typeof Clock; tone: string; badge: "default" | "success" | "destructive" | "pending" | "warning" }> = {
  pending: {
    label: "En attente de validation",
    description: "Votre demande est en cours d'examen par notre équipe. Vous serez notifié dès qu'une décision est prise (généralement sous 24 à 48h).",
    icon: Clock,
    tone: "text-amber-600 bg-amber-100",
    badge: "warning",
  },
  active: {
    label: "Approuvée",
    description: "Félicitations ! Votre boutique est active. Vous pouvez maintenant ajouter vos produits et commencer à vendre.",
    icon: CheckCircle2,
    tone: "text-emerald-600 bg-emerald-100",
    badge: "success",
  },
  rejected: {
    label: "Rejetée",
    description: "Votre demande n'a pas été acceptée. Contactez le support pour en connaître les raisons et soumettre une nouvelle demande.",
    icon: XCircle,
    tone: "text-red-600 bg-red-100",
    badge: "destructive",
  },
  suspended: {
    label: "Suspendue",
    description: "Votre boutique est temporairement suspendue. Contactez le support pour plus d'informations.",
    icon: XCircle,
    tone: "text-red-600 bg-red-100",
    badge: "destructive",
  },
};

export default function VendorApplicationStatusPage() {
  const { user, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShop = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("shops")
      .select("id, name, slug, status, wilaya, created_at, updated_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setShop(data as ShopRow | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchShop();
    // Poll every 15s for status changes
    const id = setInterval(fetchShop, 15000);
    return () => clearInterval(id);
  }, [fetchShop]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShop();
    await refreshRoles();
    setRefreshing(false);
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout type="client" title="Statut de ma demande vendeur">
      <div className="max-w-3xl space-y-6">
        {loading ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Chargement...</CardContent></Card>
        ) : !shop ? (
          <Card>
            <CardHeader>
              <CardTitle>Aucune demande en cours</CardTitle>
              <CardDescription>Vous n'avez pas encore soumis de demande pour ouvrir une boutique.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/account/become-vendor"><Store className="me-2 h-4 w-4" />Devenir vendeur</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="font-heading">{shop.name}</CardTitle>
                    <CardDescription>
                      Demande soumise le {new Date(shop.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                    </CardDescription>
                  </div>
                  <Badge variant={STATUS_META[shop.status].badge}>{STATUS_META[shop.status].label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-lg border bg-muted/30">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${STATUS_META[shop.status].tone}`}>
                    {(() => { const Icon = STATUS_META[shop.status].icon; return <Icon className="h-6 w-6" />; })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{STATUS_META[shop.status].label}</h3>
                    <p className="text-sm text-muted-foreground">{STATUS_META[shop.status].description}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Progression</h4>
                  <ol className="space-y-3">
                    <Step done label="Demande soumise" sub={new Date(shop.created_at).toLocaleString("fr-FR")} />
                    <Step
                      done={shop.status !== "pending"}
                      active={shop.status === "pending"}
                      label="Examen par l'équipe"
                      sub={shop.status === "pending" ? "En cours..." : `Mis à jour le ${new Date(shop.updated_at).toLocaleString("fr-FR")}`}
                    />
                    <Step
                      done={shop.status === "active"}
                      active={false}
                      failed={shop.status === "rejected" || shop.status === "suspended"}
                      label={shop.status === "rejected" ? "Demande rejetée" : shop.status === "suspended" ? "Boutique suspendue" : "Boutique activée"}
                      sub={shop.status === "active" ? "Vous pouvez accéder à votre espace vendeur" : "—"}
                    />
                  </ol>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`me-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Actualiser
                  </Button>
                  {shop.status === "active" && (
                    <Button onClick={() => navigate("/vendor")}>
                      Accéder à mon espace vendeur <ArrowRight className="ms-2 h-4 w-4" />
                    </Button>
                  )}
                  {(shop.status === "rejected" || shop.status === "suspended") && (
                    <Button variant="outline" asChild>
                      <Link to="/account/support">Contacter le support</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function Step({ done, active, failed, label, sub }: { done?: boolean; active?: boolean; failed?: boolean; label: string; sub?: string }) {
  const color = failed
    ? "bg-red-100 text-red-600 border-red-200"
    : done
    ? "bg-emerald-100 text-emerald-600 border-emerald-200"
    : active
    ? "bg-amber-100 text-amber-600 border-amber-200 animate-pulse"
    : "bg-muted text-muted-foreground border-border";
  return (
    <li className="flex items-start gap-3">
      <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 ${color}`}>
        {failed ? <XCircle className="h-4 w-4" /> : done ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
      </div>
      <div className="pt-1">
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </li>
  );
}
