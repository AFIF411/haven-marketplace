// ============================================================
// authService — façade frontend pour l'authentification.
//
// Endpoints Spring Boot attendus (Spring Security + JWT) :
//   POST /api/auth/login             body: { email, password }    -> { token, user }
//   POST /api/auth/register          body: RegisterDto            -> { token, user }
//   POST /api/auth/logout            (révoque le token côté serveur, facultatif)
//   POST /api/auth/forgot-password   body: { email }
//   POST /api/auth/reset-password    body: { token, newPassword }
//   POST /api/auth/verify-email      body: { token }
//   GET  /api/auth/me                                              -> User
//
// En mode mock, login/register/logout sont délégués à AuthContext
// (localStorage). Les mots de passe oubliés/vérifications ne sont
// pas branchés en mock — elles renverront simplement un succès simulé.
// ============================================================

import { http, USE_MOCK } from "@/lib/api/http";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/**
 * NB : en mode mock, l'écran de login utilise directement
 * useAuth().login / register (localStorage). Ces méthodes sont
 * prévues pour le futur — elles posent les contrats Spring Boot.
 */
export const authService = {
  async login(payload: LoginDto): Promise<AuthResponse> {
    if (USE_MOCK) throw new Error("Mode mock — utilise useAuth().login(email, password)");
    const res = await http.post<AuthResponse>("/auth/login", payload, { skipAuth: true });
    if (res?.token) http.setToken(res.token);
    return res;
  },

  async register(payload: RegisterDto): Promise<AuthResponse> {
    if (USE_MOCK) throw new Error("Mode mock — utilise useAuth().register(...)");
    const res = await http.post<AuthResponse>("/auth/register", payload, { skipAuth: true });
    if (res?.token) http.setToken(res.token);
    return res;
  },

  async logout(): Promise<void> {
    http.clearToken();
    if (USE_MOCK) return;
    try { await http.post<void>("/auth/logout"); } catch { /* idempotent */ }
  },

  async me(): Promise<AuthUser> {
    if (USE_MOCK) throw new Error("Mode mock — utilise useAuth().user");
    return http.get<AuthUser>("/auth/me");
  },

  async forgotPassword(email: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      return { success: true };
    }
    return http.post<{ success: boolean }>("/auth/forgot-password", { email }, { skipAuth: true });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      return { success: true };
    }
    return http.post<{ success: boolean }>("/auth/reset-password", { token, newPassword }, { skipAuth: true });
  },

  async verifyEmail(token: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      return { success: true };
    }
    return http.post<{ success: boolean }>("/auth/verify-email", { token }, { skipAuth: true });
  },

  async resendVerification(email: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      return { success: true };
    }
    return http.post<{ success: boolean }>("/auth/resend-verification", { email }, { skipAuth: true });
  },
};
