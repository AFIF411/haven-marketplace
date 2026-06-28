import { useEffect, useState, useCallback } from "react";
import {
  shopsApi, productsApi, ordersApi, cartApi, categoriesApi,
  promotionsApi, reviewsApi, addressesApi, wishlistApi, analyticsApi,
  pageBuilderApi, type ProductFilters, type CreateOrderInput,
} from "@/lib/api";
import type {
  Shop, Product, Order, Cart, Category, Promotion, ProductReview,
  Address, OrderStatus, ShopPage, PageBlock, ID,
} from "@/types/marketplace";

// ---------- Generic helper ----------
function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const reload = useCallback(() => {
    setLoading(true);
    fn().then(d => { setData(d); setError(null); }).catch(e => setError(e as Error)).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { reload(); }, [reload]);
  return { data, loading, error, reload, setData };
}

// ---------- Shops ----------
export const useShops = () => useAsync<Shop[]>(() => shopsApi.list(), []);
export const useShop = (id: string | undefined) => useAsync<Shop | null>(() => id ? shopsApi.get(id) : Promise.resolve(null), [id]);
export const useShopBySlug = (slug: string | undefined) => useAsync<Shop | null>(() => slug ? shopsApi.getBySlug(slug) : Promise.resolve(null), [slug]);

// ---------- Products ----------
export const useProductsList = (filters: ProductFilters = {}) =>
  useAsync<Product[]>(() => productsApi.list(filters), [JSON.stringify(filters)]);
export const useProduct = (id: string | undefined) => useAsync<Product | null>(() => id ? productsApi.get(id) : Promise.resolve(null), [id]);
export const useProductsByIds = (ids: ID[]) => useAsync<Product[]>(() => productsApi.listByIds(ids), [ids.join(",")]);

// ---------- Categories ----------
export const useCategories = () => useAsync<Category[]>(() => categoriesApi.list(), []);

// ---------- Cart ----------
export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, shipping: 0, total: 0 });
  const refresh = useCallback(() => cartApi.get().then(setCart), []);
  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("cart:changed", handler);
    return () => window.removeEventListener("cart:changed", handler);
  }, [refresh]);
  const broadcast = (next: Cart) => {
    setCart(next);
    window.dispatchEvent(new CustomEvent("cart:changed"));
    return next;
  };
  return {
    cart,
    add: async (...args: Parameters<typeof cartApi.add>) => broadcast(await cartApi.add(...args)),
    updateQty: async (pid: ID, q: number) => broadcast(await cartApi.updateQty(pid, q)),
    remove: async (pid: ID) => broadcast(await cartApi.remove(pid)),
    clear: async () => broadcast(await cartApi.clear()),
    refresh,
  };
}

// ---------- Orders ----------
export const useOrders = (filters: { userId?: string; shopId?: string; status?: OrderStatus } = {}) =>
  useAsync<Order[]>(() => ordersApi.list(filters), [JSON.stringify(filters)]);
export const useOrder = (id: string | undefined) => useAsync<Order | null>(() => id ? ordersApi.get(id) : Promise.resolve(null), [id]);

// ---------- Addresses ----------
export const useAddresses = () => useAsync<Address[]>(() => addressesApi.list(), []);

// ---------- Promotions ----------
export const usePromotions = (shopId?: string) => useAsync<Promotion[]>(() => promotionsApi.list(shopId), [shopId]);

// ---------- Reviews ----------
export const useProductReviews = (productId: string | undefined) =>
  useAsync<ProductReview[]>(() => productId ? reviewsApi.listByProduct(productId) : Promise.resolve([]), [productId]);
export const useAllReviews = (status?: ProductReview["status"]) =>
  useAsync<ProductReview[]>(() => reviewsApi.listAll(status), [status]);

// ---------- Wishlist ----------
export function useWishlist() {
  const [items, setItems] = useState<{ productId: string; addedAt: string }[]>([]);
  useEffect(() => { wishlistApi.list().then(setItems); }, []);
  return {
    items,
    has: (pid: string) => items.some(i => i.productId === pid),
    toggle: async (pid: string) => setItems(await wishlistApi.toggle(pid)),
  };
}

// ---------- Analytics ----------
export const useVendorStats = (shopId: string | undefined) =>
  useAsync(() => shopId ? analyticsApi.vendorStats(shopId) : Promise.resolve(null), [shopId]);
export const useAdminStats = () => useAsync(() => analyticsApi.adminStats(), []);

// ---------- Page Builder ----------
export const useShopPage = (shopId: string | undefined) =>
  useAsync<ShopPage | null>(() => shopId ? pageBuilderApi.getByShop(shopId) : Promise.resolve(null), [shopId]);

export async function saveShopPage(shopId: string, blocks: PageBlock[]) {
  return pageBuilderApi.save(shopId, blocks);
}

// Re-export APIs pour usage direct
export { shopsApi, productsApi, ordersApi, cartApi, categoriesApi, promotionsApi, reviewsApi, addressesApi, wishlistApi, analyticsApi, pageBuilderApi };
export type { CreateOrderInput };
