import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "soukdz_user";
const ACCOUNTS_KEY = "soukdz_accounts";

function getAccounts(): Record<string, { user: User; password: string }> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch { return {}; }
}

function saveAccounts(accounts: Record<string, { user: User; password: string }>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    const accounts = getAccounts();
    const account = accounts[email.toLowerCase()];
    if (!account) return { success: false, error: "Aucun compte trouvé avec cet email" };
    if (account.password !== password) return { success: false, error: "Mot de passe incorrect" };
    setUser(account.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    return { success: true };
  };

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    await new Promise(r => setTimeout(r, 600));
    const accounts = getAccounts();
    const key = data.email.toLowerCase();
    if (accounts[key]) return { success: false, error: "Un compte existe déjà avec cet email" };
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    };
    accounts[key] = { user: newUser, password: data.password };
    saveAccounts(accounts);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
