import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé", description: "Nous vous répondrons sous 24h." });
    (e.target as HTMLFormElement).reset();
  };
  return (
    <MarketplaceLayout>
      <div className="container py-12 max-w-5xl">
        <h1 className="font-heading text-3xl font-bold">Contactez-nous</h1>
        <p className="text-muted-foreground mt-2">Notre équipe est disponible du dimanche au jeudi, 9h–18h.</p>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="space-y-4">
            <div className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium text-sm">Email</div><div className="text-sm text-muted-foreground">contact@soukdz.com</div></div></div>
            <div className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium text-sm">Téléphone</div><div className="text-sm text-muted-foreground">+213 21 00 00 00</div></div></div>
            <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-medium text-sm">Adresse</div><div className="text-sm text-muted-foreground">Alger, Algérie</div></div></div>
          </div>
          <form onSubmit={onSubmit} className="md:col-span-2 space-y-4 p-6 rounded-lg border bg-card">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Nom complet</Label><Input required className="mt-1" /></div>
              <div><Label>Email</Label><Input type="email" required className="mt-1" /></div>
            </div>
            <div><Label>Sujet</Label><Input required className="mt-1" /></div>
            <div><Label>Message</Label><Textarea required rows={5} className="mt-1" /></div>
            <Button type="submit">Envoyer</Button>
          </form>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
