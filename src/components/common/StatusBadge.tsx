import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus, ShopStatus, ProductStatus, AccountStatus } from "@/types/marketplace";

const ORDER_VARIANTS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  shipped: "bg-cyan-100 text-cyan-800 border-cyan-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};
const ORDER_LABELS: Record<OrderStatus, string> = {
  pending: "En attente", confirmed: "Confirmée", preparing: "En préparation",
  shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée", refunded: "Remboursée",
};

const PAYMENT_VARIANTS: Record<PaymentStatus, string> = {
  unpaid: "bg-red-100 text-red-800 border-red-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  partial: "bg-amber-100 text-amber-800 border-amber-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};
const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Non payé", paid: "Payé", partial: "Partiel", refunded: "Remboursé",
};

const SHOP_VARIANTS: Record<ShopStatus, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
  rejected: "bg-gray-100 text-gray-800 border-gray-200",
};
const SHOP_LABELS: Record<ShopStatus, string> = {
  active: "Active", pending: "En attente", suspended: "Suspendue", rejected: "Rejetée",
};

const PRODUCT_VARIANTS: Record<ProductStatus, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  archived: "bg-zinc-100 text-zinc-800 border-zinc-200",
  out_of_stock: "bg-red-100 text-red-800 border-red-200",
};
const PRODUCT_LABELS: Record<ProductStatus, string> = {
  active: "Actif", draft: "Brouillon", archived: "Archivé", out_of_stock: "Rupture",
};

const ACCOUNT_VARIANTS: Record<AccountStatus, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
};
const ACCOUNT_LABELS: Record<AccountStatus, string> = {
  active: "Actif", inactive: "Inactif", suspended: "Suspendu",
};

interface Props {
  kind: "order" | "payment" | "shop" | "product" | "account";
  status: string;
}

export function StatusBadge({ kind, status }: Props) {
  let variant = "", label = status;
  switch (kind) {
    case "order": variant = ORDER_VARIANTS[status as OrderStatus]; label = ORDER_LABELS[status as OrderStatus] || status; break;
    case "payment": variant = PAYMENT_VARIANTS[status as PaymentStatus]; label = PAYMENT_LABELS[status as PaymentStatus] || status; break;
    case "shop": variant = SHOP_VARIANTS[status as ShopStatus]; label = SHOP_LABELS[status as ShopStatus] || status; break;
    case "product": variant = PRODUCT_VARIANTS[status as ProductStatus]; label = PRODUCT_LABELS[status as ProductStatus] || status; break;
    case "account": variant = ACCOUNT_VARIANTS[status as AccountStatus]; label = ACCOUNT_LABELS[status as AccountStatus] || status; break;
  }
  return <Badge variant="outline" className={cn("border font-medium", variant)}>{label}</Badge>;
}
