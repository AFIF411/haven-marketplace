// ============================================================
// categoryService — façade frontend pour la ressource Catégories.
//
// Endpoints Spring Boot attendus :
//   GET    /api/categories
//   POST   /api/categories          body: CategoryCreateDto
//   PUT    /api/categories/{id}     body: CategoryUpdateDto
//   DELETE /api/categories/{id}
// ============================================================

import { http, USE_MOCK } from "@/lib/api/http";
import { categoriesApi } from "@/lib/api";
import type { Category, ID } from "@/types/marketplace";

export const categoryService = {
  list(): Promise<Category[]> {
    if (USE_MOCK) return categoriesApi.list();
    return http.get<Category[]>("/categories");
  },

  create(input: Omit<Category, "id">): Promise<Category> {
    if (USE_MOCK) return categoriesApi.create(input);
    return http.post<Category>("/categories", input);
  },

  update(id: ID, patch: Partial<Category>): Promise<Category> {
    if (USE_MOCK) return categoriesApi.update(id, patch);
    return http.put<Category>(`/categories/${id}`, patch);
  },

  remove(id: ID): Promise<void> {
    if (USE_MOCK) return categoriesApi.remove(id);
    return http.delete<void>(`/categories/${id}`);
  },
};
