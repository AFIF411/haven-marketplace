import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings,
  Store, DollarSign, Tag, MessageSquare, CreditCard, ArrowDownToLine,
  Star, FileText, Shield, Layers, AlertTriangle, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = { label: string; href: string; icon: ReactNode };

const vendorMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/vendor", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Ma boutique", href: "/vendor/shop", icon: <Store className="h-4 w-4" /> },
  { label: "Produits", href: "/vendor/products", icon: <Package className="h-4 w-4" /> },
  { label: "Commandes", href: "/vendor/orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Clients", href: "/vendor/customers", icon: <Users className="h-4 w-4" /> },
  { label: "Promotions", href: "/vendor/promotions", icon: <Tag className="h-4 w-4" /> },
  { label: "Finances", href: "/vendor/finances", icon: <DollarSign className="h-4 w-4" /> },
  { label: "Statistiques", href: "/vendor/stats", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Paramètres", href: "/vendor/settings", icon: <Settings className="h-4 w-4" /> },
];

const adminMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Vendeurs", href: "/admin/vendors", icon: <Store className="h-4 w-4" /> },
  { label: "Boutiques", href: "/admin/shops", icon: <Layers className="h-4 w-4" /> },
  { label: "Produits", href: "/admin/products", icon: <Package className="h-4 w-4" /> },
  { label: "Commandes", href: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Utilisateurs", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Paiements", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Retraits", href: "/admin/withdrawals", icon: <ArrowDownToLine className="h-4 w-4" /> },
  { label: "Catégories", href: "/admin/categories", icon: <Tag className="h-4 w-4" /> },
  { label: "Réclamations", href: "/admin/complaints", icon: <AlertTriangle className="h-4 w-4" /> },
  { label: "Avis", href: "/admin/reviews", icon: <Star className="h-4 w-4" /> },
  { label: "CMS", href: "/admin/cms", icon: <FileText className="h-4 w-4" /> },
  { label: "Rapports", href: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Paramètres", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const clientMenu: SidebarItem[] = [
  { label: "Dashboard", href: "/account", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Mes commandes", href: "/account/orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Wishlist", href: "/wishlist", icon: <Star className="h-4 w-4" /> },
  { label: "Adresses", href: "/account/addresses", icon: <FileText className="h-4 w-4" /> },
  { label: "Avis", href: "/account/reviews", icon: <MessageSquare className="h-4 w-4" /> },
  { label: "Profil", href: "/account/profile", icon: <Users className="h-4 w-4" /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
  type: "vendor" | "admin" | "client";
  title: string;
}

export function DashboardLayout({ children, type, title }: DashboardLayoutProps) {
  const location = useLocation();
  const menu = type === "vendor" ? vendorMenu : type === "admin" ? adminMenu : clientMenu;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b bg-card flex items-center px-4 gap-3">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Retour au site</span>
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
        <div className="ml-auto flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-medium">U</span>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:flex w-56 flex-col border-r bg-card min-h-[calc(100vh-3.5rem)] sticky top-14">
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
