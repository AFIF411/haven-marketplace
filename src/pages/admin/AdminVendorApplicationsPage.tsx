import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Store, Search, Check, X, RefreshCcw, ExternalLink, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ShopStatus = "pending" | "active" | "rejected" | "suspended";

interface ShopRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  wilaya: string | null;
  phone: string | null;
  email: string | null;
  status: ShopStatus;
  admin_note: string | null;
  created_at: string;
  owner_id: string;
  owner?: { first_name: string | null; last_name: string | null; email: string | null } | null;
}

export default function AdminVendorApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<ShopRow[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ShopStatus>("pending");
  const [dialog, setDialog] = useState<{ shop: ShopRow; action: "active" | "rejected" } | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shops")
      .select("id,name,slug,description,category,wilaya,phone,email,status,admin_note,created_at,owner_id")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erreur de chargement");
      setLoading(false);
      return;
    }
    const rows = (data || []) as ShopRow[];
    const ownerIds = Array.from(new Set(rows.map(r => r.owner_id)));
    if (ownerIds.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", ownerIds);
      const byId = new Map((profiles || []).map(p => [p.id, p]));
      rows.forEach(r => { r.owner = (byId.get(r.owner_id) as ShopRow["owner"]) || null; });
    }
    setShops(rows);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => ({
    pending: shops.filter(s => s.status === "pending").length,
    active: shops.filter(s => s.status === "active").length,
    rejected: shops.filter(s => s.status === "rejected").length,
    suspended: shops.filter(s => s.status === "suspended").length,
  }), [shops]);

  const filtered = useMemo(() => shops.filter(s => {
    if (s.status !== tab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q)
      || (s.wilaya || "").toLowerCase().includes(q)
      || (s.owner?.email || "").toLowerCase().includes(q);
  }), [shops, search, tab]);

  const openDialog = (shop: ShopRow, action: "active" | "rejected") => {
    setDialog({ shop, action });
    setNote(shop.admin_note || "");
  };

  const submit = async () => {
    if (!dialog) return;
    if (dialog.action === "rejected" && note.trim().length < 5) {
      toast.error("Merci de motiver le rejet (5 caractères min.)");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("shops")
      .update({ status: dialog.action, admin_note: note.trim() || null })
      .eq("id", dialog.shop.id);
    setSubmitting(false);
    if (error) { toast.error("Échec : " + error.message); return; }
    toast.success(dialog.action === "active" ? "Boutique approuvée" : "Demande rejetée");
    setDialog(null);
    setNote("");
    load();
  };

  const quickApprove = async (shop: ShopRow) => {
    const { error } = await supabase.from("shops").update({ status: "active" }).eq("id", shop.id);
    if (error) toast.error(error.message); else { toast.success("Approuvée"); load(); }
  };

  return (
    <DashboardLayout type="admin" title="Demandes vendeurs">
      <PageHeader
        title="Demandes vendeurs"
        description="Approuver ou rejeter les demandes d'ouverture de boutique"
        actions={
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCcw className="h-4 w-4 me-2" /> Actualiser
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ShopStatus)} className="mb-4">
        <TabsList>
          <TabsTrigger value="pending">En attente ({counts.pending})</TabsTrigger>
          <TabsTrigger value="active">Approuvées ({counts.active})</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées ({counts.rejected})</TabsTrigger>
          <TabsTrigger value="suspended">Suspendues ({counts.suspended})</TabsTrigger>
        </TabsList>

        <div className="bg-card rounded-lg border p-4 mt-4 mb-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par boutique, wilaya, email..."
              className="ps-9"
            />
          </div>
        </div>

        <TabsContent value={tab} className="mt-0">
          <div className="bg-card rounded-lg border overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Store className="h-10 w-10" />}
                title="Aucune demande"
                description="Aucune boutique dans cet état pour le moment."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Boutique</TableHead>
                    <TableHead>Propriétaire</TableHead>
                    <TableHead>Wilaya</TableHead>
                    <TableHead>Demandée le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.category || "—"}</div>
                        {s.admin_note && (
                          <div className="text-xs mt-1 text-muted-foreground flex items-start gap-1">
                            <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{s.admin_note}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {s.owner?.first_name || s.owner?.last_name
                            ? `${s.owner?.first_name || ""} ${s.owner?.last_name || ""}`.trim()
                            : "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">{s.owner?.email || s.email || "—"}</div>
                      </TableCell>
                      <TableCell>{s.wilaya || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell><StatusBadge kind="shop" status={s.status} /></TableCell>
                      <TableCell className="text-end">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild size="sm" variant="ghost" title="Voir la boutique">
                            <Link to={`/shop/${s.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          {s.status === "pending" && (
                            <>
                              <Button size="sm" variant="ghost" title="Approbation rapide" onClick={() => quickApprove(s)}>
                                <Check className="h-4 w-4 text-success" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => openDialog(s, "active")}>
                                Approuver
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => openDialog(s, "rejected")}>
                                Rejeter
                              </Button>
                            </>
                          )}
                          {s.status === "rejected" && (
                            <Button size="sm" variant="outline" onClick={() => openDialog(s, "active")}>
                              <Check className="h-4 w-4 me-1" /> Réactiver
                            </Button>
                          )}
                          {s.status === "active" && (
                            <Button size="sm" variant="outline" onClick={() => openDialog(s, "rejected")}>
                              <X className="h-4 w-4 me-1" /> Révoquer
                            </Button>
                          )}
                          {s.status === "suspended" && (
                            <Button size="sm" variant="outline" onClick={() => openDialog(s, "active")}>
                              Réactiver
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
        </TabsContent>
      </Tabs>

      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog?.action === "active" ? "Approuver la boutique" : "Rejeter la demande"}
            </DialogTitle>
            <DialogDescription>
              {dialog?.shop.name} — {dialog?.shop.wilaya || "Wilaya non renseignée"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Commentaire {dialog?.action === "rejected" ? "(obligatoire)" : "(optionnel)"}
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                dialog?.action === "rejected"
                  ? "Expliquez pourquoi la demande est rejetée (visible par le vendeur)"
                  : "Message de bienvenue ou consignes (optionnel)"
              }
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-end">{note.length}/500</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>Annuler</Button>
            <Button
              variant={dialog?.action === "rejected" ? "destructive" : "default"}
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? "Envoi..." : dialog?.action === "active" ? "Approuver" : "Rejeter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
