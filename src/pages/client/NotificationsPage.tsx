import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Bell, Package, Tag, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const notifications = [
  { icon: Truck, title: "Votre commande #1245 est en cours de livraison", time: "Il y a 2h", unread: true, type: "Livraison" },
  { icon: Tag, title: "-20% sur la boutique Artisan Kabyle", time: "Il y a 5h", unread: true, type: "Promo" },
  { icon: Package, title: "Commande #1240 livrée avec succès", time: "Hier", unread: false, type: "Livraison" },
  { icon: Bell, title: "Nouveau message du vendeur", time: "Il y a 2 jours", unread: false, type: "Message" },
];

export default function NotificationsPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-8 max-w-2xl">
        <h1 className="font-heading text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Restez informé de l'évolution de vos commandes et des offres.</p>

        <div className="mt-6 rounded-lg border bg-card divide-y">
          {notifications.map((n, i) => (
            <div key={i} className={`p-4 flex gap-3 ${n.unread ? "bg-primary/5" : ""}`}>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <n.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{n.type}</Badge>
                  {n.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div className="text-sm mt-1">{n.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
