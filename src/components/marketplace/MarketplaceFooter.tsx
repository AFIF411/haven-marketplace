import { Link } from "react-router-dom";

const links = [
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "CGV", href: "/terms" },
  { label: "Politique de confidentialité", href: "/privacy" },
  { label: "Devenir vendeur", href: "/vendor/onboarding" },
];

export function MarketplaceFooter() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="font-heading text-lg font-bold text-primary flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">S</span>
              </div>
              Souk DZ
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              La marketplace algérienne multi-boutique où qualité et confiance se rencontrent.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Marketplace</h4>
            <ul className="space-y-2">
              {["Catégories", "Boutiques", "Promotions"].map(l => (
                <li key={l}><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Aide</h4>
            <ul className="space-y-2">
              {["Centre d'aide", "Livraison", "Retours", "FAQ"].map(l => (
                <li key={l}><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Légal</h4>
            <ul className="space-y-2">
              {links.slice(2).map(l => (
                <li key={l.label}><Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Souk DZ. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
