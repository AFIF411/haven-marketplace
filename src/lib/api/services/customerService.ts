// ============================================================
// customerService — gestion des clients (profil + adresses).
//
// Endpoints Spring Boot attendus :
//   GET    /api/customers/me
//   PUT    /api/customers/me                 body: ProfileUpdateDto
//   GET    /api/customers/{userId}/addresses
//   POST   /api/customers/{userId}/addresses body: AddressCreateDto
//   PUT    /api/addresses/{id}               body: AddressUpdateDto
//   DELETE /api/addresses/{id}
// ============================================================

import { http, USE_MOCK } from "@/lib/api/http";
import { addressesApi } from "@/lib/api";
import type { Address, ID, UserAccount } from "@/types/marketplace";

export type CustomerProfilePatch = Partial<Pick<UserAccount, "firstName" | "lastName" | "email" | "phone" | "avatarUrl">>;

export const customerService = {
  // ----- Profil -----
  getMe(): Promise<UserAccount> {
    if (USE_MOCK) {
      // Le profil est géré par AuthContext en mock — pas d'endpoint local.
      return Promise.reject(new Error("getMe non disponible en mode mock — utilise useAuth().user"));
    }
    return http.get<UserAccount>("/customers/me");
  },

  updateProfile(patch: CustomerProfilePatch): Promise<UserAccount> {
    if (USE_MOCK) {
      return Promise.reject(new Error("updateProfile non disponible en mode mock — utilise useAuth().updateProfile"));
    }
    return http.put<UserAccount>("/customers/me", patch);
  },

  // ----- Adresses -----
  listAddresses(userId: ID = "current"): Promise<Address[]> {
    if (USE_MOCK) return addressesApi.list(userId);
    return http.get<Address[]>(`/customers/${userId}/addresses`);
  },

  createAddress(input: Omit<Address, "id">): Promise<Address> {
    if (USE_MOCK) return addressesApi.create(input);
    return http.post<Address>(`/customers/${input.userId}/addresses`, input);
  },

  updateAddress(id: ID, patch: Partial<Address>): Promise<Address> {
    if (USE_MOCK) return addressesApi.update(id, patch);
    return http.put<Address>(`/addresses/${id}`, patch);
  },

  removeAddress(id: ID): Promise<void> {
    if (USE_MOCK) return addressesApi.remove(id);
    return http.delete<void>(`/addresses/${id}`);
  },
};
