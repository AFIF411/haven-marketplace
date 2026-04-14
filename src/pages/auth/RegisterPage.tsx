import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !email || !password) { setError("Veuillez remplir tous les champs obligatoires"); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères"); return; }
    if (!accepted) { setError("Veuillez accepter les conditions"); return; }
    setLoading(true);
    const result = await register({ firstName, lastName, email, phone, password });
    setLoading(false);
    if (result.success) {
      navigate("/account");
    } else {
      setError(result.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-center">Créer un compte</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Rejoignez Souk DZ</p>
        {error && (
          <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Prénom</label><input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Mohamed" /></div>
            <div><label className="text-sm font-medium mb-1 block">Nom</label><input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Benali" /></div>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="vous@email.com" /></div>
          <div><label className="text-sm font-medium mb-1 block">Téléphone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="+213 5 XX XX XX XX" /></div>
          <div><label className="text-sm font-medium mb-1 block">Mot de passe</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Min. 8 caractères" /></div>
          <div className="flex items-start gap-2">
            <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1 rounded border" />
            <span className="text-xs text-muted-foreground">J'accepte les <Link to="/terms" className="text-primary hover:underline">CGV</Link> et la <Link to="/privacy" className="text-primary hover:underline">politique de confidentialité</Link></span>
          </div>
          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Créer mon compte
          </Button>
        </form>
        <p className="text-sm text-center mt-4 text-muted-foreground">Déjà un compte ? <Link to="/login" className="text-primary hover:underline font-medium">Se connecter</Link></p>
      </div>
    </MarketplaceLayout>
  );
}
