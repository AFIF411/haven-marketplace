// ============================================================
// Types métier — Souk DZ Marketplace
// Source unique de vérité pour le frontend.
// La BDD Postgres externe peut mapper ces types tels quels.
// ============================================================

export type ID = string;
export type ISODate = string;

// ---------- Utilisateurs ----------
export type AccountStatus = "active" | "inactive" | "suspended";

export interface UserAccount {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: AccountStatus;
  createdAt: ISODate;
}

// ---------- Boutiques ----------
export type ShopStatus = "pending" | "active" | "suspended" | "rejected";

export interface Shop {
  id: ID;
  ownerId: ID;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  category?: string;
  wilaya?: string;
  phone?: string;
  email?: string;
  rc?: string; // Registre de commerce
  nif?: string; // Numéro d'identification fiscale
  rating: number;
  reviewsCount: number;
  productsCount: number;
  verified: boolean;
  status: ShopStatus;
  createdAt: ISODate;
}

// ---------- Catégories ----------
export interface Category {
  id: ID;
  parentId: ID | null;
  slug: string;
  name: string; // FR
  nameAr?: string;
  icon?: string; // emoji ou nom lucide
  imageUrl?: string;
  productsCount?: number;
}

// ---------- Produits ----------
export type ProductStatus = "draft" | "active" | "archived" | "out_of_stock";

export interface ProductImage {
  id: ID;
  url: string;
  alt?: string;
  position: number;
}

export interface ProductVariant {
  id: ID;
  name: string; // ex: "Rouge / M"
  sku?: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // { color: "red", size: "M" }
}

export interface Product {
  id: ID;
  shopId: ID;
  shopName: string;
  categoryId?: ID;
  slug: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minStock?: number;
  sku?: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: Record<string, string>;
  rating: number;
  reviewsCount: number;
  badge?: "Nouveau" | "Bestseller" | "Promo";
  status: ProductStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ---------- Avis ----------
export interface ProductReview {
  id: ID;
  productId: ID;
  userId: ID;
  userName: string;
  rating: number; // 1..5
  comment?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: ISODate;
}

// ---------- Panier ----------
export interface CartItem {
  productId: ID;
  variantId?: ID;
  name: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  shopId: ID;
  shopName: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

// ---------- Adresses ----------
export interface Address {
  id: ID;
  userId: ID;
  label: string; // "Maison", "Bureau"
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  commune: string;
  wilaya: string;
  postalCode?: string;
  isDefault: boolean;
}

// ---------- Commandes ----------
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "cod" | "ccp" | "baridimob" | "card_cib" | "card_edahabia";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partial";
export type DeliveryMode = "home" | "express" | "relay";

export interface OrderItem {
  id: ID;
  productId: ID;
  productName: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  shopId: ID;
  shopName: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: ISODate;
  note?: string;
}

export interface Order {
  id: ID;
  number: string; // CMD-2024-001
  userId: ID;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  deliveryMode: DeliveryMode;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  history: OrderStatusEvent[];
  notes?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ---------- Promotions ----------
export interface Promotion {
  id: ID;
  shopId?: ID; // null = globale
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number;
  minOrder?: number;
  startsAt: ISODate;
  endsAt: ISODate;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

// ---------- Wishlist ----------
export interface WishlistItem {
  productId: ID;
  addedAt: ISODate;
}

// ---------- Page Builder ----------
export type BlockType =
  | "hero"
  | "product_grid"
  | "category_grid"
  | "banner"
  | "text"
  | "image"
  | "testimonials"
  | "newsletter"
  | "spacer";

export interface PageBlock {
  id: ID;
  type: BlockType;
  props: Record<string, unknown>;
}

export interface ShopPage {
  id: ID;
  shopId: ID;
  blocks: PageBlock[];
  updatedAt: ISODate;
}
