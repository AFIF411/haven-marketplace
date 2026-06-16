import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const resend = async () => {
    setSending(true);
    // Placeholder: à brancher sur ton backend (POST /auth/resend-verification)
    await new Promise(r => setTimeout(r, 500));
    setSending(false);
    toast({ title: "Email renvoyé", description: "Consulte ta boîte de réception." });
    setCooldown(30);
    const id = setInterval(() => {
      setCooldown(c => { if (c <= 1) { clearInterval(id); return 0; } return c - 1; });
    }, 1000);
  };

  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-md text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold">Vérifiez votre email</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Nous avons envoyé un lien de confirmation à votre adresse email. Cliquez sur ce lien pour activer votre compte.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="outline" onClick={resend} disabled={sending || cooldown > 0}>
            {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : sending ? "Envoi…" : "Renvoyer l'email"}
          </Button>
          <Link to="/login" className="text-sm text-primary hover:underline">Retour à la connexion</Link>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
