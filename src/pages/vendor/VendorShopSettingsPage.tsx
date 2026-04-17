import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WilayaSelect } from "@/components/common/WilayaSelect";
import { useState } from "react";

export default function VendorShopSettingsPage() {
  const [wilaya, setWilaya] = useState("");
  return (
    <DashboardLayout type="vendor" title="Paramètres boutique">
      <PageHeader title="Paramètres de la boutique" description="Informations légales et coordonnées" />
      <form className="bg-card rounded-lg border p-6 grid gap-4 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2">
          <Label>Nom de la boutique</Label>
          <Input placeholder="Artisan Cuir Alger" />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea rows={3} placeholder="Présentez votre boutique..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>RC</Label>
            <Input placeholder="16/00-1234567" />
          </div>
          <div className="grid gap-2">
            <Label>NIF</Label>
            <Input placeholder="000016001234567" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Wilaya</Label>
          <WilayaSelect value={wilaya} onChange={setWilaya} />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
