import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useShops, shopsApi } from "@/hooks/useMarketplace";
import { Store, Search, Check, Ban, ExternalLink, BadgeCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { ShopStatus } from "@/types/marketplace";

export default function AdminShopsPage() {
  const { data: shops, loading, reload } = useShops();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return (shops || []).filter(s => {
      if (status !== "all" && s.status !== status) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [shops, search, status]);

  const handleStatus = async (id: string, newStatus: ShopStatus) => {
    await shopsApi.setStatus(id, newStatus);
    toast.success(`Boutique mise à jour : ${newStatus}`);
    reload();
  };

  return (
    <DashboardLayout type="admin" title="Boutiques">
      <PageHeader title="Boutiques" description="Validation, suspension et modération des boutiques vendeurs" />

      <div className="bg-card rounded-lg border p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une boutique..." className="ps-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="active">Actives</SelectItem>
            <SelectItem value="suspended">Suspendues</SelectItem>
            <SelectItem value="rejected">Rejetées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Store className="h-10 w-10" />} title="Aucune boutique" description="Aucun résultat pour ces filtres." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Boutique</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {s.logoUrl && <img src={s.logoUrl} alt="" className="h-9 w-9 rounded object-cover" />}
                      <div>
                        <div className="font-medium flex items-center gap-1.5">
                          {s.name}
                          {s.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{s.category}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{s.wilaya || "—"}</TableCell>
                  <TableCell>{s.productsCount}</TableCell>
                  <TableCell>{s.rating.toFixed(1)} ★</TableCell>
                  <TableCell><StatusBadge kind="shop" status={s.status} /></TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild size="sm" variant="ghost"><Link to={`/shop/${s.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link></Button>
                      {s.status !== "active" && (
                        <Button size="sm" variant="ghost" onClick={() => handleStatus(s.id, "active")} title="Approuver">
                          <Check className="h-4 w-4 text-success" />
                        </Button>
                      )}
                      {s.status !== "suspended" && (
                        <Button size="sm" variant="ghost" onClick={() => handleStatus(s.id, "suspended")} title="Suspendre">
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
