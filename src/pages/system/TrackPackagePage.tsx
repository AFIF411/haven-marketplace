import { useState } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search } from "lucide-react";

export default function TrackPackagePage() {
  const [result, setResult] = useState<null | { status: string; eta: string }>(null);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({ status: "En cours de livraison", eta: "Demain entre 9h et 14h" });
  };

  return (
    <MarketplaceLayout>
      <div className="container py-12 max-w-xl">
        <h1 className="font-heading text-2xl font-bold">Suivre un colis</h1>
        <p className="text-sm text-muted-foreground mt-1">Entrez votre numéro de suivi pour connaître l'état de votre colis.</p>
        <form onSubmit={search} className="mt-6 flex gap-2">
          <Input placeholder="N° de suivi (ex: YL-2026-1245)" required />
          <Button type="submit"><Search className="h-4 w-4 me-2" />Suivre</Button>
        </form>
        {result && (
          <div className="mt-8 p-6 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">{result.status}</div>
                <div className="text-sm text-muted-foreground">Livraison estimée : {result.eta}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
}
