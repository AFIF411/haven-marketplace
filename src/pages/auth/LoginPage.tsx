import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, roles } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const redirectForRoles = (userRoles: string[]) => {
    if (userRoles.includes("super_admin") || userRoles.includes("admin")) return "/admin";
    if (userRoles.includes("viewer")) return "/account";
    if (userRoles.includes("vendeur")) return "/vendor";
    return "/manage";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError(t("auth.fillAll")); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const acc = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      navigate(acc ? redirectForRoles(acc.roles) : "/manage");
    } else {
      setError(result.error || "Erreur");
    }
  };

  const quickLogin = async (acc: typeof DEMO_ACCOUNTS[number]) => {
    setError(""); setLoading(true);
    setEmail(acc.email); setPassword(acc.password);
    const result = await login(acc.email, acc.password);
    setLoading(false);
    if (result.success) navigate(redirectForRoles(acc.roles));
    else setError(result.error || "Erreur");
  };

  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-center">{t("auth.login")}</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">{t("auth.loginSubtitle")}</p>
        {error && (
          <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
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
    </MarketplaceLayout>
  );
}
