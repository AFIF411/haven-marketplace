// ============================================================
// Renderer des blocs — utilisé par le builder ET le storefront.
// ============================================================

import type { PageBlock } from "@/types/marketplace";
import { useProductsByIds } from "@/hooks/useMarketplace";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlockRenderer({ block }: { block: PageBlock }) {
  const p = block.props as Record<string, unknown>;

  switch (block.type) {
    case "hero":
      return (
        <div className="relative rounded-xl overflow-hidden min-h-[280px] md:min-h-[360px] flex items-center"
          style={{ backgroundImage: `url(${p.imageUrl as string})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="relative p-6 md:p-12 max-w-2xl text-white">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3">{p.title as string}</h2>
            <p className="text-white/90 mb-5">{p.subtitle as string}</p>
            {p.ctaLabel ? <Button size="lg" asChild><a href={p.ctaHref as string}>{p.ctaLabel as string}</a></Button> : null}
          </div>
        </div>
      );

    case "product_grid":
      return <ProductGridBlock title={p.title as string} ids={(p.productIds as string[]) || []} columns={Number(p.columns) || 4} />;

    case "category_grid":
      return (
        <div>
          {p.title ? <h3 className="font-heading text-xl font-bold mb-4">{p.title as string}</h3> : null}
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Bloc catégories — sélectionnez des IDs</div>
        </div>
      );

    case "banner": {
      const colorClass = p.color === "accent" ? "bg-accent text-accent-foreground" : p.color === "dark" ? "bg-foreground text-background" : "bg-primary text-primary-foreground";
      return (
        <div className={cn("rounded-xl p-6 md:p-8 text-center", colorClass)}>
          <h3 className="font-heading text-2xl font-bold">{p.title as string}</h3>
          <p className="opacity-90 mt-1">{p.subtitle as string}</p>
        </div>
      );
    }

    case "text":
      return <p className={cn("text-base leading-relaxed", p.align === "center" && "text-center", p.align === "right" && "text-end")}>{p.content as string}</p>;

    case "image":
      return <img src={p.url as string} alt={(p.alt as string) || ""} className="w-full rounded-lg" loading="lazy" />;

    case "testimonials":
      return (
        <div>
          <h3 className="font-heading text-xl font-bold mb-4">{p.title as string}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {((p.items as Array<{ name: string; text: string; rating: number }>) || []).map((it, i) => (
              <div key={i} className="bg-card border rounded-lg p-4">
                <div className="text-amber-500 mb-2">{"★".repeat(it.rating)}</div>
                <p className="text-sm">{it.text}</p>
                <p className="text-xs text-muted-foreground mt-2">— {it.name}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "newsletter":
      return (
        <div className="bg-secondary rounded-xl p-6 md:p-8 text-center">
          <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
          <h3 className="font-heading text-xl font-bold">{p.title as string}</h3>
          <p className="text-sm text-muted-foreground mb-4">{p.subtitle as string}</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input className="flex-1 h-10 px-3 rounded-md border bg-background text-sm" placeholder="Votre email" />
            <Button>S'inscrire</Button>
          </div>
        </div>
      );

    case "spacer":
      return <div style={{ height: `${Number(p.height) || 40}px` }} />;

    default:
      return null;
  }
}

export function BlocksList({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map(b => <BlockRenderer key={b.id} block={b} />)}
    </div>
  );
}
