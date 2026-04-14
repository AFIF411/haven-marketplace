import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CreditCard, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { wilayas, formatDZD } from "@/data/mockData";

const steps = ["Adresse", "Livraison", "Paiement"];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);

  return (
    <MarketplaceLayout>
      <div className="container py-8 max-w-3xl">
        <h1 className="font-heading text-2xl font-bold mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          {step === 0 && (
            <>
              <h2 className="font-heading font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Adresse de livraison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="text-sm font-medium mb-1 block">Prénom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Mohamed" /></div>
                <div><label className="text-sm font-medium mb-1 block">Nom</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Benali" /></div>
                <div className="sm:col-span-2"><label className="text-sm font-medium mb-1 block">Adresse</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="123 Rue Didouche Mourad" /></div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Wilaya</label>
                  <select className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                    <option value="">Sélectionner une wilaya</option>
                    {wilayas.map((w, i) => (
                      <option key={w} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>
                    ))}
                  </select>
                </div>
                <div><label className="text-sm font-medium mb-1 block">Commune</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="Sidi M'Hamed" /></div>
                <div><label className="text-sm font-medium mb-1 block">Téléphone</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="05 XX XX XX XX" /></div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-heading font-semibold flex items-center gap-2"><Truck className="h-4 w-4" /> Mode de livraison</h2>
              <div className="space-y-2">
                {[
                  { name: "Livraison à domicile", delay: "2-4 jours", price: "400 DA" },
                  { name: "Livraison express", delay: "24h", price: "800 DA" },
                  { name: "Point relais / bureau de poste", delay: "3-5 jours", price: "Gratuit" },
                ].map((m, i) => (
                  <label key={m.name} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:border-primary/50 transition-colors ${i === 0 ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border-2 ${i === 0 ? 'border-primary bg-primary' : 'border-border'}`}>
                        {i === 0 && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground m-auto mt-[3px]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.delay}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{m.price}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-heading font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Paiement</h2>
              <div className="space-y-3">
                {[
                  { name: "Paiement à la livraison", desc: "Payez en espèces à la réception" },
                  { name: "CCP / BaridiMob", desc: "Transfert via votre compte postal" },
                  { name: "Carte bancaire (CIB / Edahabia)", desc: "Paiement en ligne sécurisé" },
                ].map((m, i) => (
                  <label key={m.name} className={`flex items-center p-4 rounded-lg border cursor-pointer hover:border-primary/50 transition-colors ${i === 0 ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border-2 ${i === 0 ? 'border-primary bg-primary' : 'border-border'}`}>
                        {i === 0 && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground m-auto mt-[3px]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between pt-4 border-t">
            {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>Retour</Button> : <div />}
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)}>Continuer</Button>
            ) : (
              <Button asChild><Link to="/order-confirmation">Confirmer {formatDZD(17000)}</Link></Button>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
