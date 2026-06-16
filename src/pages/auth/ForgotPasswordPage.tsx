import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useTranslation } from "@/contexts/I18nContext";
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/.+@.+\..+/.test(email)) {
      toast({ title: "Email invalide", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    // Placeholder: à brancher sur ton backend (POST /auth/forgot)
    await new Promise(r => setTimeout(r, 600));
    setSubmitting(false);
    setSent(true);
    toast({ title: "Email envoyé", description: "Vérifie ta boîte mail." });
  };

  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-center">{t("auth.forgotTitle")}</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">{t("auth.forgotSubtitle")}</p>
        {sent ? (
          <div className="mt-6 p-4 rounded-md border bg-success/10 text-sm text-center">
            Si un compte est associé à <strong>{email}</strong>, un lien de réinitialisation y a été envoyé.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="forgot-email" className="text-sm font-medium mb-1 block">{t("auth.email")}</label>
              <Input id="forgot-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@email.com" />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Envoi…" : t("auth.sendLink")}
            </Button>
          </form>
        )}
        <p className="text-sm text-center mt-4 text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">{t("auth.backToLogin")}</Link>
        </p>
      </div>
    </MarketplaceLayout>
  );
}
