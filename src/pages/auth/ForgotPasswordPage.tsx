import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useTranslation } from "@/contexts/I18nContext";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  return (
    <MarketplaceLayout>
      <div className="container py-16 max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-center">{t("auth.forgotTitle")}</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">{t("auth.forgotSubtitle")}</p>
        <form className="mt-6 space-y-4">
          <div><label className="text-sm font-medium mb-1 block">{t("auth.email")}</label><input type="email" className="w-full h-10 px-3 rounded-md border bg-background text-sm" placeholder="vous@email.com" /></div>
          <Button className="w-full" size="lg">{t("auth.sendLink")}</Button>
        </form>
        <p className="text-sm text-center mt-4 text-muted-foreground"><Link to="/login" className="text-primary hover:underline">{t("auth.backToLogin")}</Link></p>
      </div>
    </MarketplaceLayout>
  );
}
