// ============================================================
// Mapping centralisé routes → permissions / rôles
// Source unique pour ProtectedRoute et navigation conditionnelle.
// ============================================================

import type { Module, Action, AppRole } from "@/lib/permissions";

export interface RouteGuard {
  path: string;
  module?: Module;
  action?: Action;
  roles?: AppRole[];
}

export const PROTECTED_ROUTES: RouteGuard[] = [
  // Espace gestion (ERP)
  { path: "/manage", module: "dashboard" },
  { path: "/manage/sales", module: "sales" },
  { path: "/manage/products", module: "products" },
  { path: "/manage/products/new", module: "products", action: "add" },
  { path: "/manage/products/edit", module: "products", action: "edit" },
  { path: "/manage/clients", module: "clients" },
  { path: "/manage/stock", module: "stock" },
  { path: "/manage/payments", module: "payments" },
  { path: "/manage/reports", module: "reports" },
  { path: "/manage/settings", module: "settings" },
  { path: "/manage/users", module: "users" },

  // Vendor (espace boutique marketplace)
  { path: "/vendor", roles: ["super_admin", "admin", "vendeur", "manager"] },
  { path: "/vendor/orders/:id", roles: ["super_admin", "admin", "vendeur", "manager"] },
  { path: "/vendor/promotions", roles: ["super_admin", "admin", "vendeur"] },
  { path: "/vendor/reviews", roles: ["super_admin", "admin", "vendeur"] },
  { path: "/vendor/analytics", roles: ["super_admin", "admin", "vendeur", "manager"] },
  { path: "/vendor/settings", roles: ["super_admin", "admin", "vendeur"] },
  { path: "/vendor/page-builder", roles: ["super_admin", "admin", "vendeur"] },

  // Admin
  { path: "/admin", roles: ["super_admin", "admin"] },
  { path: "/admin/categories", roles: ["super_admin", "admin"] },
  { path: "/admin/shops", roles: ["super_admin", "admin"] },
  { path: "/admin/promotions", roles: ["super_admin", "admin"] },
  { path: "/admin/reviews", roles: ["super_admin", "admin"] },
  { path: "/admin/reports", roles: ["super_admin", "admin"] },
  { path: "/admin/settings", roles: ["super_admin"] },

  // Client
  { path: "/account", roles: ["client", "viewer"] },
  { path: "/wishlist", roles: ["client", "viewer"] },
];

/** Détermine la route d'accueil par défaut selon le premier rôle de l'utilisateur. */
export function defaultHomeForRole(roles: AppRole[]): string {
  if (roles.includes("super_admin") || roles.includes("admin")) return "/admin";
  if (roles.includes("vendeur") || roles.includes("manager")) return "/vendor";
  if (roles.includes("client")) return "/account";
  if (roles.includes("caissier") || roles.includes("magasinier") || roles.includes("comptable") || roles.includes("viewer")) return "/manage";
  return "/account";
}
