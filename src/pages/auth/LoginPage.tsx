import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-center">Connexion</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Accédez à votre compte Souk DZ</p>
        <form className="mt-6 space-y-4">
          <div><label className="text-sm font-medium mb-1 block">Email</label><input type="email" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="vous@email.com" /></div>
          <div className="relative"><label className="text-sm font-medium mb-1 block">Mot de passe</label><input type={showPw ? "text" : "password"} className="w-full h-10 px-3 pr-10 rounded-md border bg-background text-sm" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] text-muted-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          <div className="flex justify-end"><Link to="/forgot-password" className="text-xs text-primary hover:underline">Mot de passe oublié ?</Link></div>
          <Button className="w-full" size="lg">Se connecter</Button>
        </form>
        <p className="text-sm text-center mt-4 text-muted-foreground">Pas encore de compte ? <Link to="/register" className="text-primary hover:underline font-medium">S'inscrire</Link></p>
      </div>
    </MarketplaceLayout>
  );
}
