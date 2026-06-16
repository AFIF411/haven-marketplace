// ============================================================
// Barrel des services API — point d'entrée unique côté composants.
//
// Usage dans une page :
//   import { productService, orderService } from "@/lib/api/services";
//   const products = await productService.list({ shopId: "s1" });
// ============================================================

export { http, USE_MOCK, API_BASE_URL, ApiError } from "@/lib/api/http";

export { productService, type ProductFilters } from "./productService";
export { categoryService } from "./categoryService";
export { orderService, type CreateOrderInput } from "./orderService";
export { customerService, type CustomerProfilePatch } from "./customerService";
export { shopService } from "./shopService";
export { authService, type LoginDto, type RegisterDto, type AuthUser, type AuthResponse } from "./authService";
