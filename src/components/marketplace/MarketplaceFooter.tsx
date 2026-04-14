import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/I18nContext";

export function MarketplaceFooter() {
  const { t } = useTranslation();

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
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">{t("footer.marketplace")}</h4>
            <ul className="space-y-2">
              <li><Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.categories")}</Link></li>
              <li><Link to="/shops" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.shops")}</Link></li>
              <li><Link to="/promotions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.promotions")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">{t("footer.help")}</h4>
            <ul className="space-y-2">
              {[t("footer.helpCenter"), t("footer.deliveryFooter"), t("footer.returns"), t("footer.faq")].map(l => (
                <li key={l}><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">{t("footer.legal")}</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.termsFooter")}</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacyFooter")}</Link></li>
              <li><Link to="/vendor/onboarding" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.becomeVendor")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Souk DZ. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
