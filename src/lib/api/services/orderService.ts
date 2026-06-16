// ============================================================
// orderService — façade frontend pour la ressource Commandes.
//
// Endpoints Spring Boot attendus :
//   GET    /api/orders?userId=&shopId=&status=
//   GET    /api/orders/{id}
//   POST   /api/orders                       body: CreateOrderInput
//   PATCH  /api/orders/{id}/status           body: { status, note? }
// ============================================================

import { http, USE_MOCK } from "@/lib/api/http";
import { ordersApi, type CreateOrderInput } from "@/lib/api";
import type { Order, OrderStatus, ID } from "@/types/marketplace";

export type { CreateOrderInput };

interface ListFilters {
  userId?: ID;
  shopId?: ID;
  status?: OrderStatus;
}

export const orderService = {
  list(filters: ListFilters = {}): Promise<Order[]> {
    if (USE_MOCK) return ordersApi.list(filters);
    return http.get<Order[]>("/orders", { query: filters });
  },

  get(id: ID): Promise<Order | null> {
    if (USE_MOCK) return ordersApi.get(id);
    return http.get<Order | null>(`/orders/${id}`);
  },

  create(input: CreateOrderInput): Promise<Order> {
    if (USE_MOCK) return ordersApi.create(input);
    return http.post<Order>("/orders", input);
  },

  updateStatus(id: ID, status: OrderStatus, note?: string): Promise<Order> {
    if (USE_MOCK) return ordersApi.updateStatus(id, status, note);
    return http.patch<Order>(`/orders/${id}/status`, { status, note });
  },
};
