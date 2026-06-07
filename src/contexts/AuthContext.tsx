// ============================================================
// Auth mock localStorage — aucun backend requis.
// Interface identique à l'ancienne version (Supabase) :
// le reste de l'app fonctionne sans modification.
// Pour brancher Spring Boot plus tard, remplacer les fonctions
// login/register/logout/fetchRoles par des appels fetch().
// ============================================================
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { AppRole, Module, Action, hasPermission as checkPermission, canAccessModule as checkModule } from "@/lib/permissions";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

interface StoredUser extends User {
  password: string;
  roles: AppRole[];
}

interface AuthContextType {
  user: User | null;
  supabaseUser: null;
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
  /** Mock-only : changer les rôles de l'utilisateur courant (utile en démo). */
  setRoles: (roles: AppRole[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "souk_mock_users";
const SESSION_KEY = "souk_mock_session";

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function readSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}
function writeSession(userId: string | null) {
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
}

/** Compte de démo super_admin créé au premier lancement. */
function seedDefaultUsers() {
  const users = readUsers();
  if (users.length > 0) return;
  const demo: StoredUser[] = [
    {
      id: "demo-admin", firstName: "Admin", lastName: "Souk", email: "admin@souk.dz",
      phone: "+213500000000", password: "admin123", status: "active",
      roles: ["super_admin"],
    },
    {
      id: "demo-vendeur", firstName: "Karim", lastName: "Vendeur", email: "vendeur@souk.dz",
      phone: "+213600000000", password: "vendeur123", status: "active",
      roles: ["vendeur"],
    },
    {
      id: "demo-client", firstName: "Amina", lastName: "Client", email: "client@souk.dz",
      phone: "+213700000000", password: "client123", status: "active",
      roles: ["viewer"],
    },
  ];
  writeUsers(demo);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRolesState] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedDefaultUsers();
    const sid = readSession();
    if (sid) {
      const u = readUsers().find(x => x.id === sid);
      if (u) {
        const { password: _pw, roles: r, ...rest } = u;
        setUser(rest);
        setRolesState(r);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = readUsers();
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { success: false, error: "Compte introuvable" };
    if (u.password !== password) return { success: false, error: "Mot de passe incorrect" };
    const { password: _pw, roles: r, ...rest } = u;
    writeSession(u.id);
    setUser(rest);
    setRolesState(r);
    return { success: true };
  };

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const users = readUsers();
    if (users.some(x => x.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "Email déjà utilisé" };
    }
    const newUser: StoredUser = {
      id: `u-${Date.now()}`,
      firstName: data.firstName, lastName: data.lastName,
      email: data.email, phone: data.phone, password: data.password,
      status: "active",
      roles: ["viewer"],
    };
    users.push(newUser);
    writeUsers(users);
    writeSession(newUser.id);
    const { password: _pw, roles: r, ...rest } = newUser;
    setUser(rest);
    setRolesState(r);
    return { success: true };
  };

  const logout = async () => {
    writeSession(null);
    setUser(null);
    setRolesState([]);
  };

  const setRoles = useCallback((newRoles: AppRole[]) => {
    if (!user) return;
    const users = readUsers();
    const u = users.find(x => x.id === user.id);
    if (u) { u.roles = newRoles; writeUsers(users); }
    setRolesState(newRoles);
  }, [user]);

  const hasPermissionFn = useCallback((module: Module, action: Action) => {
    return checkPermission(roles, module, action);
  }, [roles]);

  const canAccess = useCallback((module: Module) => {
    return checkModule(roles, module);
  }, [roles]);

  const refreshRoles = useCallback(async () => {
    if (!user) return;
    const u = readUsers().find(x => x.id === user.id);
    if (u) setRolesState(u.roles);
  }, [user]);

  const isAdmin = roles.includes('admin') || roles.includes('super_admin');
  const isSuperAdmin = roles.includes('super_admin');

  return (
    <AuthContext.Provider value={{
      user, supabaseUser: null, roles, isLoading,
      login, register, logout,
      hasPermission: hasPermissionFn, canAccess,
      isAdmin, isSuperAdmin, refreshRoles, setRoles,
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
