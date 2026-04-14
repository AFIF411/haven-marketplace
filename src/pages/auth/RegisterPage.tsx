import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";

export default function RegisterPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-center">Créer un compte</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Rejoignez notre marketplace</p>
        <form className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Prénom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Jean" /></div>
            <div><label className="text-sm font-medium mb-1 block">Nom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Dupont" /></div>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Email</label><input type="email" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="vous@email.com" /></div>
          <div><label className="text-sm font-medium mb-1 block">Mot de passe</label><input type="password" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Min. 8 caractères" /></div>
          <div className="flex items-start gap-2"><input type="checkbox" className="mt-1 rounded border" /><span className="text-xs text-muted-foreground">J'accepte les <Link to="/terms" className="text-primary hover:underline">CGV</Link> et la <Link to="/privacy" className="text-primary hover:underline">politique de confidentialité</Link></span></div>
          <Button className="w-full" size="lg">Créer mon compte</Button>
        </form>
        <p className="text-sm text-center mt-4 text-muted-foreground">Déjà un compte ? <Link to="/login" className="text-primary hover:underline font-medium">Se connecter</Link></p>
      </div>
    </MarketplaceLayout>
  );
}
