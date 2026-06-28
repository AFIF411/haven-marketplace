import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { ShopCard } from "@/components/marketplace/ShopCard";
import { mockProducts, mockShops, mockCategories } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";
import { usePublicShops, usePublicProducts } from "@/hooks/usePublicCatalog";
import heroBanner from "@/assets/hero-banner.jpg";

export default function HomePage() {
  const { t } = useTranslation();
  const { data: dbShops } = usePublicShops();
  const { data: dbProducts } = usePublicProducts();
  const shopsToShow = [...dbShops, ...mockShops].slice(0, 6);
  const productsToShow = [...dbProducts, ...mockProducts].slice(0, 8);

  const features = [
    { icon: Truck, title: t("home.features.delivery"), desc: t("home.features.deliveryDesc") },
    { icon: Shield, title: t("home.features.payment"), desc: t("home.features.paymentDesc") },
    { icon: CreditCard, title: t("home.features.refund"), desc: t("home.features.refundDesc") },
    { icon: Headphones, title: t("home.features.support"), desc: t("home.features.supportDesc") },
  ];

  return (
    <MarketplaceLayout>
      <section className="relative overflow-hidden">
        <img src={heroBanner} alt="OneClick Tijara Marketplace" className="w-full h-[320px] md:h-[420px] object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/20 flex items-center">
          <div className="container">
            <div className="max-w-lg">
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-card leading-tight">
                {t("home.hero.title")}
              </h1>
              <p className="mt-3 text-card/80 text-sm md:text-base leading-relaxed">
                {t("home.hero.subtitle")}
              </p>
              <div className="mt-6 flex gap-3">
                <Button size="lg" asChild>
                  <Link to="/products">{t("home.hero.explore")} <ArrowRight className="ms-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-card/10 border-card/30 text-card hover:bg-card/20" asChild>
                  <Link to="/vendor/onboarding">{t("home.hero.becomeVendor")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">{t("home.popularCategories")}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">{t("common.seeAll")} <ArrowRight className="ms-1 h-3 w-3" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {mockCategories.map(cat => (
            <Link key={cat.name} to={`/categories/${cat.name.toLowerCase()}`} className="group text-center">
              <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-secondary">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <p className="text-sm font-medium">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{cat.count.toLocaleString()} {t("common.articles")}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">{t("home.trendingProducts")}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products">{t("common.seeAll")} <ArrowRight className="ms-1 h-3 w-3" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productsToShow.map((p: any) => <ProductCard key={p.id} {...p} />)}
        </div>
      </section>

      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">{t("home.discoverShops")}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/shops">{t("common.seeAll")} <ArrowRight className="ms-1 h-3 w-3" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopsToShow.map((s: any) => <ShopCard key={s.id} {...s} />)}
        </div>
      </section>

      <section className="container py-10">
        <div className="rounded-xl bg-primary p-8 md:p-12 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground">
            {t("home.cta.title")}
          </h2>
          <p className="mt-2 text-primary-foreground/80 max-w-md mx-auto text-sm">
            {t("home.cta.subtitle")}
          </p>
          <Button size="lg" variant="secondary" className="mt-6" asChild>
            <Link to="/vendor/onboarding">{t("home.cta.button")}</Link>
          </Button>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
