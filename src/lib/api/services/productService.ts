// ============================================================
// productService — façade frontend pour la ressource Produits.
//
// Switch automatique :
//   - USE_MOCK = true  -> délègue aux mocks locaux (productsApi)
//   - USE_MOCK = false -> appelle l'API Spring Boot via http
//
// Endpoints Spring Boot attendus :
//   GET    /api/products?shopId=&categoryId=&search=&minPrice=&maxPrice=&status=
//   GET    /api/products/{id}
//   POST   /api/products/by-ids        body: { ids: string[] }
//   POST   /api/products                body: ProductCreateDto
//   PUT    /api/products/{id}           body: ProductUpdateDto
//   DELETE /api/products/{id}
// ============================================================

import { http, USE_MOCK } from "@/lib/api/http";
import { productsApi, type ProductFilters } from "@/lib/api";
import type { Product, ID } from "@/types/marketplace";

export type { ProductFilters };

export const productService = {
  list(filters: ProductFilters = {}): Promise<Product[]> {
    if (USE_MOCK) return productsApi.list(filters);
    return http.get<Product[]>("/products", { query: filters as Record<string, string | number | undefined> });
  },

  listByIds(ids: ID[]): Promise<Product[]> {
    if (USE_MOCK) return productsApi.listByIds(ids);
    return http.post<Product[]>("/products/by-ids", { ids });
  },

  get(id: ID): Promise<Product | null> {
    if (USE_MOCK) return productsApi.get(id);
    return http.get<Product | null>(`/products/${id}`);
  },

  create(input: Parameters<typeof productsApi.create>[0]): Promise<Product> {
    if (USE_MOCK) return productsApi.create(input);
    return http.post<Product>("/products", input);
  },

  update(id: ID, patch: Partial<Product>): Promise<Product> {
    if (USE_MOCK) return productsApi.update(id, patch);
    return http.put<Product>(`/products/${id}`, patch);
  },

  remove(id: ID): Promise<void> {
    if (USE_MOCK) return productsApi.remove(id);
    return http.delete<void>(`/products/${id}`);
  },
};
