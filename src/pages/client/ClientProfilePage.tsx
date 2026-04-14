import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";

export default function ClientProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout type="client" title={t("sidebar.myAccount")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("client.myProfile")}</h1>
      <div className="bg-card rounded-lg border p-6 max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="font-heading font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
          <div><label className="text-sm font-medium mb-1 block">{t("client.firstName")}</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue={user.firstName} /></div>
          <div><label className="text-sm font-medium mb-1 block">{t("client.lastName")}</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue={user.lastName} /></div>
          <div><label className="text-sm font-medium mb-1 block">{t("client.email")}</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue={user.email} /></div>
          <div><label className="text-sm font-medium mb-1 block">{t("client.phone")}</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue={user.phone} /></div>
        </div>
        <Button>{t("common.save")}</Button>
      </div>
    </DashboardLayout>
  );
}
