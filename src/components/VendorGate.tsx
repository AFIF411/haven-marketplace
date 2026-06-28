// ============================================================
// VendorGate — bloque l'accès à l'espace vendeur tant que la
// boutique n'est pas approuvée par un administrateur.
//
// Règles :
//  - Pas de boutique → redirection vers /account/become-vendor
//  - Boutique pending/rejected/suspended → /account/vendor-status
//  - Boutique active → accès accordé
//  - L'admin/super_admin court-circuite la vérification.
// ============================================================
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Props { children: ReactNode }

export function VendorGate({ children }: Props) {
  const { user, roles, isLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");

  useEffect(() => {
    if (!user || isAdmin) { setChecking(false); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("shops")
        .select("status")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      setStatus(data?.status ?? null);
      setChecking(false);
    })();
    return () => { cancelled = true; };
  }, [user, isAdmin]);

  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin) return <>{children}</>;
  if (!status) return <Navigate to="/account/become-vendor" replace />;
  if (status !== "active") return <Navigate to="/account/vendor-status" replace />;
  return <>{children}</>;
}
