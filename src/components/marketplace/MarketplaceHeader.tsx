import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const categories = [
  "Électronique", "Mode", "Maison", "Beauté", "Sports", "Alimentation", "Artisanat"
];

export function MarketplaceHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">M</span>
          </div>
          Marché
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher produits, boutiques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">Catégories <ChevronDown className="ml-1 h-3 w-3" /></Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/shops">Boutiques</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/promotions">Promos</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/wishlist"><Heart className="h-5 w-5" /></Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">3</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/account"><User className="h-5 w-5" /></Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-3 bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
            <Link to="/shops" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Boutiques</Link>
            <Link to="/promotions" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Promotions</Link>
            <Link to="/account" className="text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Mon compte</Link>
          </div>
        </div>
      )}
    </header>
  );
}
