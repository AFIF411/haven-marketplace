import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";
import { useCart } from "@/hooks/useMarketplace";

export default function CartPage() {
  const { t } = useTranslation();
  const { cart, updateQty, remove } = useCart();

  if (cart.items.length === 0) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-muted rounded-full p-6 mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-2">{t("cart.title")}</h1>
          <p className="text-muted-foreground mb-6">{t("cart.empty") || "Votre panier est vide"}</p>
          <Button asChild size="lg">
            <Link to="/products">{t("nav.products") || "Parcourir les produits"}</Link>
          </Button>
        </div>
      </MarketplaceLayout>
    );
  }

  const shipping = cart.shipping;
  const subtotal = cart.subtotal;

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <h1 className="font-heading text-2xl font-bold mb-6">{t("cart.title")} ({cart.items.length})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map(item => (
              <div key={item.productId} className="flex gap-4 bg-card p-4 rounded-lg border">
                <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-md object-cover bg-secondary" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.productId}`} className="font-medium text-sm hover:text-primary line-clamp-1">{item.name}</Link>
                  <p className="text-xs text-muted-foreground">{item.shopName}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQty(item.productId, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQty(item.productId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                    <span className="font-heading font-bold">{formatDZD(item.unitPrice * item.quantity)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => remove(item.productId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="bg-card p-6 rounded-lg border h-fit sticky top-20">
            <h3 className="font-heading font-semibold mb-4">{t("cart.summary")}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span>{formatDZD(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.shipping")}</span><span>{shipping === 0 ? t("cart.free") : formatDZD(shipping)}</span></div>
              <div className="border-t pt-2 flex justify-between font-heading font-bold text-base">
                <span>{t("cart.total")}</span><span>{formatDZD(subtotal + shipping)}</span>
              </div>
            </div>
            <Button className="w-full mt-4" size="lg" asChild>
              <Link to="/checkout">{t("cart.order")} <ArrowRight className="ms-2 h-4 w-4" /></Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">{t("cart.securePayment")}</p>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
