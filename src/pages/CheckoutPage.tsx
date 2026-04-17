import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Truck, CreditCard, MapPin, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Stepper } from "@/components/common/Stepper";
import { WilayaSelect } from "@/components/common/WilayaSelect";
import { EmptyState } from "@/components/common/EmptyState";
import { useCart, useAddresses, ordersApi, addressesApi, promotionsApi } from "@/hooks/useMarketplace";
import { formatDZD } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import type { Address, DeliveryMode, PaymentMethod } from "@/types/marketplace";
import { cn } from "@/lib/utils";

const addressSchema = z.object({
  label: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(8),
  street: z.string().min(3),
  commune: z.string().min(2),
  wilaya: z.string().min(2),
});

type DeliveryOption = { id: DeliveryMode; label: string; delay: string; price: number };
const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: "home", label: "Livraison à domicile", delay: "2-4 jours", price: 400 },
  { id: "express", label: "Livraison express", delay: "24h", price: 800 },
  { id: "relay", label: "Point relais / bureau de poste", delay: "3-5 jours", price: 0 },
];

type PaymentOption = { id: PaymentMethod; label: string; desc: string };
const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "cod", label: "Paiement à la livraison", desc: "Payez en espèces à la réception" },
  { id: "ccp", label: "CCP", desc: "Transfert via votre compte postal" },
  { id: "baridimob", label: "BaridiMob", desc: "Paiement via l'app BaridiMob" },
  { id: "card_cib", label: "Carte CIB", desc: "Paiement en ligne sécurisé" },
  { id: "card_edahabia", label: "Carte Edahabia", desc: "Paiement en ligne sécurisé" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refresh } = useCart();
  const { data: addresses, reload: reloadAddresses } = useAddresses();
  const [step, setStep] = useState(0);
  const [addressId, setAddressId] = useState<string>("");
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, "id" | "userId" | "isDefault">>({
    label: "Maison", firstName: "", lastName: "", phone: "", street: "", commune: "", wilaya: "",
  });
  const [delivery, setDelivery] = useState<DeliveryMode>("home");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Auto-sélection adresse par défaut
  if (addresses && addresses.length > 0 && !addressId) {
    setAddressId(addresses.find(a => a.isDefault)?.id || addresses[0].id);
  }

  const steps = ["Adresse", "Livraison", "Paiement", "Récapitulatif"];
  const shippingFee = DELIVERY_OPTIONS.find(o => o.id === delivery)?.price || 0;
  const finalTotal = cart.subtotal + shippingFee - discount;
  const selectedAddr = addresses?.find(a => a.id === addressId);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    const promo = await promotionsApi.validateCode(coupon.trim(), cart.subtotal);
    if (!promo) { toast({ title: "Code invalide", variant: "destructive" }); setDiscount(0); return; }
    const d = promo.type === "percent" ? Math.round(cart.subtotal * promo.value / 100) : promo.type === "fixed" ? promo.value : 0;
    setDiscount(d);
    toast({ title: "Code appliqué", description: `-${formatDZD(d)}` });
  };

  const saveNewAddress = async () => {
    const parsed = addressSchema.safeParse(newAddr);
    if (!parsed.success) { toast({ title: "Adresse incomplète", variant: "destructive" }); return; }
    const a = await addressesApi.create({ ...newAddr, userId: "current", isDefault: false });
    await reloadAddresses();
    setAddressId(a.id);
    setShowNewAddr(false);
  };

  const placeOrder = async () => {
    if (!selectedAddr) return;
    setSubmitting(true);
    try {
      const order = await ordersApi.create({
        items: cart.items, shippingAddress: selectedAddr,
        deliveryMode: delivery, paymentMethod: payment,
        shippingFee, discount,
      });
      await refresh();
      navigate(`/order-confirmation?id=${order.id}`);
    } catch (e) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  if (cart.items.length === 0) {
    return (
      <MarketplaceLayout>
        <div className="container py-12">
          <EmptyState title="Votre panier est vide" description="Ajoutez des produits avant de passer commande."
            action={<Button asChild><Link to="/products">Voir les produits</Link></Button>} />
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="container py-8 max-w-5xl">
        <h1 className="font-heading text-2xl font-bold mb-6">Finaliser ma commande</h1>
        <Stepper steps={steps} current={step} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border rounded-lg p-6 space-y-4">
            {step === 0 && (
              <>
                <h2 className="font-heading font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Adresse de livraison</h2>
                <div className="space-y-2">
                  {addresses?.map(a => (
                    <label key={a.id} className={cn("flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      addressId === a.id ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
                      <input type="radio" name="addr" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{a.label} — {a.firstName} {a.lastName}</p>
                        <p className="text-muted-foreground">{a.street}, {a.commune}, {a.wilaya}</p>
                        <p className="text-muted-foreground">{a.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {!showNewAddr ? (
                  <Button variant="outline" size="sm" onClick={() => setShowNewAddr(true)}><Plus className="h-4 w-4 me-1" /> Ajouter une adresse</Button>
                ) : (
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Étiquette (Maison, Bureau...)" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} />
                      <Input placeholder="Téléphone" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
                      <Input placeholder="Prénom" value={newAddr.firstName} onChange={(e) => setNewAddr({ ...newAddr, firstName: e.target.value })} />
                      <Input placeholder="Nom" value={newAddr.lastName} onChange={(e) => setNewAddr({ ...newAddr, lastName: e.target.value })} />
                      <Input className="col-span-2" placeholder="Adresse" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} />
                      <Input placeholder="Commune" value={newAddr.commune} onChange={(e) => setNewAddr({ ...newAddr, commune: e.target.value })} />
                      <WilayaSelect value={newAddr.wilaya} onChange={(v) => setNewAddr({ ...newAddr, wilaya: v })} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveNewAddress}>Enregistrer</Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowNewAddr(false)}>Annuler</Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="font-heading font-semibold flex items-center gap-2"><Truck className="h-4 w-4" /> Mode de livraison</h2>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map(o => (
                    <label key={o.id} className={cn("flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors",
                      delivery === o.id ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={delivery === o.id} onChange={() => setDelivery(o.id)} />
                        <div>
                          <p className="text-sm font-medium">{o.label}</p>
                          <p className="text-xs text-muted-foreground">{o.delay}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{o.price === 0 ? "Gratuit" : formatDZD(o.price)}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-heading font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Mode de paiement</h2>
                <div className="space-y-2">
                  {PAYMENT_OPTIONS.map(o => (
                    <label key={o.id} className={cn("flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                      payment === o.id ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
                      <input type="radio" checked={payment === o.id} onChange={() => setPayment(o.id)} className="mt-1" />
                      <div>
                        <p className="text-sm font-medium">{o.label}</p>
                        <p className="text-xs text-muted-foreground">{o.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="font-heading font-semibold">Récapitulatif</h2>
                <div className="text-sm space-y-3">
                  <div>
                    <p className="font-medium mb-1">Adresse</p>
                    <p className="text-muted-foreground">{selectedAddr?.firstName} {selectedAddr?.lastName} — {selectedAddr?.street}, {selectedAddr?.commune}, {selectedAddr?.wilaya}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Livraison</p>
                    <p className="text-muted-foreground">{DELIVERY_OPTIONS.find(o => o.id === delivery)?.label}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Paiement</p>
                    <p className="text-muted-foreground">{PAYMENT_OPTIONS.find(o => o.id === payment)?.label}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Articles</p>
                    {cart.items.map(it => (
                      <div key={it.productId} className="flex justify-between text-xs py-1 border-b last:border-0">
                        <span>{it.name} × {it.quantity}</span>
                        <span>{formatDZD(it.unitPrice * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-4 border-t">
              {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>Retour</Button> : <div />}
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !addressId}>Continuer</Button>
              ) : (
                <Button onClick={placeOrder} disabled={submitting}>
                  {submitting ? "Traitement..." : <><Check className="h-4 w-4 me-1" /> Confirmer la commande</>}
                </Button>
              )}
            </div>
          </div>

          {/* Récap latéral */}
          <aside className="bg-card border rounded-lg p-6 h-fit space-y-3">
            <h3 className="font-heading font-semibold">Total</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatDZD(cart.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{shippingFee === 0 ? "Gratuit" : formatDZD(shippingFee)}</span></div>
              {discount > 0 && <div className="flex justify-between text-success"><span>Remise</span><span>-{formatDZD(discount)}</span></div>}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Code promo" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <Button variant="outline" size="sm" onClick={applyCoupon}>OK</Button>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span><span>{formatDZD(finalTotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
