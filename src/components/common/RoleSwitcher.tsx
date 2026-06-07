import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_ROLES, ROLE_LABELS, AppRole } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { UserCog, X } from "lucide-react";

/**
 * Sélecteur de rôle (mock-only) — permet de tester rapidement
 * toutes les vues sans backend. À retirer lorsque le backend
 * Spring Boot sera branché.
 */
export function RoleSwitcher() {
  const { user, roles, setRoles } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const toggle = (r: AppRole) => {
    setRoles(roles.includes(r) ? roles.filter(x => x !== r) : [...roles, r]);
  };

  return (
    <div className="fixed bottom-4 end-4 z-50">
      {open ? (
        <div className="w-64 rounded-lg border bg-card shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Démo — Rôles</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-1">
            {ALL_ROLES.map(r => (
              <label key={r} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-2 py-1">
                <input type="checkbox" checked={roles.includes(r)} onChange={() => toggle(r)} />
                <span>{ROLE_LABELS[r]}</span>
              </label>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-snug">
            Mock localStorage. Rafraîchir la page après changement si besoin.
          </p>
        </div>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)} className="shadow-lg">
          <UserCog className="h-4 w-4 me-2" /> Rôles ({roles.length})
        </Button>
      )}
    </div>
  );
}
