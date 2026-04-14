import { ReactNode } from "react";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { MarketplaceFooter } from "./MarketplaceFooter";

export function MarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketplaceHeader />
      <main className="flex-1">{children}</main>
      <MarketplaceFooter />
    </div>
  );
}
