import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/permissions";

const modules = ["dashboard", "sales", "products", "clients", "stock", "payments", "reports", "users", "settings"];
const roles = ["super_admin", "admin", "manager", "vendeur", "caissier", "magasinier", "comptable", "viewer"] as const;

export default function AdminRolesPage() {
  return (
    <DashboardLayout type="admin" title="Rôles et permissions">
      <PageHeader title="Rôles & Permissions" description="Définir les droits d'accès par rôle." actions={<Button>Enregistrer</Button>} />
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              {roles.map(r => <TableHead key={r} className="text-center text-xs">{ROLE_LABELS[r] || r}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map(m => (
              <TableRow key={m}>
                <TableCell className="font-medium capitalize text-sm">{m}</TableCell>
                {roles.map(r => (
                  <TableCell key={r} className="text-center">
                    <Checkbox defaultChecked={r === "super_admin" || r === "admin" || (r === "vendeur" && ["dashboard", "products", "sales", "clients", "stock"].includes(m))} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
