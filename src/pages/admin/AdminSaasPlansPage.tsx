import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";

const plans = [
  { name: "Starter", price: 0, vendors: 245, products: 10, commission: "8%" },
  { name: "Pro", price: 2500, vendors: 128, products: 200, commission: "5%" },
  { name: "Business", price: 7500, vendors: 32, products: "Illimité", commission: "3%" },
];

export default function AdminSaasPlansPage() {
  return (
    <DashboardLayout type="admin" title="Plans SaaS">
      <PageHeader title="Plans d'abonnement" description="Gestion des plans pour les vendeurs." actions={<Button><Plus className="h-4 w-4 me-2" />Nouveau plan</Button>} />
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(p => (
          <Card key={p.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{p.name}</CardTitle>
                <Badge variant="outline">{p.vendors} vendeurs</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{p.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">DA/mois</span></div>
              <dl className="text-sm space-y-2 mt-4">
                <div className="flex justify-between"><dt className="text-muted-foreground">Produits max</dt><dd>{p.products}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Commission</dt><dd>{p.commission}</dd></div>
              </dl>
              <Button variant="outline" size="sm" className="w-full mt-4"><Edit className="h-4 w-4 me-2" />Modifier</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
