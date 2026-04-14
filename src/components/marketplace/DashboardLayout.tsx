import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings,
  Store, DollarSign, CreditCard,
  Star, FileText, ChevronLeft, Warehouse, UserCheck, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/lib/permissions";
import { ROLE_LABELS } from "@/lib/permissions";

type SidebarItem = { label: string; href: string; icon: ReactNode; module?: Module };

function useRoleBasedMenus() {
  const { t } = useTranslation();
  const { canAccess } = useAuth();

  // Menu principal pour l'espace gestion (tous les rôles sauf marketplace)
  const managementMenu: SidebarItem[] = [
    { label: "Tableau de bord", href: "/manage", icon: <LayoutDashboard className="h-4 w-4" />, module: 'dashboard' },
    { label: "Ventes", href: "/manage/sales", icon: <FileText className="h-4 w-4" />, module: 'sales' },
    { label: "Produits", href: "/manage/products", icon: <Package className="h-4 w-4" />, module: 'products' },
    { label: "Clients", href: "/manage/clients", icon: <UserCheck className="h-4 w-4" />, module: 'clients' },
    { label: "Stock", href: "/manage/stock", icon: <Warehouse className="h-4 w-4" />, module: 'stock' },
    { label: "Paiements", href: "/manage/payments", icon: <CreditCard className="h-4 w-4" />, module: 'payments' },
    { label: "Rapports", href: "/manage/reports", icon: <BarChart3 className="h-4 w-4" />, module: 'reports' },
    { label: "Utilisateurs", href: "/manage/users", icon: <Users className="h-4 w-4" />, module: 'users' },
    { label: "Paramètres", href: "/manage/settings", icon: <Settings className="h-4 w-4" />, module: 'settings' },
  ].filter(item => !item.module || canAccess(item.module));

  // Legacy vendor menu (pour rétro-compatibilité)
  const vendorMenu: SidebarItem[] = [
    { label: t("vendor.dashboard"), href: "/vendor", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Ventes", href: "/vendor/sales", icon: <FileText className="h-4 w-4" /> },
    { label: t("vendor.products"), href: "/vendor/products", icon: <Package className="h-4 w-4" /> },
    { label: "Clients", href: "/vendor/clients", icon: <UserCheck className="h-4 w-4" /> },
    { label: "Stock", href: "/vendor/stock", icon: <Warehouse className="h-4 w-4" /> },
    { label: t("vendor.orders"), href: "/vendor/orders", icon: <ShoppingBag className="h-4 w-4" /> },
    { label: t("vendor.finances"), href: "/vendor/finances", icon: <DollarSign className="h-4 w-4" /> },
  ];

  const adminMenu: SidebarItem[] = [
    { label: t("vendor.dashboard"), href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: t("filter.vendors"), href: "/admin/vendors", icon: <Store className="h-4 w-4" /> },
    { label: t("vendor.products"), href: "/admin/products", icon: <Package className="h-4 w-4" /> },
    { label: t("vendor.orders"), href: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" /> },
    { label: t("admin.users"), href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  ];

  const clientMenu: SidebarItem[] = [
    { label: t("vendor.dashboard"), href: "/account", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: t("client.myOrders"), href: "/account/orders", icon: <ShoppingBag className="h-4 w-4" /> },
    { label: t("client.wishlist"), href: "/wishlist", icon: <Star className="h-4 w-4" /> },
    { label: t("client.addresses"), href: "/account/addresses", icon: <FileText className="h-4 w-4" /> },
    { label: t("client.myProfile"), href: "/account/profile", icon: <Users className="h-4 w-4" /> },
  ];

  return { managementMenu, vendorMenu, adminMenu, clientMenu };
}

interface DashboardLayoutProps {
  children: ReactNode;
  type: "vendor" | "admin" | "client" | "manage";
  title: string;
}

export function DashboardLayout({ children, type, title }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, roles, logout } = useAuth();
  const { managementMenu, vendorMenu, adminMenu, clientMenu } = useRoleBasedMenus();
  
  const menu = type === "manage" ? managementMenu 
    : type === "vendor" ? vendorMenu 
    : type === "admin" ? adminMenu 
    : clientMenu;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const primaryRole = roles[0];
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : "";
  const initials = user 
    ? (user.firstName?.[0] || "") + (user.lastName?.[0] || "") || user.email?.[0]?.toUpperCase() || "U"
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b bg-card flex items-center px-4 gap-3">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t("sidebar.backToSite")}</span>
        </Link>
        <div className="h-5 w-px bg-border" />
        <Link to="/" className="font-heading font-bold text-primary text-sm flex items-center gap-1.5">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-[10px] font-bold">S</span>
          </div>
          Souk DZ
        </Link>
        <div className="h-5 w-px bg-border" />
        <span className="font-heading font-semibold text-sm">{title}</span>
        <div className="ms-auto flex items-center gap-3">
          {primaryRole && (
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              {ROLE_LABELS[primaryRole] || primaryRole}
            </Badge>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-medium">{initials}</span>
            </div>
            <span className="text-sm hidden sm:inline font-medium">{displayName}</span>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors" title="Déconnexion">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:flex w-56 flex-col border-e bg-card min-h-[calc(100vh-3.5rem)] sticky top-14">
          <nav className="flex-1 p-3 space-y-0.5">
            {menu.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 p-4 md:p-6 max-w-full overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
