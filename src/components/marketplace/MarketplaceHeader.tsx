import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";

const categories = [
  "Électronique", "Mode", "Maison", "Beauté", "Sports", "Alimentation", "Artisanat"
];

export function MarketplaceHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">S</span>
          </div>
          Souk DZ
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 ps-10 pe-4 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">{t("nav.categories")} <ChevronDown className="ms-1 h-3 w-3" /></Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/shops">{t("nav.shops")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/promotions">{t("nav.promos")}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-1 ms-auto">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center gap-1 text-xs"
            onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
          >
            <Globe className="h-4 w-4" />
            {lang === "fr" ? "العربية" : "Français"}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/wishlist"><Heart className="h-5 w-5" /></Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>

          {user ? (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2" asChild>
                <Link to="/account">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-[10px] font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <span className="text-sm">{user.firstName}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden" asChild>
                <Link to="/account"><User className="h-5 w-5" /></Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
              <Link to="/login">{t("nav.login")}</Link>
            </Button>
          )}
          {!user && (
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link to="/login"><User className="h-5 w-5" /></Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-3 bg-card">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("filter.search")}
              className="w-full h-10 ps-10 pe-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <Link key={c} to={`/categories/${c.toLowerCase()}`} className="text-sm px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                {c}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <Link to="/shops" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>{t("nav.shops")}</Link>
            <Link to="/promotions" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>{t("nav.promotions")}</Link>
            {user ? (
              <>
                <Link to="/account" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>{t("nav.myAccount")} ({user.firstName})</Link>
                <button className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors text-start text-destructive" onClick={() => { logout(); setMobileOpen(false); }}>{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/register" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>{t("nav.createAccount")}</Link>
              </>
            )}
            <button
              className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors text-start flex items-center gap-2"
              onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            >
              <Globe className="h-4 w-4" />
              {lang === "fr" ? "العربية" : "Français"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
