import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";
import { toast } from "@/hooks/use-toast";

export default function ClientProfilePage() {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();

  if (!user) return <Navigate to="/login" replace />;

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({ firstName, lastName, email, phone });
    setSaving(false);
    if (res.success) toast({ title: "Profil mis à jour" });
    else toast({ title: "Erreur", description: res.error, variant: "destructive" });
  };

  return (
    <DashboardLayout type="client" title={t("sidebar.myAccount")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("client.myProfile")}</h1>
      <form onSubmit={onSubmit} className="bg-card rounded-lg border p-6 max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="font-heading font-semibold">{firstName} {lastName}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium mb-1 block">{t("client.firstName")}</label>
            <Input id="firstName" required value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-medium mb-1 block">{t("client.lastName")}</label>
            <Input id="lastName" required value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium mb-1 block">{t("client.email")}</label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium mb-1 block">{t("client.phone")}</label>
            <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : t("common.save")}</Button>
      </form>
    </DashboardLayout>
  );
}
