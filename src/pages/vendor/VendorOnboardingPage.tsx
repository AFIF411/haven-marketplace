import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Store, Package, CreditCard, Check, ArrowRight } from "lucide-react";
import { wilayas } from "@/data/mockData";

const steps = [
  { icon: Store, title: "Votre boutique", desc: "Informations de base" },
  { icon: Package, title: "Vos produits", desc: "Ce que vous vendez" },
  { icon: CreditCard, title: "Paiement", desc: "Comment être payé" },
];

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(0);

  return (
    <MarketplaceLayout>
      <div className="container py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold">Ouvrez votre boutique</h1>
          <p className="text-sm text-muted-foreground mt-1">En quelques minutes, commencez à vendre sur Souk DZ</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>{s.title}</span>
              {i < steps.length - 1 && <div className={`h-px w-6 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          {step === 0 && (
            <>
              <h2 className="font-heading font-semibold">Informations de la boutique</h2>
              <div><label className="text-sm font-medium mb-1 block">Nom de la boutique</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Ma Boutique" /></div>
              <div><label className="text-sm font-medium mb-1 block">Description</label><textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px]" placeholder="Décrivez votre boutique..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium mb-1 block">Catégorie principale</label><select className="w-full h-10 px-3 rounded-md border bg-background text-sm"><option>Mode</option><option>Maison</option><option>Artisanat</option><option>Alimentation</option></select></div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Wilaya</label>
                  <select className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                    <option value="">Sélectionner</option>
                    {wilayas.map((w, i) => (
                      <option key={w} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-heading font-semibold">Type de produits</h2>
              <p className="text-sm text-muted-foreground">Quels types de produits comptez-vous vendre ?</p>
              <div className="grid grid-cols-2 gap-3">
                {["Produits physiques", "Produits digitaux", "Services", "Artisanat traditionnel"].map(t => (
                  <label key={t} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:border-primary/50">
                    <input type="checkbox" className="rounded" /><span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-heading font-semibold">Informations de paiement</h2>
              <div><label className="text-sm font-medium mb-1 block">Numéro CCP</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="XXXXXXXX clé XX" /></div>
              <div><label className="text-sm font-medium mb-1 block">Titulaire du compte</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Nom complet" /></div>
              <div><label className="text-sm font-medium mb-1 block">RIB bancaire (optionnel)</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="XXXXXXXXXXXXXXXXXXXX" /></div>
            </>
          )}

          <div className="flex justify-between pt-4 border-t">
            {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>Retour</Button> : <div />}
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)}>Continuer <ArrowRight className="ml-1 h-4 w-4" /></Button>
            ) : (
              <Button asChild><Link to="/vendor">Créer ma boutique</Link></Button>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
