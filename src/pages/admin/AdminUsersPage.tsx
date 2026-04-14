import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const users = [
  { id: 1, name: "Mohamed Benali", email: "mohamed@email.com", role: "client", joined: "15/12/2023", orders: 12 },
  { id: 2, name: "Amina Khelifi", email: "amina@email.com", role: "client", joined: "20/11/2023", orders: 8 },
  { id: 3, name: "Yacine Mansouri", email: "yacine@email.com", role: "vendor", joined: "01/10/2023", orders: 0 },
  { id: 4, name: "Fatima Rahmani", email: "fatima@email.com", role: "client", joined: "15/09/2023", orders: 23 },
  { id: 5, name: "Karim Derradji", email: "karim@email.com", role: "vendor", joined: "01/08/2023", orders: 0 },
];

export default function AdminUsersPage() {
  return (
    <DashboardLayout type="admin" title="Administration">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Utilisateurs</h1>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 pl-10 pr-3 rounded-md border bg-background text-sm" placeholder="Rechercher..." />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {["Tous", "Clients", "Vendeurs", "Admins"].map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium">Utilisateur</th>
            <th className="text-left px-4 py-2.5 font-medium">Email</th>
            <th className="text-left px-4 py-2.5 font-medium">Rôle</th>
            <th className="text-left px-4 py-2.5 font-medium">Inscrit le</th>
            <th className="text-left px-4 py-2.5 font-medium">Commandes</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><Badge variant={u.role === 'vendor' ? 'default' : 'secondary'}>{u.role === 'vendor' ? 'Vendeur' : 'Client'}</Badge></td>
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
