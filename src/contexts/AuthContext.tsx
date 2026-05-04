import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
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
  supabaseUser: SupabaseUser | null;
  roles: AppRole[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (module: Module, action: Action) => boolean;
  canAccess: (module: Module) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseUser(su: SupabaseUser, profile?: { status?: string }): User {
  const meta = su.user_metadata || {};
  return {
    id: su.id,
    firstName: meta.first_name || meta.firstName || "",
    lastName: meta.last_name || meta.lastName || "",
    email: su.email || "",
    phone: meta.phone || "",
    status: profile?.status || "active",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les rôles depuis la DB
  const fetchRoles = useCallback(async (userId: string) => {
    const { data } = await supabase.rpc('get_user_roles', { _user_id: userId });
    if (data && Array.isArray(data)) {
      setRoles(data as AppRole[]);
    } else {
      setRoles([]);
    }
  }, []);

  // Charger le profil
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('status')
      .eq('user_id', userId)
      .single();
    return data;
  }, []);

  const setupUser = useCallback(async (su: SupabaseUser) => {
    setSupabaseUser(su);
    const profile = await fetchProfile(su.id);
    setUser(parseUser(su, profile || undefined));
    await fetchRoles(su.id);
  }, [fetchProfile, fetchRoles]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await setupUser(session.user);
      } else {
        setSupabaseUser(null);
        setUser(null);
        setRoles([]);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await setupUser(session.user);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setupUser]);

  // Synchronisation temps réel des rôles : si un admin modifie les rôles
  // de l'utilisateur courant, le frontend les recharge automatiquement.
  useEffect(() => {
    if (!supabaseUser?.id) return;
    const userId = supabaseUser.id;

    const channel = supabase
      .channel(`user_roles:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_roles', filter: `user_id=eq.${userId}` },
        () => { fetchRoles(userId); }
      )
      .subscribe();

    // Re-sync à chaque retour d'onglet et toutes les 60s en filet de sécurité
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchRoles(userId);
    };
    document.addEventListener('visibilitychange', onVisibility);
    const interval = window.setInterval(() => fetchRoles(userId), 60_000);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(interval);
    };
  }, [supabaseUser?.id, fetchRoles]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setRoles([]);
  };

  const hasPermissionFn = useCallback((module: Module, action: Action) => {
    return checkPermission(roles, module, action);
  }, [roles]);

  const canAccess = useCallback((module: Module) => {
    return checkModule(roles, module);
  }, [roles]);

  const refreshRoles = useCallback(async () => {
    if (user) await fetchRoles(user.id);
  }, [user, fetchRoles]);

  const isAdmin = roles.includes('admin') || roles.includes('super_admin');
  const isSuperAdmin = roles.includes('super_admin');

  return (
    <AuthContext.Provider value={{
      user, supabaseUser, roles, isLoading,
      login, register, logout,
      hasPermission: hasPermissionFn, canAccess,
      isAdmin, isSuperAdmin, refreshRoles,
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
