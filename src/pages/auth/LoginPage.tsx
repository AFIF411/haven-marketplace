import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Eye, EyeOff, Loader2, ShieldCheck, Store, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@oneclick.dz", password: "demo1234", icon: ShieldCheck, redirect: "/admin" },
  { label: "Vendeur", email: "vendeur@oneclick.dz", password: "demo1234", icon: Store, redirect: "/vendor" },
  { label: "Client", email: "client@oneclick.dz", password: "demo1234", icon: UserIcon, redirect: "/account" },
];

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const redirectForRoles = (userRoles: string[]) => {
    if (userRoles.includes("super_admin") || userRoles.includes("admin")) return "/admin";
    if (userRoles.includes("vendeur")) return "/vendor";
    return "/account";
  };

  const performLogin = async (em: string, pw: string, fallback?: string) => {
    setError("");
    setLoading(true);
    const result = await login(em, pw);
    if (!result.success) {
      setLoading(false);
      setError(result.error || "Erreur");
      return;
    }
    // Charger les rôles depuis Supabase pour rediriger correctement
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    let userRoles: string[] = [];
    if (uid) {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      userRoles = (data || []).map((r: { role: string }) => r.role);
    }
    setLoading(false);
    navigate(fallback || redirectForRoles(userRoles));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError(t("auth.fillAll")); return; }
    await performLogin(email, password);
  };

  return (
    <MarketplaceLayout>
      <div className="container py-12 grid md:grid-cols-2 gap-8 max-w-4xl">
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("auth.login")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("auth.loginSubtitle")}</p>
          {error && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("auth.email")}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="vous@email.com" />
            </div>
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">{t("auth.password")}</label>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full h-10 px-3 pe-10 rounded-md border bg-background text-sm" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute end-3 top-[34px] text-muted-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            <div className="flex justify-end"><Link to="/forgot-password" className="text-xs text-primary hover:underline">{t("auth.forgotPassword")}</Link></div>
            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : null}
              {t("auth.loginButton")}
            </Button>
          </form>
          <p className="text-sm text-center mt-4 text-muted-foreground">{t("auth.noAccount")} <Link to="/register" className="text-primary hover:underline font-medium">{t("auth.register")}</Link></p>
        </div>

        <aside className="rounded-xl border bg-card p-5">
          <h2 className="font-heading font-semibold text-lg">Connexion rapide (test)</h2>
          <p className="text-xs text-muted-foreground mt-1">Cliquez sur un profil pour vous connecter instantanément.</p>
          <div className="mt-4 space-y-2">
            {DEMO_ACCOUNTS.map(acc => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => performLogin(acc.email, acc.password, acc.redirect)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition text-start disabled:opacity-50"
                >
                  <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{acc.label}</span>
                    <span className="block text-xs text-muted-foreground">{acc.email}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">→</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
            Mot de passe : <code className="bg-muted px-1.5 py-0.5 rounded">demo1234</code>
          </p>
        </aside>
      </div>
    </MarketplaceLayout>
  );
}
