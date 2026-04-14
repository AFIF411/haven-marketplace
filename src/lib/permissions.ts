// ========================================
// Système de permissions & rôles — Souk DZ
// ========================================

export type AppRole = 'super_admin' | 'admin' | 'manager' | 'vendeur' | 'caissier' | 'magasinier' | 'comptable' | 'viewer';

export type Module = 
  | 'dashboard' | 'clients' | 'products' | 'stock' 
  | 'sales' | 'payments' | 'reports' | 'settings' | 'users';

export type Action = 'view' | 'add' | 'edit' | 'delete' | 'print' | 'export';

// Matrice des permissions par rôle et module
const PERMISSIONS: Record<AppRole, Record<Module, Action[]>> = {
  super_admin: {
    dashboard: ['view', 'export'],
    clients: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    products: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    stock: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    sales: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    payments: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    reports: ['view', 'print', 'export'],
    settings: ['view', 'add', 'edit', 'delete'],
    users: ['view', 'add', 'edit', 'delete'],
  },
  admin: {
    dashboard: ['view', 'export'],
    clients: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    products: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    stock: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    sales: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    payments: ['view', 'add', 'edit', 'delete', 'print', 'export'],
    reports: ['view', 'print', 'export'],
    settings: ['view', 'edit'],
    users: ['view', 'add', 'edit'],
  },
  manager: {
    dashboard: ['view', 'export'],
    clients: ['view', 'export'],
    products: ['view', 'export'],
    stock: ['view', 'export'],
    sales: ['view', 'export', 'print'],
    payments: ['view', 'export'],
    reports: ['view', 'print', 'export'],
    settings: [],
    users: [],
  },
  vendeur: {
    dashboard: ['view'],
    clients: ['view', 'add', 'edit'],
    products: ['view', 'add', 'edit'],
    stock: ['view'],
    sales: ['view', 'add', 'edit', 'print'],
    payments: ['view'],
    reports: [],
    settings: [],
    users: [],
  },
  caissier: {
    dashboard: ['view'],
    clients: ['view'],
    products: ['view'],
    stock: [],
    sales: ['view', 'print'],
    payments: ['view', 'add', 'edit', 'print'],
    reports: [],
    settings: [],
    users: [],
  },
  magasinier: {
    dashboard: ['view'],
    clients: [],
    products: ['view'],
    stock: ['view', 'add', 'edit', 'print', 'export'],
    sales: [],
    payments: [],
    reports: [],
    settings: [],
    users: [],
  },
  comptable: {
    dashboard: ['view'],
    clients: ['view'],
    products: ['view'],
    stock: ['view'],
    sales: ['view', 'print', 'export'],
    payments: ['view', 'print', 'export'],
    reports: ['view', 'print', 'export'],
    settings: [],
    users: [],
  },
  viewer: {
    dashboard: ['view'],
    clients: ['view'],
    products: ['view'],
    stock: ['view'],
    sales: ['view'],
    payments: ['view'],
    reports: ['view'],
    settings: [],
    users: [],
  },
};

/** Vérifie si un ensemble de rôles permet l'accès à un module + action */
export function hasPermission(roles: AppRole[], module: Module, action: Action): boolean {
  return roles.some(role => PERMISSIONS[role]?.[module]?.includes(action));
}

/** Vérifie si un ensemble de rôles permet l'accès à un module (au moins 'view') */
export function canAccessModule(roles: AppRole[], module: Module): boolean {
  return hasPermission(roles, module, 'view');
}

/** Récupère toutes les permissions fusionnées pour un ensemble de rôles */
export function getMergedPermissions(roles: AppRole[]): Record<Module, Action[]> {
  const merged: Record<Module, Action[]> = {
    dashboard: [], clients: [], products: [], stock: [],
    sales: [], payments: [], reports: [], settings: [], users: [],
  };

  for (const role of roles) {
    const perms = PERMISSIONS[role];
    if (!perms) continue;
    for (const mod of Object.keys(perms) as Module[]) {
      for (const action of perms[mod]) {
        if (!merged[mod].includes(action)) {
          merged[mod].push(action);
        }
      }
    }
  }
  return merged;
}

/** Labels lisibles pour les rôles */
export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  manager: 'Manager',
  vendeur: 'Vendeur',
  caissier: 'Caissier',
  magasinier: 'Magasinier',
  comptable: 'Comptable',
  viewer: 'Lecture seule',
};

/** Labels pour les modules */
export const MODULE_LABELS: Record<Module, string> = {
  dashboard: 'Tableau de bord',
  clients: 'Clients',
  products: 'Produits',
  stock: 'Stock',
  sales: 'Ventes',
  payments: 'Paiements',
  reports: 'Rapports',
  settings: 'Paramètres',
  users: 'Utilisateurs',
};

/** Labels pour les actions */
export const ACTION_LABELS: Record<Action, string> = {
  view: 'Voir',
  add: 'Ajouter',
  edit: 'Modifier',
  delete: 'Supprimer',
  print: 'Imprimer',
  export: 'Exporter',
};

export const ALL_ROLES: AppRole[] = ['super_admin', 'admin', 'manager', 'vendeur', 'caissier', 'magasinier', 'comptable', 'viewer'];

/** Couleur de badge par rôle */
export const ROLE_COLORS: Record<AppRole, string> = {
  super_admin: 'bg-red-100 text-red-800 border-red-200',
  admin: 'bg-orange-100 text-orange-800 border-orange-200',
  manager: 'bg-blue-100 text-blue-800 border-blue-200',
  vendeur: 'bg-green-100 text-green-800 border-green-200',
  caissier: 'bg-purple-100 text-purple-800 border-purple-200',
  magasinier: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  comptable: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200',
};
