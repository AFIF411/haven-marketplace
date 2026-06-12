import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { ArrowLeft, CheckCircle2, Circle, Package, Truck, Home } from "lucide-react";

const steps = [
  { icon: CheckCircle2, label: "Commande confirmée", date: "10 juin, 14:30", done: true },
  { icon: Package, label: "En préparation", date: "11 juin, 09:00", done: true },
  { icon: Truck, label: "En cours de livraison", date: "12 juin, 08:15", done: true, current: true },
  { icon: Home, label: "Livré", date: "—", done: false },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  return (
    <DashboardLayout type="client" title="Suivi de livraison">
      <div className="max-w-2xl">
        <Link to={`/account/orders/${id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 me-1" /> Retour à la commande
        </Link>
        <h1 className="font-heading text-2xl font-bold">Suivi de livraison</h1>
        <p className="text-sm text-muted-foreground mt-1">Commande #{id} • N° colis : YL-{id}-DZ</p>

        <div className="mt-8 p-6 rounded-lg border bg-card">
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {s.done ? (
                    <s.icon className={`h-6 w-6 ${s.current ? "text-primary" : "text-primary/70"}`} />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground/30" />
                  )}
                  {i < steps.length - 1 && <div className={`w-px h-12 mt-1 ${s.done ? "bg-primary/40" : "bg-border"}`} />}
                </div>
                <div className="pb-4">
                  <div className={`font-medium text-sm ${s.done ? "" : "text-muted-foreground"}`}>{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border bg-card text-sm">
          <div className="font-medium">Société de livraison</div>
          <div className="text-muted-foreground mt-1">Yalidine Express — +213 770 00 00 00</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
