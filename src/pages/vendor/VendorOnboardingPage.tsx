import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Store, Package, CreditCard, Check, ArrowRight } from "lucide-react";
import { wilayas } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    { icon: Store, title: t("onboarding.yourShop"), desc: t("onboarding.basicInfo") },
    { icon: Package, title: t("onboarding.yourProducts"), desc: t("onboarding.whatYouSell") },
  ];

  return (
    <MarketplaceLayout>
      <div className="container py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold">{t("onboarding.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("onboarding.subtitle")}</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>{s.title}</span>
              {i < steps.length - 1 && <div className={`h-px w-6 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          {step === 0 && (
            <>
              <h2 className="font-heading font-semibold">{t("onboarding.shopInfo")}</h2>
              <div><label className="text-sm font-medium mb-1 block">{t("onboarding.shopName")}</label><input className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="Artisan Cuir Alger" /></div>
              <div><label className="text-sm font-medium mb-1 block">{t("common.description")}</label><textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px]" defaultValue="Boutique de maroquinerie artisanale algérienne — sacs, ceintures et accessoires en cuir véritable." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium mb-1 block">{t("onboarding.mainCategory")}</label><select className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="craft"><option value="fashion">{t("cat.fashion")}</option><option value="home">{t("cat.home")}</option><option value="craft">{t("cat.craft")}</option><option value="food">{t("cat.food")}</option></select></div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t("onboarding.wilaya")}</label>
                  <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" defaultValue="Alger">
                    <option value="">{t("common.select")}</option>
                    {wilayas.map((w, i) => (
                      <option key={w} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-heading font-semibold">{t("onboarding.productType")}</h2>
              <p className="text-sm text-muted-foreground">{t("onboarding.productTypeDesc")}</p>
              <div className="grid grid-cols-2 gap-3">
                {[t("onboarding.physicalProducts"), t("onboarding.digitalProducts"), t("onboarding.services"), t("onboarding.traditionalCraft")].map(item => (
                  <label key={item} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:border-primary/50">
                    <input type="checkbox" className="rounded" /><span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between pt-4 border-t">
            {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>{t("common.back")}</Button> : <div />}
            {step < 1 ? (
              <Button onClick={() => setStep(step + 1)}>{t("common.continue")} <ArrowRight className="ms-1 h-4 w-4" /></Button>
            ) : (
              <Button asChild><Link to="/vendor">{t("onboarding.createShop")}</Link></Button>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
