// ============================================================
// shopService — façade frontend pour la ressource Boutiques.
//
// Endpoints Spring Boot attendus :
//   GET    /api/shops
//   GET    /api/shops/{id}
//   GET    /api/shops/by-slug/{slug}
//   PUT    /api/shops/{id}              body: ShopUpdateDto
//   PATCH  /api/shops/{id}/status       body: { status: ShopStatus }
// ============================================================

import { http, USE_MOCK } from "@/lib/api/http";
import { shopsApi } from "@/lib/api";
import type { Shop, ID } from "@/types/marketplace";

export const shopService = {
  list(): Promise<Shop[]> {
    if (USE_MOCK) return shopsApi.list();
    return http.get<Shop[]>("/shops");
  },

  get(id: ID): Promise<Shop | null> {
    if (USE_MOCK) return shopsApi.get(id);
    return http.get<Shop | null>(`/shops/${id}`);
  },

  getBySlug(slug: string): Promise<Shop | null> {
    if (USE_MOCK) return shopsApi.getBySlug(slug);
    return http.get<Shop | null>(`/shops/by-slug/${encodeURIComponent(slug)}`);
  },

  update(id: ID, patch: Partial<Shop>): Promise<Shop> {
    if (USE_MOCK) return shopsApi.update(id, patch);
    return http.put<Shop>(`/shops/${id}`, patch);
  },

  setStatus(id: ID, status: Shop["status"]): Promise<Shop> {
    if (USE_MOCK) return shopsApi.setStatus(id, status);
    return http.patch<Shop>(`/shops/${id}/status`, { status });
  },
};
