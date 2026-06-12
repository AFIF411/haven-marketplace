import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppRole } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { UserCog, X, Shield, Store, User } from "lucide-react";

/**
 * Sélecteur de rôle (mock-only) — 3 rôles simples : Client, Vendeur, Admin.
 * Permet de tester rapidement chaque espace sans se reconnecter.
 */
const SIMPLE_ROLES: Array<{ role: AppRole; label: string; icon: typeof Shield; redirect: string }> = [
  { role: "viewer",      label: "Client",  icon: User,   redirect: "/account" },
  { role: "vendeur",     label: "Vendeur", icon: Store,  redirect: "/vendor" },
  { role: "super_admin", label: "Admin",   icon: Shield, redirect: "/admin" },
];

export function RoleSwitcher() {
  const { user, roles, setRoles } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const switchTo = (r: AppRole, redirect: string) => {
    setRoles([r]);
    setOpen(false);
    navigate(redirect);
  };

  const current = SIMPLE_ROLES.find(s => roles.includes(s.role))?.label || roles[0] || "—";

  return (
    <div className="fixed bottom-4 end-4 z-50">
      {open ? (
        <div className="w-60 rounded-lg border bg-card shadow-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Changer de rôle (démo)</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-1.5">
            {SIMPLE_ROLES.map(s => {
              const active = roles.includes(s.role);
              return (
                <button
                  key={s.role}
                  onClick={() => switchTo(s.role, s.redirect)}
                  className={`flex items-center gap-2 text-sm rounded-md px-2.5 py-2 border transition-colors ${active ? "bg-primary/10 border-primary text-primary font-medium" : "hover:bg-muted/50 border-transparent"}`}
                >
                  <s.icon className="h-4 w-4" />
                  <span>{s.label}</span>
                  {active && <span className="ms-auto text-[10px] uppercase">actif</span>}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-snug">
            Mock localStorage — uniquement pour la démo.
          </p>
        </div>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)} className="shadow-lg">
          <UserCog className="h-4 w-4 me-2" /> {current}
        </Button>
      )}
    </div>
  );
}
