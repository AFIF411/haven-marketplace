import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Store, User as UserIcon, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { wilayas } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const STEPS = ["Identité", "Boutique", "Conditions"] as const;

export default function VendorRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Étape 1 — Identité
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Étape 2 — Boutique
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fashion");
  const [wilaya, setWilaya] = useState("Alger");
  const [address, setAddress] = useState("");
  const [rc, setRc] = useState("");
  const [nif, setNif] = useState("");

  // Étape 3 — Conditions
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptCommission, setAcceptCommission] = useState(false);

  const next = () => {
    setError("");
    if (step === 0) {
      if (!firstName || !lastName || !email || !phone || !password)
        return setError("Tous les champs sont requis.");
      if (password.length < 8) return setError("Mot de passe : 8 caractères minimum.");
    }
    if (step === 1) {
      if (shopName.trim().length < 2) return setError("Nom de boutique requis.");
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!acceptTerms || !acceptCommission) {
      return setError("Vous devez accepter les conditions.");
    }
    setLoading(true);

    // 1) Création du compte
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { first_name: firstName, last_name: lastName, phone },
      },
    });
    if (signUpError) {
      setLoading(false);
      return setError(signUpError.message);
    }

    // 2) Connexion (au cas où session non créée)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      toast({ title: "Compte créé", description: "Vérifiez votre email puis connectez-vous pour finaliser." });
      return navigate("/login");
    }

    // 3) Demande boutique
    const fullDescription = [
      description.trim(),
      address ? `Adresse: ${address}` : "",
      rc ? `RC: ${rc}` : "",
      nif ? `NIF: ${nif}` : "",
    ].filter(Boolean).join("\n");

    const { error: rpcError } = await supabase.rpc("become_vendeur", {
      _name: shopName.trim(),
      _description: fullDescription || null,
      _wilaya: wilaya,
      _phone: phone || null,
      _category: category,
    });
    setLoading(false);
    if (rpcError) {
      toast({ title: "Compte créé mais demande échouée", description: rpcError.message, variant: "destructive" });
      return navigate("/account/become-vendor");
    }

    toast({ title: "Demande envoyée !", description: "Votre boutique est en attente de validation." });
    navigate("/account/vendor-status", { replace: true });
  };

  return (
    <MarketplaceLayout>
      <div className="container py-10 max-w-2xl">
        {/* Toggle Client / Vendeur */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-secondary mb-6">
          <Link to="/register" className="flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">
            <UserIcon className="h-4 w-4" /> Client
          </Link>
          <button className="flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium bg-background shadow-sm">
            <Store className="h-4 w-4 text-primary" /> Vendeur
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="font-heading text-2xl font-bold">Devenez vendeur sur OneClick Tijara</h1>
          <p className="text-sm text-muted-foreground mt-1">Créez votre compte professionnel et ouvrez votre boutique en quelques minutes.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${i < step ? "bg-primary border-primary text-primary-foreground" : i === step ? "border-primary" : "border-muted"}`}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="bg-card border rounded-lg p-6 space-y-4">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Prénom *</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Mohamed" /></div>
                <div><Label>Nom *</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Benali" /></div>
              </div>
              <div><Label>Email professionnel *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@boutique.dz" /></div>
              <div><Label>Téléphone *</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213 5 XX XX XX XX" /></div>
              <div><Label>Mot de passe *</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 caractères" /></div>
            </>
          )}

          {step === 1 && (
            <>
              <div><Label>Nom de la boutique *</Label><Input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Ex: Artisan Cuir Alger" /></div>
              <div><Label>Description</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Présentez votre boutique" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Catégorie principale</Label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                    <option value="fashion">Mode</option>
                    <option value="home">Maison</option>
                    <option value="craft">Artisanat</option>
                    <option value="food">Alimentation</option>
                    <option value="electronics">Électronique</option>
                    <option value="beauty">Beauté</option>
                  </select>
                </div>
                <div>
                  <Label>Wilaya *</Label>
                  <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                    {wilayas.map((w, i) => (
                      <option key={w} value={w}>{String(i + 1).padStart(2, "0")} - {w}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div><Label>Adresse</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rue, ville" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Registre de commerce (RC)</Label><Input value={rc} onChange={(e) => setRc(e.target.value)} placeholder="16/00-1234567" /></div>
                <div><Label>NIF</Label><Input value={nif} onChange={(e) => setNif(e.target.value)} placeholder="0987654321" /></div>
              </div>
              <p className="text-xs text-muted-foreground">RC et NIF facultatifs au moment de l'inscription — exigibles avant activation du compte vendeur.</p>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-md border bg-secondary/30 p-4 text-sm space-y-2">
                <p className="font-medium">Récapitulatif</p>
                <p><span className="text-muted-foreground">Vendeur :</span> {firstName} {lastName} — {email}</p>
                <p><span className="text-muted-foreground">Boutique :</span> {shopName} ({category})</p>
                <p><span className="text-muted-foreground">Wilaya :</span> {wilaya}</p>
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-1" />
                <span>J'accepte les <Link to="/terms" className="text-primary hover:underline">conditions générales</Link> vendeur et la <Link to="/privacy" className="text-primary hover:underline">politique de confidentialité</Link>.</span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={acceptCommission} onChange={(e) => setAcceptCommission(e.target.checked)} className="mt-1" />
                <span>J'accepte la commission de la plateforme sur chaque vente conclue.</span>
              </label>

              <p className="text-xs text-muted-foreground">
                Après envoi, votre boutique sera examinée par notre équipe (généralement sous 48h).
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={back} disabled={step === 0 || loading}>
              Retour
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next}>
                Suivant <ArrowRight className="ms-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                Envoyer ma demande
              </Button>
            )}
          </div>
        </form>

        <p className="text-sm text-center mt-4 text-muted-foreground">
          Déjà inscrit ? <Link to="/login" className="text-primary hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </MarketplaceLayout>
  );
}
