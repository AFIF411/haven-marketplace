import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

const users = [
  { id: 1, name: "Mohamed Benali", email: "mohamed@email.com", role: "client", joined: "15/12/2023", orders: 12 },
  { id: 2, name: "Amina Khelifi", email: "amina@email.com", role: "client", joined: "20/11/2023", orders: 8 },
  { id: 3, name: "Yacine Mansouri", email: "yacine@email.com", role: "vendor", joined: "01/10/2023", orders: 0 },
  { id: 4, name: "Fatima Rahmani", email: "fatima@email.com", role: "client", joined: "15/09/2023", orders: 23 },
  { id: 5, name: "Karim Derradji", email: "karim@email.com", role: "vendor", joined: "01/08/2023", orders: 0 },
];

export default function AdminUsersPage() {
  const { t } = useTranslation();

  const filters = [t("filter.allM"), t("filter.clients"), t("filter.vendors"), t("filter.admins")];

  return (
    <DashboardLayout type="admin" title={t("sidebar.administration")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">{t("admin.users")}</h1>
        <div className="relative w-56">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder={t("filter.search")} />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {filters.map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-start px-4 py-2.5 font-medium">{t("table.user")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("client.email")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.role")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.joined")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("client.orders")}</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><Badge variant={u.role === 'vendor' ? 'default' : 'secondary'}>{u.role === 'vendor' ? t("admin.vendor") : t("admin.client")}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                <td className="px-4 py-3">{u.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
