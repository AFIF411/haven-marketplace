// ============================================================
// Façade API frontend — données en mémoire (mocks).
// Remplacer chaque méthode par fetch() vers ton backend Postgres.
// Toutes les méthodes sont async pour faciliter la migration.
// ============================================================

import type {
  Shop, Category, Product, Order, OrderStatus, Promotion,
  ProductReview, Address, Cart, CartItem, ShopPage, PageBlock, ID,
  WishlistItem,
} from "@/types/marketplace";
import {
  seedShops, seedCategories, seedProducts, seedOrders,
  seedPromotions, seedReviews, seedAddresses, seedShopPages,
} from "@/lib/mocks/seed";

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const uid = (p = "id") => `${p}-${Math.random().toString(36).slice(2, 10)}`;

// ---------- Stores en mémoire ----------
const db = {
  shops: clone(seedShops),
  categories: clone(seedCategories),
  products: clone(seedProducts),
  orders: clone(seedOrders),
  promotions: clone(seedPromotions),
  reviews: clone(seedReviews),
  addresses: clone(seedAddresses),
  shopPages: clone(seedShopPages),
  wishlist: [] as WishlistItem[],
  cart: {
    items: [
      {
        productId: "p1", name: "Sac en cuir artisanal tressé",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
        unitPrice: 8500, quantity: 1, shopId: "s1", shopName: "Artisan Cuir Alger",
      },
      {
        productId: "p3", name: "Bougie parfumée jasmin et ambre",
        imageUrl: "https://images.unsplash.com/photo-1602607700009-1b3e2f2426c5?w=600",
        unitPrice: 2200, quantity: 2, shopId: "s3", shopName: "L'Atelier des Sens",
      },
    ] as CartItem[],
  },
};

// =========================
// Shops
// =========================
export const shopsApi = {
  async list(): Promise<Shop[]> { await delay(); return clone(db.shops); },
  async get(id: ID): Promise<Shop | null> { await delay(); return clone(db.shops.find(s => s.id === id) || null); },
  async getBySlug(slug: string): Promise<Shop | null> { await delay(); return clone(db.shops.find(s => s.slug === slug) || null); },
  async update(id: ID, patch: Partial<Shop>): Promise<Shop> {
    await delay();
    const s = db.shops.find(x => x.id === id); if (!s) throw new Error("Shop not found");
    Object.assign(s, patch); return clone(s);
  },
  async setStatus(id: ID, status: Shop["status"]): Promise<Shop> { return this.update(id, { status }); },
};

// =========================
// Categories
// =========================
export const categoriesApi = {
  async list(): Promise<Category[]> { await delay(); return clone(db.categories); },
  async create(input: Omit<Category, "id">): Promise<Category> {
    await delay();
    const c: Category = { ...input, id: uid("c") }; db.categories.push(c); return clone(c);
  },
  async update(id: ID, patch: Partial<Category>): Promise<Category> {
    await delay();
    const c = db.categories.find(x => x.id === id); if (!c) throw new Error("Category not found");
    Object.assign(c, patch); return clone(c);
  },
  async remove(id: ID): Promise<void> { await delay(); db.categories = db.categories.filter(c => c.id !== id); },
};

// =========================
// Products
// =========================
export interface ProductFilters {
  shopId?: ID;
  categoryId?: ID;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: Product["status"];
}

export const productsApi = {
  async list(filters: ProductFilters = {}): Promise<Product[]> {
    await delay();
    let res = db.products;
    if (filters.shopId) res = res.filter(p => p.shopId === filters.shopId);
    if (filters.categoryId) res = res.filter(p => p.categoryId === filters.categoryId);
    if (filters.status) res = res.filter(p => p.status === filters.status);
    if (filters.minPrice != null) res = res.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice != null) res = res.filter(p => p.price <= filters.maxPrice!);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      res = res.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    return clone(res);
  },
  async listByIds(ids: ID[]): Promise<Product[]> {
    await delay();
    return clone(db.products.filter(p => ids.includes(p.id)));
  },
  async get(id: ID): Promise<Product | null> { await delay(); return clone(db.products.find(p => p.id === id) || null); },
  async create(input: Omit<Product, "id" | "createdAt" | "updatedAt" | "rating" | "reviewsCount">): Promise<Product> {
    await delay();
    const p: Product = { ...input, id: uid("p"), rating: 0, reviewsCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.products.unshift(p); return clone(p);
  },
  async update(id: ID, patch: Partial<Product>): Promise<Product> {
    await delay();
    const p = db.products.find(x => x.id === id); if (!p) throw new Error("Product not found");
    Object.assign(p, patch, { updatedAt: new Date().toISOString() }); return clone(p);
  },
  async remove(id: ID): Promise<void> { await delay(); db.products = db.products.filter(p => p.id !== id); },
};

// =========================
// Cart (panier local)
// =========================
const calcCart = (): Cart => {
  const subtotal = db.cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 10000 ? 0 : 400;
  return { items: clone(db.cart.items), subtotal, shipping, total: subtotal + shipping };
};

export const cartApi = {
  async get(): Promise<Cart> { await delay(50); return calcCart(); },
  async add(item: CartItem): Promise<Cart> {
    await delay(50);
    const existing = db.cart.items.find(i => i.productId === item.productId && i.variantId === item.variantId);
    if (existing) existing.quantity += item.quantity; else db.cart.items.push(item);
    return calcCart();
  },
  async updateQty(productId: ID, qty: number): Promise<Cart> {
    await delay(50);
    const it = db.cart.items.find(i => i.productId === productId);
    if (it) { it.quantity = Math.max(1, qty); }
    return calcCart();
  },
  async remove(productId: ID): Promise<Cart> {
    await delay(50);
    db.cart.items = db.cart.items.filter(i => i.productId !== productId);
    return calcCart();
  },
  async clear(): Promise<Cart> { await delay(50); db.cart.items = []; return calcCart(); },
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
    await delay();
    let res = db.orders;
    if (filters.userId) res = res.filter(o => o.userId === filters.userId);
    if (filters.shopId) res = res.filter(o => o.items.some(i => i.shopId === filters.shopId));
    if (filters.status) res = res.filter(o => o.status === filters.status);
    return clone(res);
  },
  async get(id: ID): Promise<Order | null> { await delay(); return clone(db.orders.find(o => o.id === id) || null); },
  async create(input: CreateOrderInput): Promise<Order> {
    await delay();
    const subtotal = input.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const num = `CMD-${new Date().getFullYear()}-${String(db.orders.length + 1).padStart(3, "0")}`;
    const order: Order = {
      id: uid("o"), number: num, userId: "current",
      customerName: `${input.shippingAddress.firstName} ${input.shippingAddress.lastName}`,
      customerPhone: input.shippingAddress.phone,
      items: input.items.map(i => ({ id: uid("oi"), productId: i.productId, productName: i.name, imageUrl: i.imageUrl, quantity: i.quantity, unitPrice: i.unitPrice, total: i.unitPrice * i.quantity, shopId: i.shopId, shopName: i.shopName })),
      subtotal, shippingFee: input.shippingFee, discount: input.discount || 0, total: subtotal + input.shippingFee - (input.discount || 0),
      shippingAddress: input.shippingAddress, deliveryMode: input.deliveryMode, paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "unpaid" : "paid", status: "pending",
      history: [{ status: "pending", at: new Date().toISOString() }],
      notes: input.notes, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    db.orders.unshift(order);
    db.cart.items = [];
    return clone(order);
  },
  async updateStatus(id: ID, status: OrderStatus, note?: string): Promise<Order> {
    await delay();
    const o = db.orders.find(x => x.id === id); if (!o) throw new Error("Order not found");
    o.status = status; o.updatedAt = new Date().toISOString();
    o.history.push({ status, at: o.updatedAt, note });
    return clone(o);
  },
};

// =========================
// Reviews
// =========================
export const reviewsApi = {
  async listByProduct(productId: ID): Promise<ProductReview[]> { await delay(); return clone(db.reviews.filter(r => r.productId === productId)); },
  async listAll(status?: ProductReview["status"]): Promise<ProductReview[]> {
    await delay();
    return clone(status ? db.reviews.filter(r => r.status === status) : db.reviews);
  },
  async create(input: Omit<ProductReview, "id" | "createdAt" | "status">): Promise<ProductReview> {
    await delay();
    const r: ProductReview = { ...input, id: uid("r"), status: "pending", createdAt: new Date().toISOString() };
    db.reviews.unshift(r); return clone(r);
  },
  async setStatus(id: ID, status: ProductReview["status"]): Promise<ProductReview> {
    await delay();
    const r = db.reviews.find(x => x.id === id); if (!r) throw new Error("Review not found");
    r.status = status; return clone(r);
  },
};

// =========================
// Addresses
// =========================
export const addressesApi = {
  async list(userId = "current"): Promise<Address[]> { await delay(); return clone(db.addresses.filter(a => a.userId === userId)); },
  async create(input: Omit<Address, "id">): Promise<Address> {
    await delay();
    if (input.isDefault) db.addresses.forEach(a => { if (a.userId === input.userId) a.isDefault = false; });
    const a: Address = { ...input, id: uid("a") }; db.addresses.push(a); return clone(a);
  },
  async update(id: ID, patch: Partial<Address>): Promise<Address> {
    await delay();
    const a = db.addresses.find(x => x.id === id); if (!a) throw new Error("Address not found");
    if (patch.isDefault) db.addresses.forEach(x => { if (x.userId === a.userId) x.isDefault = false; });
    Object.assign(a, patch); return clone(a);
  },
  async remove(id: ID): Promise<void> { await delay(); db.addresses = db.addresses.filter(a => a.id !== id); },
};

// =========================
// Promotions
// =========================
export const promotionsApi = {
  async list(shopId?: ID): Promise<Promotion[]> {
    await delay();
    return clone(shopId ? db.promotions.filter(p => p.shopId === shopId || !p.shopId) : db.promotions);
  },
  async create(input: Omit<Promotion, "id" | "usedCount">): Promise<Promotion> {
    await delay();
    const p: Promotion = { ...input, id: uid("pr"), usedCount: 0 }; db.promotions.unshift(p); return clone(p);
  },
  async update(id: ID, patch: Partial<Promotion>): Promise<Promotion> {
    await delay();
    const p = db.promotions.find(x => x.id === id); if (!p) throw new Error("Promotion not found");
    Object.assign(p, patch); return clone(p);
  },
  async remove(id: ID): Promise<void> { await delay(); db.promotions = db.promotions.filter(p => p.id !== id); },
  async validateCode(code: string, subtotal: number): Promise<Promotion | null> {
    await delay();
    const p = db.promotions.find(x => x.code.toUpperCase() === code.toUpperCase() && x.active);
    if (!p) return null;
    if (p.minOrder && subtotal < p.minOrder) return null;
    return clone(p);
  },
};

// =========================
// Wishlist
// =========================
export const wishlistApi = {
  async list(): Promise<WishlistItem[]> { await delay(); return clone(db.wishlist); },
  async toggle(productId: ID): Promise<WishlistItem[]> {
    await delay(50);
    const i = db.wishlist.findIndex(w => w.productId === productId);
    if (i >= 0) db.wishlist.splice(i, 1);
    else db.wishlist.push({ productId, addedAt: new Date().toISOString() });
    return clone(db.wishlist);
  },
};

// =========================
// Page Builder
// =========================
export const pageBuilderApi = {
  async getByShop(shopId: ID): Promise<ShopPage> {
    await delay();
    let page = db.shopPages.find(p => p.shopId === shopId);
    if (!page) {
      page = { id: uid("sp"), shopId, blocks: [], updatedAt: new Date().toISOString() };
      db.shopPages.push(page);
    }
    return clone(page);
  },
  async save(shopId: ID, blocks: PageBlock[]): Promise<ShopPage> {
    await delay();
    let page = db.shopPages.find(p => p.shopId === shopId);
    if (!page) {
      page = { id: uid("sp"), shopId, blocks, updatedAt: new Date().toISOString() };
      db.shopPages.push(page);
    } else {
      page.blocks = blocks; page.updatedAt = new Date().toISOString();
    }
    return clone(page);
  },
};

// =========================
// Stats / Analytics
// =========================
export const analyticsApi = {
  async vendorStats(shopId: ID) {
    await delay();
    const orders = db.orders.filter(o => o.items.some(i => i.shopId === shopId));
    const revenue = orders.reduce((s, o) => s + o.items.filter(i => i.shopId === shopId).reduce((ss, i) => ss + i.total, 0), 0);
    const products = db.products.filter(p => p.shopId === shopId);
    return {
      revenue, orders: orders.length, products: products.length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      lowStock: products.filter(p => p.stock <= (p.minStock || 5)).length,
      sales7d: Array.from({ length: 7 }).map((_, i) => ({ day: i, value: Math.round(revenue / 7 * (0.5 + Math.random())) })),
    };
  },
  async adminStats() {
    await delay();
    return {
      shops: db.shops.length,
      activeShops: db.shops.filter(s => s.status === "active").length,
      pendingShops: db.shops.filter(s => s.status === "pending").length,
      products: db.products.length,
      orders: db.orders.length,
      revenue: db.orders.reduce((s, o) => s + o.total, 0),
    };
  },
};
