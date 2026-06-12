import { useParams, Link } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft } from "lucide-react";

export default function InvoicePage() {
  const { id } = useParams();
  return (
    <MarketplaceLayout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/account/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 me-1" /> Retour
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 me-2" />Imprimer</Button>
            <Button><Download className="h-4 w-4 me-2" />Télécharger PDF</Button>
          </div>
        </div>

        <div className="bg-white text-black p-10 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-heading text-2xl font-bold text-primary">Souk DZ</div>
              <div className="text-xs text-gray-500 mt-1">Marketplace algérienne<br />contact@soukdz.com</div>
            </div>
            <div className="text-end">
              <div className="font-heading text-xl font-bold">FACTURE</div>
              <div className="text-sm text-gray-600 mt-1">N° INV-{id || "2026-0001"}</div>
              <div className="text-sm text-gray-600">Date : 12/06/2026</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8 text-sm">
            <div><div className="font-semibold mb-1">Facturé à</div><div className="text-gray-600">Mohamed Benali<br />Cité 1000 logements, Bt A4<br />16000 Alger</div></div>
            <div><div className="font-semibold mb-1">Vendeur</div><div className="text-gray-600">Artisan Kabyle<br />Tizi Ouzou, Algérie</div></div>
          </div>

          <table className="w-full mt-8 text-sm">
            <thead className="border-b-2 border-gray-300"><tr><th className="text-start py-2">Description</th><th className="text-center">Qté</th><th className="text-end">PU</th><th className="text-end">Total</th></tr></thead>
            <tbody>
              <tr className="border-b"><td className="py-3">Sac en cuir berbère</td><td className="text-center">1</td><td className="text-end">3 500 DA</td><td className="text-end">3 500 DA</td></tr>
              <tr className="border-b"><td className="py-3">Bracelet artisanal</td><td className="text-center">2</td><td className="text-end">1 200 DA</td><td className="text-end">2 400 DA</td></tr>
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-64 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-600">Sous-total</span><span>5 900 DA</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Livraison</span><span>500 DA</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-1"><span>Total TTC</span><span>6 400 DA</span></div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t text-xs text-gray-500 text-center">
            Merci de votre confiance — Souk DZ
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
