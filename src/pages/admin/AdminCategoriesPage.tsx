import { Fragment } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategories, categoriesApi } from "@/hooks/useMarketplace";
import { FolderTree, Plus, Trash2, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { data: categories, loading, reload } = useCategories();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", parentId: "none" });

  const tree = useMemo(() => {
    const list = categories || [];
    const roots = list.filter(c => !c.parentId);
    return roots.map(r => ({ ...r, children: list.filter(c => c.parentId === r.id) }));
  }, [categories]);

  const handleCreate = async () => {
    if (!form.name) return toast.error("Nom requis");
    await categoriesApi.create({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      icon: form.icon || undefined,
      parentId: form.parentId === "none" ? null : form.parentId,
    });
    toast.success("Catégorie créée");
    setForm({ name: "", slug: "", icon: "", parentId: "none" });
    setOpen(false);
    reload();
  };

  const handleDelete = async (id: string) => {
    await categoriesApi.remove(id);
    toast.success("Catégorie supprimée");
    reload();
  };

  return (
    <DashboardLayout type="admin" title="Catégories">
      <PageHeader
        title="Catégories"
        description="Gérer l'arborescence des catégories de la marketplace"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-2" />Nouvelle catégorie</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle catégorie</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2"><Label>Nom</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Électronique" /></div>
                <div className="grid gap-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="electronique" /></div>
                <div className="grid gap-2"><Label>Icône (emoji)</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="💻" /></div>
                <div className="grid gap-2">
                  <Label>Catégorie parent</Label>
                  <Select value={form.parentId} onValueChange={v => setForm({ ...form, parentId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune (racine)</SelectItem>
                      {(categories || []).filter(c => !c.parentId).map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={handleCreate}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Chargement...</div>
        ) : tree.length === 0 ? (
          <EmptyState icon={<FolderTree className="h-10 w-10" />} title="Aucune catégorie" description="Créez votre première catégorie." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Sous-catégories</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tree.map(c => (
                <Fragment key={c.id}>
                  <TableRow>
                    <TableCell><span className="me-2">{c.icon}</span>{c.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.slug}</TableCell>
                    <TableCell>{c.children.length}</TableCell>
                    <TableCell>{c.productsCount ?? 0}</TableCell>
                    <TableCell className="text-end">
                      <Button size="sm" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                  {c.children.map(child => (
                    <TableRow key={child.id} className="bg-muted/30">
                      <TableCell className="ps-10 text-sm">↳ {child.icon} {child.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{child.slug}</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>{child.productsCount ?? 0}</TableCell>
                      <TableCell className="text-end">
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(child.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
