// ============================================================
// Façade API frontend — branchée sur Lovable Cloud (Supabase).
// Toutes les méthodes restent async — les hooks/pages n'ont rien à changer.
// Le panier, la wishlist, les promotions et le page builder restent en local
// (pas de tables côté backend pour ces ressources dans la version MVP).
// ============================================================

import { supabase } from "@/integrations/supabase/client";
import type {
  Shop, Category, Product, Order, OrderStatus, Promotion,
  ProductReview, Address, Cart, CartItem, ShopPage, PageBlock, ID,
  WishlistItem, ProductImage,
} from "@/types/marketplace";

const uid = (p = "id") => `${p}-${Math.random().toString(36).slice(2, 10)}`;

// =============== Mappers DB -> Frontend ===============
function toImages(raw: unknown, productId: string): ProductImage[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((it, i) => {
    if (typeof it === "string") return { id: `${productId}-${i}`, url: it, position: i };
    const obj = it as Record<string, unknown>;
    return {
      id: String(obj.id ?? `${productId}-${i}`),
      url: String(obj.url ?? ""),
      alt: obj.alt as string | undefined,
      position: Number(obj.position ?? i),
    };
  });
}

interface DbShop {
  id: string; owner_id: string; slug: string; name: string;
  description: string | null; logo_url: string | null; cover_url: string | null;
  category: string | null; wilaya: string | null; phone: string | null; email: string | null;
  rc: string | null; nif: string | null;
  rating: number; reviews_count: number; products_count: number;
  verified: boolean; status: Shop["status"]; created_at: string;
}
function mapShop(r: DbShop): Shop {
  return {
    id: r.id, ownerId: r.owner_id, slug: r.slug, name: r.name,
    description: r.description ?? undefined,
    logoUrl: r.logo_url ?? undefined, coverUrl: r.cover_url ?? undefined,
    category: r.category ?? undefined, wilaya: r.wilaya ?? undefined,
    phone: r.phone ?? undefined, email: r.email ?? undefined,
    rc: r.rc ?? undefined, nif: r.nif ?? undefined,
    rating: Number(r.rating), reviewsCount: r.reviews_count,
    productsCount: r.products_count, verified: r.verified,
    status: r.status, createdAt: r.created_at,
  };
}

interface DbProduct {
  id: string; shop_id: string; category_id: string | null;
  slug: string; name: string; description: string | null;
  price: number; original_price: number | null; stock: number;
  sku: string | null; images: unknown; attributes: unknown;
  rating: number; reviews_count: number; badge: string | null;
  status: Product["status"]; created_at: string; updated_at: string;
  shops?: { name: string } | null;
}
function mapProduct(r: DbProduct): Product {
  return {
    id: r.id, shopId: r.shop_id, shopName: r.shops?.name ?? "",
    categoryId: r.category_id ?? undefined,
    slug: r.slug, name: r.name, description: r.description ?? undefined,
    price: Number(r.price), originalPrice: r.original_price ? Number(r.original_price) : undefined,
    stock: r.stock, sku: r.sku ?? undefined,
    images: toImages(r.images, r.id),
    attributes: (r.attributes as Record<string, string>) ?? {},
    rating: Number(r.rating), reviewsCount: r.reviews_count,
    badge: (r.badge as Product["badge"]) ?? undefined,
    status: r.status,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

interface DbOrder {
  id: string; number: string; user_id: string;
  customer_name: string; customer_phone: string;
  subtotal: number; shipping_fee: number; discount: number; total: number;
  shipping_address: Address; delivery_mode: string;
  payment_method: Order["paymentMethod"]; payment_status: Order["paymentStatus"];
  status: OrderStatus; notes: string | null;
  created_at: string; updated_at: string;
  order_items?: Array<{
    id: string; product_id: string | null; product_name: string;
    image_url: string | null; quantity: number; unit_price: number; total: number;
    shop_id: string; shop_name: string;
  }>;
}
function mapOrder(r: DbOrder): Order {
  return {
    id: r.id, number: r.number, userId: r.user_id,
    customerName: r.customer_name, customerPhone: r.customer_phone,
    items: (r.order_items ?? []).map(it => ({
      id: it.id, productId: it.product_id ?? "", productName: it.product_name,
      imageUrl: it.image_url ?? undefined, quantity: it.quantity,
      unitPrice: Number(it.unit_price), total: Number(it.total),
      shopId: it.shop_id, shopName: it.shop_name,
    })),
    subtotal: Number(r.subtotal), shippingFee: Number(r.shipping_fee),
    discount: Number(r.discount), total: Number(r.total),
    shippingAddress: r.shipping_address,
    deliveryMode: r.delivery_mode as Order["deliveryMode"],
    paymentMethod: r.payment_method, paymentStatus: r.payment_status,
    status: r.status, history: [{ status: r.status, at: r.updated_at }],
    notes: r.notes ?? undefined,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

interface DbAddress {
  id: string; user_id: string; label: string;
  first_name: string; last_name: string; phone: string;
  street: string; commune: string; wilaya: string;
  postal_code: string | null; is_default: boolean;
}
function mapAddress(r: DbAddress): Address {
  return {
    id: r.id, userId: r.user_id, label: r.label,
    firstName: r.first_name, lastName: r.last_name, phone: r.phone,
    street: r.street, commune: r.commune, wilaya: r.wilaya,
    postalCode: r.postal_code ?? undefined, isDefault: r.is_default,
  };
}

interface DbReview {
  id: string; product_id: string; user_id: string; user_name: string;
  rating: number; comment: string | null;
  status: ProductReview["status"]; created_at: string;
}
function mapReview(r: DbReview): ProductReview {
  return {
    id: r.id, productId: r.product_id, userId: r.user_id,
    userName: r.user_name, rating: r.rating,
    comment: r.comment ?? undefined,
    status: r.status, createdAt: r.created_at,
  };
}

interface DbCategory {
  id: string; parent_id: string | null; slug: string;
  name: string; name_ar: string | null; icon: string | null; image_url: string | null;
}
function mapCategory(r: DbCategory): Category {
  return {
    id: r.id, parentId: r.parent_id, slug: r.slug, name: r.name,
    nameAr: r.name_ar ?? undefined, icon: r.icon ?? undefined,
    imageUrl: r.image_url ?? undefined,
  };
}

// =============== Stores locaux (non persistés en backend) ===============
const local = {
  promotions: [] as Promotion[],
  shopPages: [] as ShopPage[],
  cart: { items: [] as CartItem[] },
  wishlist: [] as WishlistItem[],
};

// Persistance basique du panier + wishlist
const CART_KEY = "oct_cart_v1";
const WISH_KEY = "oct_wish_v1";
try {
  const c = JSON.parse(localStorage.getItem(CART_KEY) || "null");
  if (c?.items) local.cart.items = c.items;
  const w = JSON.parse(localStorage.getItem(WISH_KEY) || "null");
  if (Array.isArray(w)) local.wishlist = w;
} catch { /* ignore */ }
const persistCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(local.cart)); } catch {} };
const persistWish = () => { try { localStorage.setItem(WISH_KEY, JSON.stringify(local.wishlist)); } catch {} };

// =========================
// Shops
// =========================
export const shopsApi = {
  async list(): Promise<Shop[]> {
    const { data, error } = await supabase.from("shops").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as DbShop[]).map(mapShop);
  },
  async get(id: ID): Promise<Shop | null> {
    const { data, error } = await supabase.from("shops").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapShop(data as DbShop) : null;
  },
  async getBySlug(slug: string): Promise<Shop | null> {
    const { data, error } = await supabase.from("shops").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? mapShop(data as DbShop) : null;
  },
  async update(id: ID, patch: Partial<Shop>): Promise<Shop> {
    const payload: Record<string, unknown> = {};
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.description !== undefined) payload.description = patch.description;
    if (patch.logoUrl !== undefined) payload.logo_url = patch.logoUrl;
    if (patch.coverUrl !== undefined) payload.cover_url = patch.coverUrl;
    if (patch.category !== undefined) payload.category = patch.category;
    if (patch.wilaya !== undefined) payload.wilaya = patch.wilaya;
    if (patch.phone !== undefined) payload.phone = patch.phone;
    if (patch.email !== undefined) payload.email = patch.email;
    if (patch.rc !== undefined) payload.rc = patch.rc;
    if (patch.nif !== undefined) payload.nif = patch.nif;
    if (patch.status !== undefined) payload.status = patch.status;
    if (patch.verified !== undefined) payload.verified = patch.verified;
    const { data, error } = await supabase.from("shops").update(payload as never).eq("id", id).select("*").single();
    if (error) throw error;
    return mapShop(data as DbShop);
  },
  async setStatus(id: ID, status: Shop["status"]) { return this.update(id, { status }); },
};

// =========================
// Categories
// =========================
export const categoriesApi = {
  async list(): Promise<Category[]> {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) throw error;
    return (data as DbCategory[]).map(mapCategory);
  },
  async create(input: Omit<Category, "id">): Promise<Category> {
    const { data, error } = await supabase.from("categories").insert({
      slug: input.slug, name: input.name, name_ar: input.nameAr,
      icon: input.icon, image_url: input.imageUrl, parent_id: input.parentId,
    }).select("*").single();
    if (error) throw error;
    return mapCategory(data as DbCategory);
  },
  async update(id: ID, patch: Partial<Category>): Promise<Category> {
    const payload: Record<string, unknown> = {};
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.nameAr !== undefined) payload.name_ar = patch.nameAr;
    if (patch.slug !== undefined) payload.slug = patch.slug;
    if (patch.icon !== undefined) payload.icon = patch.icon;
    if (patch.imageUrl !== undefined) payload.image_url = patch.imageUrl;
    const { data, error } = await supabase.from("categories").update(payload as never).eq("id", id).select("*").single();
    if (error) throw error;
    return mapCategory(data as DbCategory);
  },
  async remove(id: ID): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  },
};

// =========================
// Products
// =========================
export interface ProductFilters {
  shopId?: ID; categoryId?: ID; search?: string;
  minPrice?: number; maxPrice?: number; status?: Product["status"];
}

export const productsApi = {
  async list(filters: ProductFilters = {}): Promise<Product[]> {
    let q = supabase.from("products").select("*, shops(name)").order("created_at", { ascending: false });
    if (filters.shopId) q = q.eq("shop_id", filters.shopId);
    if (filters.categoryId) q = q.eq("category_id", filters.categoryId);
    if (filters.status) q = q.eq("status", filters.status);
    else q = q.eq("status", "active");
    if (filters.minPrice != null) q = q.gte("price", filters.minPrice);
    if (filters.maxPrice != null) q = q.lte("price", filters.maxPrice);
    if (filters.search) q = q.ilike("name", `%${filters.search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return (data as DbProduct[]).map(mapProduct);
  },
  async listByIds(ids: ID[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const { data, error } = await supabase.from("products").select("*, shops(name)").in("id", ids);
    if (error) throw error;
    return (data as DbProduct[]).map(mapProduct);
  },
  async get(id: ID): Promise<Product | null> {
    const { data, error } = await supabase.from("products").select("*, shops(name)").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data as DbProduct) : null;
  },
  async create(input: Omit<Product, "id" | "createdAt" | "updatedAt" | "rating" | "reviewsCount">): Promise<Product> {
    const { data, error } = await supabase.from("products").insert({
      shop_id: input.shopId, category_id: input.categoryId ?? null,
      slug: input.slug, name: input.name, description: input.description,
      price: input.price, original_price: input.originalPrice,
      stock: input.stock, sku: input.sku,
      images: input.images.map(i => ({ id: i.id, url: i.url, alt: i.alt, position: i.position })),
      attributes: input.attributes ?? {},
      badge: input.badge, status: input.status,
    }).select("*, shops(name)").single();
    if (error) throw error;
    return mapProduct(data as DbProduct);
  },
  async update(id: ID, patch: Partial<Product>): Promise<Product> {
    const payload: Record<string, unknown> = {};
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.description !== undefined) payload.description = patch.description;
    if (patch.price !== undefined) payload.price = patch.price;
    if (patch.originalPrice !== undefined) payload.original_price = patch.originalPrice;
    if (patch.stock !== undefined) payload.stock = patch.stock;
    if (patch.sku !== undefined) payload.sku = patch.sku;
    if (patch.categoryId !== undefined) payload.category_id = patch.categoryId;
    if (patch.images !== undefined) payload.images = patch.images;
    if (patch.attributes !== undefined) payload.attributes = patch.attributes;
    if (patch.badge !== undefined) payload.badge = patch.badge;
    if (patch.status !== undefined) payload.status = patch.status;
    const { data, error } = await supabase.from("products").update(payload as never).eq("id", id).select("*, shops(name)").single();
    if (error) throw error;
    return mapProduct(data as DbProduct);
  },
  async remove(id: ID): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  },
};

// =========================
// Cart (panier local persistant)
// =========================
const calcCart = (): Cart => {
  const subtotal = local.cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 10000 ? 0 : 400;
  return { items: [...local.cart.items], subtotal, shipping, total: subtotal + shipping };
};
export const cartApi = {
  async get(): Promise<Cart> { return calcCart(); },
  async add(item: CartItem): Promise<Cart> {
    const existing = local.cart.items.find(i => i.productId === item.productId && i.variantId === item.variantId);
    if (existing) existing.quantity += item.quantity; else local.cart.items.push(item);
    persistCart(); return calcCart();
  },
  async updateQty(productId: ID, qty: number): Promise<Cart> {
    const it = local.cart.items.find(i => i.productId === productId);
    if (it) it.quantity = Math.max(1, qty);
    persistCart(); return calcCart();
  },
  async remove(productId: ID): Promise<Cart> {
    local.cart.items = local.cart.items.filter(i => i.productId !== productId);
    persistCart(); return calcCart();
  },
  async clear(): Promise<Cart> { local.cart.items = []; persistCart(); return calcCart(); },
};

// =========================
// Orders
// =========================
export interface CreateOrderInput {
  items: CartItem[];
  shippingAddress: Address;
  deliveryMode: Order["deliveryMode"];
  paymentMethod: Order["paymentMethod"];
  shippingFee: number;
  discount?: number;
  notes?: string;
}

export const ordersApi = {
  async list(filters: { userId?: ID; shopId?: ID; status?: OrderStatus } = {}): Promise<Order[]> {
    let q = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (filters.userId) q = q.eq("user_id", filters.userId);
    if (filters.status) q = q.eq("status", filters.status);
    const { data, error } = await q;
    if (error) throw error;
    let rows = (data as unknown as DbOrder[]).map(mapOrder);
    if (filters.shopId) rows = rows.filter(o => o.items.some(i => i.shopId === filters.shopId));
    return rows;
  },
  async get(id: ID): Promise<Order | null> {
    const { data, error } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapOrder(data as unknown as DbOrder) : null;
  },
  async create(input: CreateOrderInput): Promise<Order> {
    const { data: session } = await supabase.auth.getUser();
    const userId = session.user?.id;
    if (!userId) throw new Error("Connexion requise pour passer commande");

    const subtotal = input.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const total = subtotal + input.shippingFee - (input.discount || 0);
    const number = `CMD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const { data: order, error: oErr } = await supabase.from("orders").insert({
      number, user_id: userId,
      customer_name: `${input.shippingAddress.firstName} ${input.shippingAddress.lastName}`,
      customer_phone: input.shippingAddress.phone,
      subtotal, shipping_fee: input.shippingFee,
      discount: input.discount || 0, total,
      shipping_address: input.shippingAddress as unknown as Record<string, unknown>,
      delivery_mode: input.deliveryMode,
      payment_method: input.paymentMethod,
      payment_status: input.paymentMethod === "cod" ? "unpaid" : "paid",
      status: "pending", notes: input.notes,
    }).select("*").single();
    if (oErr) throw oErr;

    const itemsPayload = input.items.map(i => ({
      order_id: order.id, product_id: i.productId, product_name: i.name,
      image_url: i.imageUrl, quantity: i.quantity, unit_price: i.unitPrice,
      total: i.unitPrice * i.quantity, shop_id: i.shopId, shop_name: i.shopName,
    }));
    const { error: iErr } = await supabase.from("order_items").insert(itemsPayload);
    if (iErr) throw iErr;

    local.cart.items = []; persistCart();
    const full = await this.get(order.id);
    return full!;
  },
  async updateStatus(id: ID, status: OrderStatus, _note?: string): Promise<Order> {
    const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select("*, order_items(*)").single();
    if (error) throw error;
    return mapOrder(data as unknown as DbOrder);
  },
};

// =========================
// Reviews
// =========================
export const reviewsApi = {
  async listByProduct(productId: ID): Promise<ProductReview[]> {
    const { data, error } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data as DbReview[]).map(mapReview);
  },
  async listAll(status?: ProductReview["status"]): Promise<ProductReview[]> {
    let q = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) throw error;
    return (data as DbReview[]).map(mapReview);
  },
  async create(input: Omit<ProductReview, "id" | "createdAt" | "status">): Promise<ProductReview> {
    const { data, error } = await supabase.from("reviews").insert({
      product_id: input.productId, user_id: input.userId,
      user_name: input.userName, rating: input.rating,
      comment: input.comment,
    }).select("*").single();
    if (error) throw error;
    return mapReview(data as DbReview);
  },
  async setStatus(id: ID, status: ProductReview["status"]): Promise<ProductReview> {
    const { data, error } = await supabase.from("reviews").update({ status }).eq("id", id).select("*").single();
    if (error) throw error;
    return mapReview(data as DbReview);
  },
};

// =========================
// Addresses
// =========================
export const addressesApi = {
  async list(_userId = "current"): Promise<Address[]> {
    const { data, error } = await supabase.from("addresses").select("*").order("is_default", { ascending: false });
    if (error) throw error;
    return (data as DbAddress[]).map(mapAddress);
  },
  async create(input: Omit<Address, "id">): Promise<Address> {
    const { data: session } = await supabase.auth.getUser();
    const userId = session.user?.id;
    if (!userId) throw new Error("Connexion requise");
    if (input.isDefault) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    }
    const { data, error } = await supabase.from("addresses").insert({
      user_id: userId, label: input.label,
      first_name: input.firstName, last_name: input.lastName, phone: input.phone,
      street: input.street, commune: input.commune, wilaya: input.wilaya,
      postal_code: input.postalCode, is_default: input.isDefault,
    }).select("*").single();
    if (error) throw error;
    return mapAddress(data as DbAddress);
  },
  async update(id: ID, patch: Partial<Address>): Promise<Address> {
    const payload: Record<string, unknown> = {};
    if (patch.label !== undefined) payload.label = patch.label;
    if (patch.firstName !== undefined) payload.first_name = patch.firstName;
    if (patch.lastName !== undefined) payload.last_name = patch.lastName;
    if (patch.phone !== undefined) payload.phone = patch.phone;
    if (patch.street !== undefined) payload.street = patch.street;
    if (patch.commune !== undefined) payload.commune = patch.commune;
    if (patch.wilaya !== undefined) payload.wilaya = patch.wilaya;
    if (patch.postalCode !== undefined) payload.postal_code = patch.postalCode;
    if (patch.isDefault !== undefined) payload.is_default = patch.isDefault;
    if (patch.isDefault) {
      const { data: session } = await supabase.auth.getUser();
      if (session.user?.id) await supabase.from("addresses").update({ is_default: false }).eq("user_id", session.user.id);
    }
    const { data, error } = await supabase.from("addresses").update(payload as never).eq("id", id).select("*").single();
    if (error) throw error;
    return mapAddress(data as DbAddress);
  },
  async remove(id: ID): Promise<void> {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) throw error;
  },
};

// =========================
// Promotions / Wishlist / Page Builder — locaux (MVP)
// =========================
export const promotionsApi = {
  async list(shopId?: ID): Promise<Promotion[]> {
    return shopId ? local.promotions.filter(p => p.shopId === shopId || !p.shopId) : [...local.promotions];
  },
  async create(input: Omit<Promotion, "id" | "usedCount">): Promise<Promotion> {
    const p: Promotion = { ...input, id: uid("pr"), usedCount: 0 };
    local.promotions.unshift(p); return p;
  },
  async update(id: ID, patch: Partial<Promotion>): Promise<Promotion> {
    const p = local.promotions.find(x => x.id === id); if (!p) throw new Error("Promotion not found");
    Object.assign(p, patch); return p;
  },
  async remove(id: ID): Promise<void> { local.promotions = local.promotions.filter(p => p.id !== id); },
  async validateCode(code: string, subtotal: number): Promise<Promotion | null> {
    const p = local.promotions.find(x => x.code.toUpperCase() === code.toUpperCase() && x.active);
    if (!p) return null;
    if (p.minOrder && subtotal < p.minOrder) return null;
    return p;
  },
};

export const wishlistApi = {
  async list(): Promise<WishlistItem[]> { return [...local.wishlist]; },
  async toggle(productId: ID): Promise<WishlistItem[]> {
    const i = local.wishlist.findIndex(w => w.productId === productId);
    if (i >= 0) local.wishlist.splice(i, 1);
    else local.wishlist.push({ productId, addedAt: new Date().toISOString() });
    persistWish(); return [...local.wishlist];
  },
};

export const pageBuilderApi = {
  async getByShop(shopId: ID): Promise<ShopPage> {
    let page = local.shopPages.find(p => p.shopId === shopId);
    if (!page) {
      page = { id: uid("sp"), shopId, blocks: [], updatedAt: new Date().toISOString() };
      local.shopPages.push(page);
    }
    return page;
  },
  async save(shopId: ID, blocks: PageBlock[]): Promise<ShopPage> {
    let page = local.shopPages.find(p => p.shopId === shopId);
    if (!page) {
      page = { id: uid("sp"), shopId, blocks, updatedAt: new Date().toISOString() };
      local.shopPages.push(page);
    } else { page.blocks = blocks; page.updatedAt = new Date().toISOString(); }
    return page;
  },
};

// =========================
// Stats / Analytics — calculées côté client
// =========================
export const analyticsApi = {
  async vendorStats(shopId: ID) {
    const [products, orders] = await Promise.all([
      productsApi.list({ shopId, status: undefined }),
      ordersApi.list({ shopId }),
    ]);
    const revenue = orders.reduce(
      (s, o) => s + o.items.filter(i => i.shopId === shopId).reduce((ss, i) => ss + i.total, 0),
      0
    );
    return {
      revenue, orders: orders.length, products: products.length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      lowStock: products.filter(p => p.stock <= (p.minStock || 5)).length,
      sales7d: Array.from({ length: 7 }).map((_, i) => ({
        day: i, value: Math.round(revenue / 7 * (0.5 + Math.random())),
      })),
    };
  },
  async adminStats() {
    const [shops, products, orders] = await Promise.all([
      shopsApi.list(), productsApi.list({ status: undefined }), ordersApi.list(),
    ]);
    return {
      shops: shops.length,
      activeShops: shops.filter(s => s.status === "active").length,
      pendingShops: shops.filter(s => s.status === "pending").length,
      products: products.length,
      orders: orders.length,
      revenue: orders.reduce((s, o) => s + o.total, 0),
    };
  },
};
