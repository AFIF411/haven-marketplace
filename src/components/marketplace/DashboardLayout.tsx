import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings,
  Store, DollarSign, CreditCard, Layout, Tag,
  Star, FileText, ChevronLeft, Warehouse, UserCheck, LogOut, FolderTree,
  Sparkles, Truck, Bell, LifeBuoy, MapPin, Heart, Receipt, Wand2,
  Crown, Wallet, ShieldCheck, Flag, Map, History, Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/lib/permissions";
import { ROLE_LABELS } from "@/lib/permissions";
import brandLogo from "@/assets/logo-oneclick-tijara.png";

type SidebarItem = { label: string; href: string; icon: ReactNode; module?: Module };
type SidebarSection = { title?: string; items: SidebarItem[] };

function useRoleBasedMenus() {
  const { t } = useTranslation();
  const { canAccess } = useAuth();

  // Menu principal pour l'espace gestion (tous les rôles sauf marketplace)
  const managementMenu = ([
    { label: "Tableau de bord", href: "/manage", icon: <LayoutDashboard className="h-4 w-4" />, module: 'dashboard' as Module },
    { label: "Ventes", href: "/manage/sales", icon: <FileText className="h-4 w-4" />, module: 'sales' as Module },
    { label: "Produits", href: "/manage/products", icon: <Package className="h-4 w-4" />, module: 'products' as Module },
    { label: "Clients", href: "/manage/clients", icon: <UserCheck className="h-4 w-4" />, module: 'clients' as Module },
    { label: "Stock", href: "/manage/stock", icon: <Warehouse className="h-4 w-4" />, module: 'stock' as Module },
    { label: "Paiements", href: "/manage/payments", icon: <CreditCard className="h-4 w-4" />, module: 'payments' as Module },
    { label: "Rapports", href: "/manage/reports", icon: <BarChart3 className="h-4 w-4" />, module: 'reports' as Module },
    { label: "Utilisateurs", href: "/manage/users", icon: <Users className="h-4 w-4" />, module: 'users' as Module },
    { label: "Paramètres", href: "/manage/settings", icon: <Settings className="h-4 w-4" />, module: 'settings' as Module },
  ] as SidebarItem[]).filter(item => !item.module || canAccess(item.module));

  // Espace vendeur — organisé en sections
  const vendorSections: SidebarSection[] = [
    {
      items: [
        { label: t("vendor.dashboard"), href: "/vendor", icon: <LayoutDashboard className="h-4 w-4" /> },
        { label: "Analytics", href: "/vendor/analytics", icon: <BarChart3 className="h-4 w-4" /> },
      ],
    },
    {
      title: "Catalogue",
      items: [
        { label: t("vendor.products"), href: "/vendor/products", icon: <Package className="h-4 w-4" /> },
        { label: "Stock", href: "/vendor/stock", icon: <Warehouse className="h-4 w-4" /> },
        { label: "Fournisseurs", href: "/vendor/suppliers", icon: <Truck className="h-4 w-4" /> },
        { label: "Promotions", href: "/vendor/promotions", icon: <Tag className="h-4 w-4" /> },
      ],
    },
    {
      title: "Ventes",
      items: [
        { label: t("vendor.orders"), href: "/vendor/orders", icon: <ShoppingBag className="h-4 w-4" /> },
        { label: "Livraison", href: "/vendor/shipping", icon: <Truck className="h-4 w-4" /> },
        { label: "Clients", href: "/vendor/clients", icon: <UserCheck className="h-4 w-4" /> },
        { label: "Avis", href: "/vendor/reviews", icon: <Star className="h-4 w-4" /> },
      ],
    },
    {
      title: "Finances",
      items: [
        { label: t("vendor.finances"), href: "/vendor/finances", icon: <DollarSign className="h-4 w-4" /> },
        { label: "Dépenses", href: "/vendor/expenses", icon: <Receipt className="h-4 w-4" /> },
        { label: "Abonnement", href: "/vendor/subscription", icon: <Crown className="h-4 w-4" /> },
      ],
    },
    {
      title: "Assistant IA",
      items: [
        { label: "Assistant", href: "/ai/assistant", icon: <Sparkles className="h-4 w-4" /> },
        { label: "Suggestions", href: "/ai/suggestions", icon: <Lightbulb className="h-4 w-4" /> },
        { label: "Description produit", href: "/ai/generate-description", icon: <Wand2 className="h-4 w-4" /> },
        { label: "Générer page", href: "/ai/generate-page", icon: <Layout className="h-4 w-4" /> },
        { label: "Historique", href: "/ai/history", icon: <History className="h-4 w-4" /> },
      ],
    },
    {
      title: "Boutique",
      items: [
        { label: "Page Builder", href: "/vendor/page-builder", icon: <Layout className="h-4 w-4" /> },
        { label: "Générer par IA", href: "/vendor/ai-shop-generator", icon: <Sparkles className="h-4 w-4" /> },
        { label: "Paramètres", href: "/vendor/settings", icon: <Settings className="h-4 w-4" /> },
        { label: "Paramètres IA", href: "/ai/settings", icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ];

  // Espace admin — organisé en sections
  const adminSections: SidebarSection[] = [
    {
      items: [
        { label: t("vendor.dashboard"), href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
        { label: "Rapports", href: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
        { label: "Notifications", href: "/admin/notifications", icon: <Bell className="h-4 w-4" /> },
      ],
    },
    {
      title: "Catalogue",
      items: [
        { label: "Boutiques", href: "/admin/shops", icon: <Store className="h-4 w-4" /> },
        { label: t("filter.vendors"), href: "/admin/vendors", icon: <Store className="h-4 w-4" /> },
        { label: t("vendor.products"), href: "/admin/products", icon: <Package className="h-4 w-4" /> },
        { label: "Catégories", href: "/admin/categories", icon: <FolderTree className="h-4 w-4" /> },
        { label: "Promotions", href: "/admin/promotions", icon: <Tag className="h-4 w-4" /> },
        { label: "Avis", href: "/admin/reviews", icon: <Star className="h-4 w-4" /> },
      ],
    },
    {
      title: "Opérations",
      items: [
        { label: t("vendor.orders"), href: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" /> },
        { label: "Paiements", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
        { label: "Livraison", href: "/admin/shipping", icon: <Truck className="h-4 w-4" /> },
        { label: "Wilayas", href: "/admin/wilayas", icon: <Map className="h-4 w-4" /> },
      ],
    },
    {
      title: "Plateforme",
      items: [
        { label: t("admin.users"), href: "/admin/users", icon: <Users className="h-4 w-4" /> },
        { label: "Rôles & permissions", href: "/admin/roles", icon: <ShieldCheck className="h-4 w-4" /> },
        { label: "Plans SaaS", href: "/admin/saas-plans", icon: <Crown className="h-4 w-4" /> },
        { label: "Support", href: "/admin/support", icon: <LifeBuoy className="h-4 w-4" /> },
        { label: "Signalements", href: "/admin/reports-moderation", icon: <Flag className="h-4 w-4" /> },
        { label: "Paramètres", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ];

  // Espace client — organisé en sections
  const clientSections: SidebarSection[] = [
    {
      items: [
        { label: t("vendor.dashboard"), href: "/account", icon: <LayoutDashboard className="h-4 w-4" /> },
        { label: t("client.myProfile"), href: "/account/profile", icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      title: "Mes achats",
      items: [
        { label: t("client.myOrders"), href: "/account/orders", icon: <ShoppingBag className="h-4 w-4" /> },
        { label: "Suivi colis", href: "/account/tracking", icon: <Truck className="h-4 w-4" /> },
        { label: "Paiements", href: "/account/payments", icon: <Wallet className="h-4 w-4" /> },
        { label: t("client.wishlist"), href: "/wishlist", icon: <Heart className="h-4 w-4" /> },
      ],
    },
    {
      title: "Compte",
      items: [
        { label: t("client.addresses"), href: "/account/addresses", icon: <MapPin className="h-4 w-4" /> },
        { label: "Notifications", href: "/account/notifications", icon: <Bell className="h-4 w-4" /> },
        { label: "Support", href: "/account/support", icon: <LifeBuoy className="h-4 w-4" /> },
      ],
    },
  ];

  const managementSections: SidebarSection[] = [{ items: managementMenu }];

  return { managementSections, vendorSections, adminSections, clientSections };
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
  const { managementSections, vendorSections, adminSections, clientSections } = useRoleBasedMenus();

  const sections = type === "manage" ? managementSections
    : type === "vendor" ? vendorSections
    : type === "admin" ? adminSections
    : clientSections;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const primaryRole = roles[0];
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : "";
  const initials = user
    ? (user.firstName?.[0] || "") + (user.lastName?.[0] || "") || user.email?.[0]?.toUpperCase() || "U"
    : "U";

  const isActive = (href: string) =>
    location.pathname === href || (href !== "/" && location.pathname.startsWith(href + "/"));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b bg-card flex items-center px-4 gap-3">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t("sidebar.backToSite")}</span>
        </Link>
        <div className="h-5 w-px bg-border" />
        <Link to="/" className="flex items-center gap-1.5" aria-label="OneClick Tijara">
          <img src="/src/assets/logo-oneclick-tijara.png" alt="OneClick Tijara" className="h-8 w-auto object-contain" />
        </Link>
        <div className="h-5 w-px bg-border" />
        <span className="font-heading font-semibold text-sm truncate">{title}</span>
        <div className="ms-auto flex items-center gap-3">
          {primaryRole && (
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              {ROLE_LABELS[primaryRole] || primaryRole}
            </Badge>
          )}
          <Link to={type === "admin" ? "/admin/notifications" : "/account/notifications"} className="text-muted-foreground hover:text-foreground transition-colors" title="Notifications">
            <Bell className="h-4 w-4" />
          </Link>
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
        <aside className="hidden md:flex w-60 flex-col border-e bg-card min-h-[calc(100vh-3.5rem)] sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="flex-1 p-3 space-y-4">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-0.5">
                {section.title && (
                  <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {section.title}
                  </div>
                )}
                {section.items.map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
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
