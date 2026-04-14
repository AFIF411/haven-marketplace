import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, Shield, Loader2, UserX, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_ROLES, ROLE_LABELS, ROLE_COLORS, AppRole } from "@/lib/permissions";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  user_id: string;
  display_name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  email?: string;
  roles: AppRole[];
}

export default function AdminUsersPage() {
  const { isSuperAdmin, isAdmin, hasPermission } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // État pour le dialog d'attribution de rôle
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [saving, setSaving] = useState(false);

  const canEdit = hasPermission('users', 'edit');
  const canDelete = hasPermission('users', 'delete');

  const fetchUsers = async () => {
    setLoading(true);
    // Récupérer profils
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profiles) { setLoading(false); return; }

    // Récupérer rôles
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('*');

    const roleMap = new Map<string, AppRole[]>();
    rolesData?.forEach((r: any) => {
      const existing = roleMap.get(r.user_id) || [];
      existing.push(r.role as AppRole);
      roleMap.set(r.user_id, existing);
    });

    const userList: UserProfile[] = profiles.map((p: any) => ({
      user_id: p.user_id,
      display_name: p.display_name,
      phone: p.phone,
      status: p.status,
      created_at: p.created_at,
      roles: roleMap.get(p.user_id) || [],
    }));

    setUsers(userList);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Filtrer
  const filtered = users.filter(u => {
    const matchSearch = !search || 
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.user_id.includes(search);
    const matchRole = filterRole === "all" || u.roles.includes(filterRole as AppRole);
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // Ouvrir dialog de rôle
  const openRoleDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedRoles([...user.roles]);
    setRoleDialogOpen(true);
  };

  // Sauvegarder les rôles
  const saveRoles = async () => {
    if (!selectedUser) return;
    setSaving(true);

    // Supprimer les anciens rôles
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', selectedUser.user_id);

    // Ajouter les nouveaux
    if (selectedRoles.length > 0) {
      const rows = selectedRoles.map(role => ({
        user_id: selectedUser.user_id,
        role,
      }));
      await supabase.from('user_roles').insert(rows);
    }

    toast({ title: "Rôles mis à jour", description: `Les rôles de ${selectedUser.display_name || 'l\'utilisateur'} ont été modifiés.` });
    setSaving(false);
    setRoleDialogOpen(false);
    fetchUsers();
  };

  // Changer le statut
  const toggleStatus = async (user: UserProfile, newStatus: string) => {
    await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('user_id', user.user_id);

    toast({ title: "Statut mis à jour", description: `Utilisateur ${newStatus === 'active' ? 'activé' : newStatus === 'suspended' ? 'suspendu' : 'désactivé'}.` });
    fetchUsers();
  };

  const toggleRole = (role: AppRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    suspended: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    active: "Actif",
    inactive: "Inactif",
    suspended: "Suspendu",
  };

  return (
    <DashboardLayout type="manage" title="Gestion des utilisateurs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl font-bold">Utilisateurs</h1>
            <p className="text-sm text-muted-foreground">{users.length} utilisateur(s) enregistré(s)</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" 
              placeholder="Rechercher..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <select 
            className="h-9 px-3 rounded-md border bg-background text-sm"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            <option value="none">Sans rôle</option>
          </select>
          <select 
            className="h-9 px-3 rounded-md border bg-background text-sm"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="text-start px-4 py-2.5 font-medium">Utilisateur</th>
                    <th className="text-start px-4 py-2.5 font-medium">Rôle(s)</th>
                    <th className="text-start px-4 py-2.5 font-medium">Statut</th>
                    <th className="text-start px-4 py-2.5 font-medium">Inscrit le</th>
                    {canEdit && <th className="text-start px-4 py-2.5 font-medium">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Aucun utilisateur trouvé</td></tr>
                  ) : filtered.map(u => (
                    <tr key={u.user_id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.display_name || "Sans nom"}</div>
                        <div className="text-xs text-muted-foreground">{u.phone || ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.length === 0 ? (
                            <span className="text-xs text-muted-foreground">Aucun rôle</span>
                          ) : u.roles.map(r => (
                            <span key={r} className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_COLORS[r]}`}>
                              {ROLE_LABELS[r]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[u.status] || statusColors.inactive}`}>
                          {statusLabels[u.status] || u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      {canEdit && (
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openRoleDialog(u)} title="Gérer les rôles">
                              <Shield className="h-3.5 w-3.5" />
                            </Button>
                            {u.status === 'active' ? (
                              <Button size="sm" variant="ghost" onClick={() => toggleStatus(u, 'suspended')} title="Suspendre">
                                <UserX className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => toggleStatus(u, 'active')} title="Activer">
                                <UserCheck className="h-3.5 w-3.5 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Dialog attribution de rôle */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer les rôles — {selectedUser?.display_name || "Utilisateur"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <p className="text-sm text-muted-foreground">Sélectionnez un ou plusieurs rôles :</p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_ROLES.map(role => (
                <label 
                  key={role} 
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRoles.includes(role) ? 'border-primary bg-primary/5' : 'hover:border-primary/30'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedRoles.includes(role)} 
                    onChange={() => toggleRole(role)}
                    className="rounded"
                  />
                  <div>
                    <div className="text-sm font-medium">{ROLE_LABELS[role]}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t">
              <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Annuler</Button>
              <Button onClick={saveRoles} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : null}
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
