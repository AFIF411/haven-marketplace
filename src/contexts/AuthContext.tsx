// ============================================================
// Contexte d'authentification — branché sur Lovable Cloud.
// Conserve l'interface utilisée partout dans l'app
// (login/register/logout/roles/hasPermission/updateProfile).
// ============================================================
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, Module, Action, hasPermission as checkPermission, canAccessModule as checkModule } from "@/lib/permissions";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupaUser | null;
  roles: AppRole[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (module: Module, action: Action) => boolean;
  canAccess: (module: Module) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  refreshRoles: () => Promise<void>;
  setRoles: (roles: AppRole[]) => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "firstName" | "lastName" | "email" | "phone">>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function loadProfile(supaUser: SupaUser): Promise<{ user: User; roles: AppRole[] }> {
  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", supaUser.id).maybeSingle();
  const { data: roleRows } = await supabase
    .from("user_roles").select("role").eq("user_id", supaUser.id);

  const roles = (roleRows ?? []).map(r => r.role as AppRole);
  const user: User = {
    id: supaUser.id,
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    email: profile?.email ?? supaUser.email ?? "",
    phone: profile?.phone ?? "",
    status: "active",
  };
  return { user, roles };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupaUser | null>(null);
  const [roles, setRolesState] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener d'abord, puis chargement initial
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setSupabaseUser(u);
      if (u) {
        // Déférer pour ne pas bloquer le callback
        setTimeout(() => {
          loadProfile(u).then(({ user, roles }) => { setUser(user); setRolesState(roles); });
        }, 0);
      } else {
        setUser(null); setRolesState([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setSupabaseUser(u);
      if (u) loadProfile(u).then(({ user, roles }) => { setUser(user); setRolesState(roles); }).finally(() => setIsLoading(false));
      else setIsLoading(false);
    });

    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const register = useCallback(async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { first_name: data.firstName, last_name: data.lastName, phone: data.phone },
      },
    });
    if (error) return { success: false, error: error.message };
    // Met à jour téléphone dans le profil (trigger n'inclut pas le phone)
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null); setRolesState([]); setSupabaseUser(null);
  }, []);

  const refreshRoles = useCallback(async () => {
    if (!supabaseUser) return;
    const { user, roles } = await loadProfile(supabaseUser);
    setUser(user); setRolesState(roles);
  }, [supabaseUser]);

  const setRoles = useCallback(async (newRoles: AppRole[]) => {
    if (!supabaseUser) return;
    await supabase.from("user_roles").delete().eq("user_id", supabaseUser.id);
    if (newRoles.length > 0) {
      await supabase.from("user_roles").insert(newRoles.map(r => ({ user_id: supabaseUser.id, role: r })));
    }
    setRolesState(newRoles);
  }, [supabaseUser]);

  const updateProfile = useCallback(async (patch: Partial<Pick<User, "firstName" | "lastName" | "email" | "phone">>) => {
    if (!supabaseUser || !user) return { success: false, error: "Non connecté" };
    const dbPatch: Record<string, unknown> = {};
    if (patch.firstName !== undefined) dbPatch.first_name = patch.firstName;
    if (patch.lastName !== undefined) dbPatch.last_name = patch.lastName;
    if (patch.email !== undefined) dbPatch.email = patch.email;
    if (patch.phone !== undefined) dbPatch.phone = patch.phone;
    const { error } = await supabase.from("profiles").update(dbPatch).eq("id", supabaseUser.id);
    if (error) return { success: false, error: error.message };
    setUser({ ...user, ...patch });
    return { success: true };
  }, [supabaseUser, user]);

  const hasPermissionFn = useCallback((module: Module, action: Action) =>
    checkPermission(roles, module, action), [roles]);
  const canAccess = useCallback((module: Module) =>
    checkModule(roles, module), [roles]);

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");

  return (
    <AuthContext.Provider value={{
      user, supabaseUser, roles, isLoading,
      login, register, logout,
      hasPermission: hasPermissionFn, canAccess,
      isAdmin, isSuperAdmin, refreshRoles, setRoles, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
