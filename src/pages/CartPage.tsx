import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { mockProducts } from "@/data/mockData";

const cartItems = mockProducts.slice(0, 3).map((p, i) => ({ ...p, qty: i + 1 }));

export default function CartPage() {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <h1 className="font-heading text-2xl font-bold mb-6">Mon panier ({cartItems.length})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 bg-card p-4 rounded-lg border">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-md object-cover bg-secondary" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.id}`} className="font-medium text-sm hover:text-primary line-clamp-1">{item.name}</Link>
                  <p className="text-xs text-muted-foreground">{item.shop}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Minus className="h-3 w-3" /></Button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-3 w-3" /></Button>
                    </div>
                    <span className="font-heading font-bold">{(item.price * item.qty).toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="bg-card p-6 rounded-lg border h-fit sticky top-20">
            <h3 className="font-heading font-semibold mb-4">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{subtotal.toLocaleString('fr-FR')} €</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{shipping === 0 ? 'Gratuit' : `${shipping} €`}</span></div>
              <div className="border-t pt-2 flex justify-between font-heading font-bold text-base">
                <span>Total</span><span>{(subtotal + shipping).toLocaleString('fr-FR')} €</span>
              </div>
            </div>
            <Button className="w-full mt-4" size="lg" asChild>
              <Link to="/checkout">Commander <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">Paiement 100% sécurisé</p>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
