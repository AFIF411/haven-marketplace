# API Contract — Souk DZ

Contrat d'API entre le frontend React (Vite + TypeScript) et le backend **Spring Boot** pour la plateforme e-commerce SaaS multi-boutiques **Souk DZ**.

---

## 1. Introduction

### Objectif
Ce document définit l'ensemble des endpoints REST que le backend Spring Boot doit exposer pour que le frontend fonctionne sans modification. Il sert également de référence pour les développeurs backend (DTO, codes HTTP, exemples).

### Configuration
- **Base URL** : `http://localhost:8080/api`
- **Format** : `application/json` (UTF-8)
- **Authentification** : JWT via header `Authorization: Bearer <token>`
- **CORS** : autoriser l'origine du frontend (`http://localhost:8080` ou domaine de prod)
- **Mocks** : tant que `VITE_USE_MOCK=true` dans `.env.local`, le frontend utilise les mocks locaux (`src/lib/mocks/*`). Passer à `VITE_USE_MOCK=false` pour basculer sur le backend.

### Contexte métier
- Marketplace multi-boutiques (chaque vendeur gère sa boutique).
- Devise : **DZD** (Dinar algérien).
- Livraison par **wilaya** (58 wilayas).
- Modes de paiement : **Paiement à la livraison (COD)**, **CIB**, **Edahabia**, **BaridiMob**, **CCP**.
- Bilingue **FR / AR**.

---

## 2. Authentification

### `POST /auth/login`
Authentifie un utilisateur et retourne un JWT.

**Request — `LoginRequest`**
```json
{
  "email": "client@souk.dz",
  "password": "Password123!"
}
```

**Response 200 — `LoginResponse`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "u_1",
    "email": "client@souk.dz",
    "name": "Ahmed Benali",
    "role": "CLIENT",
    "phone": "+213 555 12 34 56",
    "createdAt": "2026-01-10T10:00:00Z"
  }
}
```

### `POST /auth/register`
**Request — `RegisterRequest`**
```json
{
  "email": "vendor@souk.dz",
  "password": "Password123!",
  "name": "Boutique Alger",
  "role": "VENDOR",
  "phone": "+213 555 00 00 00"
}
```
**Response 201** : identique à `LoginResponse`.

### `GET /auth/me`
Retourne l'utilisateur connecté (JWT requis).
**Response 200** : objet `User`.

### `POST /auth/logout`
Invalide le token côté serveur (blacklist optionnel).
**Response 204** : pas de contenu.

---

## 3. Boutiques (`/shops`)

| Méthode | URL | Rôle | Description |
|---|---|---|---|
| GET | `/shops` | public | Liste paginée des boutiques |
| GET | `/shops/{id}` | public | Détails d'une boutique |
| POST | `/shops` | VENDOR/ADMIN | Création |
| PUT | `/shops/{id}` | VENDOR (owner) / ADMIN | Mise à jour |
| DELETE | `/shops/{id}` | ADMIN | Suppression |

**Query params (GET /shops)** : `page`, `size`, `search`, `category`, `wilaya`, `sort`.

**`Shop` DTO**
```json
{
  "id": "sh_1",
  "name": "Boutique Alger",
  "slug": "boutique-alger",
  "description": "Vêtements traditionnels",
  "logoUrl": "https://...",
  "coverUrl": "https://...",
  "ownerId": "u_2",
  "wilaya": "Alger",
  "rating": 4.7,
  "productCount": 124,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

## 4. Produits (`/products`)

| Méthode | URL | Rôle | Description |
|---|---|---|---|
| GET | `/products` | public | Liste paginée + filtres |
| GET | `/products/{id}` | public | Détails |
| GET | `/products?shopId={id}` | public | Produits d'une boutique |
| POST | `/products` | VENDOR | Création |
| PUT | `/products/{id}` | VENDOR (owner) | Mise à jour |
| DELETE | `/products/{id}` | VENDOR (owner) / ADMIN | Suppression |

**Query params** : `page`, `size`, `shopId`, `categoryId`, `search`, `minPrice`, `maxPrice`, `minRating`, `sort` (`price_asc`, `price_desc`, `rating`, `newest`).

**`Product` DTO**
```json
{
  "id": "p_1",
  "shopId": "sh_1",
  "categoryId": "c_1",
  "name": "Robe kabyle",
  "slug": "robe-kabyle",
  "description": "Robe traditionnelle...",
  "price": 12500,
  "compareAtPrice": 15000,
  "currency": "DZD",
  "stock": 24,
  "images": ["https://..."],
  "rating": 4.5,
  "reviewCount": 32,
  "active": true,
  "createdAt": "2026-02-01T10:00:00Z"
}
```

---

## 5. Catégories (`/categories`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/categories` | Liste globale (arbre ou plat) |
| GET | `/categories/{id}` | Détails |
| GET | `/categories?shopId={id}` | Catégories d'une boutique |
| POST | `/categories` | Création (VENDOR/ADMIN) |
| PUT | `/categories/{id}` | Mise à jour |
| DELETE | `/categories/{id}` | Suppression |

**`Category` DTO**
```json
{
  "id": "c_1",
  "name": "Mode",
  "slug": "mode",
  "parentId": null,
  "shopId": null,
  "iconUrl": "https://...",
  "productCount": 240
}
```

---

## 6. Commandes (`/orders`)

| Méthode | URL | Rôle | Description |
|---|---|---|---|
| GET | `/orders` | auth | Commandes du user connecté |
| GET | `/orders/{id}` | auth | Détails |
| GET | `/orders?shopId={id}` | VENDOR | Commandes d'une boutique |
| POST | `/orders` | CLIENT | Création |
| PUT | `/orders/{id}/status` | VENDOR/ADMIN | Changement de statut |
| DELETE | `/orders/{id}` | ADMIN | Suppression |

**Statuts** : `PENDING`, `CONFIRMED`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`.

**Paiements** : `COD` (à la livraison), `CIB`, `EDAHABIA`, `BARIDIMOB`, `CCP`.

**`Order` DTO**
```json
{
  "id": "o_1",
  "userId": "u_1",
  "shopId": "sh_1",
  "status": "PENDING",
  "paymentMethod": "COD",
  "paymentStatus": "UNPAID",
  "subtotal": 25000,
  "shippingFee": 600,
  "total": 25600,
  "currency": "DZD",
  "items": [
    {
      "productId": "p_1",
      "name": "Robe kabyle",
      "price": 12500,
      "quantity": 2,
      "imageUrl": "https://..."
    }
  ],
  "shippingAddress": {
    "fullName": "Ahmed Benali",
    "phone": "+213 555 12 34 56",
    "wilaya": "Alger",
    "commune": "Bab Ezzouar",
    "street": "Cité 123",
    "postalCode": "16000"
  },
  "createdAt": "2026-06-16T10:00:00Z"
}
```

**Changement de statut** — `PUT /orders/{id}/status`
```json
{ "status": "SHIPPED", "trackingNumber": "DZ123456" }
```

---

## 7. Clients (`/customers`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/customers` | ADMIN — liste globale |
| GET | `/customers/{id}` | Détails |
| GET | `/customers?shopId={id}` | VENDOR — clients d'une boutique |
| POST | `/customers` | Création manuelle |
| PUT | `/customers/{id}` | Mise à jour |
| DELETE | `/customers/{id}` | Suppression |

**`Customer` DTO**
```json
{
  "id": "cu_1",
  "userId": "u_1",
  "name": "Ahmed Benali",
  "email": "ahmed@mail.dz",
  "phone": "+213 555 12 34 56",
  "wilaya": "Alger",
  "totalOrders": 5,
  "totalSpent": 87500,
  "createdAt": "2026-01-15T10:00:00Z"
}
```

---

## 8. Panier (`/cart`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/cart` | Panier du user connecté |
| POST | `/cart/items` | Ajouter un item |
| PUT | `/cart/items/{id}` | Modifier quantité |
| DELETE | `/cart/items/{id}` | Retirer un item |
| DELETE | `/cart` | Vider le panier |

**`Cart` DTO**
```json
{
  "id": "ca_1",
  "userId": "u_1",
  "items": [
    { "id": "ci_1", "productId": "p_1", "name": "Robe kabyle", "price": 12500, "quantity": 2, "imageUrl": "https://..." }
  ],
  "subtotal": 25000,
  "currency": "DZD"
}
```

---

## 9. Wishlist (`/wishlist`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/wishlist` | Liste de souhaits du user |
| POST | `/wishlist` | Ajouter (`{ "productId": "p_1" }`) |
| DELETE | `/wishlist/{productId}` | Retirer |

---

## 10. Adresses (`/addresses`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/addresses` | Adresses du user |
| POST | `/addresses` | Création |
| PUT | `/addresses/{id}` | Mise à jour |
| DELETE | `/addresses/{id}` | Suppression |

**`Address` DTO**
```json
{
  "id": "ad_1",
  "userId": "u_1",
  "fullName": "Ahmed Benali",
  "phone": "+213 555 12 34 56",
  "wilaya": "Alger",
  "communeOrCity": "Bab Ezzouar",
  "street": "Cité 123",
  "postalCode": "16000",
  "isDefault": true
}
```

---

## 11. Livraison (`/shipping/zones`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/shipping/zones` | Liste des zones (wilayas tarifées) |
| POST | `/shipping/zones` | Création (VENDOR/ADMIN) |
| PUT | `/shipping/zones/{id}` | Mise à jour |
| DELETE | `/shipping/zones/{id}` | Suppression |

**`ShippingZone` DTO**
```json
{
  "id": "sz_1",
  "shopId": "sh_1",
  "wilaya": "Alger",
  "homeDeliveryFee": 600,
  "deskDeliveryFee": 400,
  "estimatedDays": 2,
  "active": true
}
```

---

## 12. Analytics (`/analytics`)

| Méthode | URL | Rôle | Description |
|---|---|---|---|
| GET | `/analytics/overview` | VENDOR/ADMIN | KPIs (CA, commandes, clients) |
| GET | `/analytics/sales` | VENDOR/ADMIN | Séries temporelles de ventes |
| GET | `/analytics/products` | VENDOR/ADMIN | Top produits |

**Query** : `shopId`, `from`, `to`, `granularity` (`day` / `week` / `month`).

**Exemple `/analytics/overview`**
```json
{
  "revenue": 1250000,
  "orders": 87,
  "customers": 54,
  "averageOrderValue": 14367,
  "currency": "DZD",
  "trend": { "revenue": 12.4, "orders": 8.1 }
}
```

---

## 13. Promotions (`/promotions`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/promotions` | Liste (avec `?shopId=`) |
| GET | `/promotions/{id}` | Détails |
| POST | `/promotions` | Création |
| PUT | `/promotions/{id}` | Mise à jour |
| DELETE | `/promotions/{id}` | Suppression |
| POST | `/promotions/validate` | Valider un code (`{ "code": "RAMADAN10" }`) |

**`Promotion` DTO**
```json
{
  "id": "pr_1",
  "shopId": "sh_1",
  "code": "RAMADAN10",
  "type": "PERCENTAGE",
  "value": 10,
  "minOrder": 5000,
  "startsAt": "2026-03-01T00:00:00Z",
  "endsAt": "2026-04-01T00:00:00Z",
  "usageLimit": 100,
  "usageCount": 12,
  "active": true
}
```

---

## 14. Avis (`/reviews`)

| Méthode | URL | Description |
|---|---|---|
| GET | `/reviews?productId={id}` | Avis d'un produit |
| GET | `/reviews?shopId={id}` | Avis d'une boutique |
| POST | `/reviews` | Création (CLIENT, après achat) |
| PUT | `/reviews/{id}` | Mise à jour (auteur) |
| DELETE | `/reviews/{id}` | Suppression (auteur/ADMIN) |

**`Review` DTO**
```json
{
  "id": "rv_1",
  "productId": "p_1",
  "userId": "u_1",
  "authorName": "Ahmed B.",
  "rating": 5,
  "comment": "Très bonne qualité, livraison rapide.",
  "createdAt": "2026-05-10T10:00:00Z"
}
```

---

## 15. Codes HTTP

| Code | Sens | Quand l'utiliser |
|---|---|---|
| 200 | OK | GET / PUT réussis |
| 201 | Created | POST avec création de ressource |
| 204 | No Content | DELETE ou logout réussi |
| 400 | Bad Request | Validation échouée (DTO invalide) |
| 401 | Unauthorized | Token absent ou invalide |
| 403 | Forbidden | Authentifié mais sans droits |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Doublon (email déjà utilisé, stock insuffisant) |
| 422 | Unprocessable Entity | Règle métier violée |
| 500 | Internal Server Error | Erreur serveur non gérée |

### Format standard des erreurs (Spring Boot)
```json
{
  "timestamp": "2026-06-16T10:23:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Le champ 'email' est invalide",
  "path": "/api/auth/register",
  "fieldErrors": {
    "email": "must be a well-formed email address",
    "password": "size must be between 8 and 64"
  }
}
```

---

## 16. DTOs — TypeScript ↔ Java

### `LoginRequest`
```ts
// TypeScript
interface LoginRequest { email: string; password: string; }
```
```java
// Java
public record LoginRequest(@Email String email, @NotBlank String password) {}
```

### `LoginResponse`
```ts
interface LoginResponse { token: string; expiresIn: number; user: User; }
```
```java
public record LoginResponse(String token, long expiresIn, UserDto user) {}
```

### `Product`
```ts
interface Product {
  id: string; shopId: string; categoryId: string;
  name: string; slug: string; description: string;
  price: number; compareAtPrice?: number; currency: 'DZD';
  stock: number; images: string[];
  rating: number; reviewCount: number; active: boolean;
  createdAt: string;
}
```
```java
public record ProductDto(
  UUID id, UUID shopId, UUID categoryId,
  String name, String slug, String description,
  BigDecimal price, BigDecimal compareAtPrice, String currency,
  Integer stock, List<String> images,
  Double rating, Integer reviewCount, Boolean active,
  Instant createdAt
) {}
```

### `Category`
```ts
interface Category { id: string; name: string; slug: string; parentId: string|null; shopId: string|null; iconUrl?: string; productCount: number; }
```
```java
public record CategoryDto(UUID id, String name, String slug, UUID parentId, UUID shopId, String iconUrl, Integer productCount) {}
```

### `Order` (extraits)
```ts
type OrderStatus = 'PENDING'|'CONFIRMED'|'PREPARING'|'SHIPPED'|'DELIVERED'|'CANCELLED'|'REFUNDED';
type PaymentMethod = 'COD'|'CIB'|'EDAHABIA'|'BARIDIMOB'|'CCP';
```
```java
public enum OrderStatus { PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, REFUNDED }
public enum PaymentMethod { COD, CIB, EDAHABIA, BARIDIMOB, CCP }
```

### `Customer`
```ts
interface Customer { id: string; userId: string; name: string; email: string; phone: string; wilaya: string; totalOrders: number; totalSpent: number; createdAt: string; }
```
```java
public record CustomerDto(UUID id, UUID userId, String name, String email, String phone, String wilaya, Integer totalOrders, BigDecimal totalSpent, Instant createdAt) {}
```

### `Shop`
```ts
interface Shop { id: string; name: string; slug: string; description: string; logoUrl?: string; coverUrl?: string; ownerId: string; wilaya: string; rating: number; productCount: number; createdAt: string; }
```
```java
public record ShopDto(UUID id, String name, String slug, String description, String logoUrl, String coverUrl, UUID ownerId, String wilaya, Double rating, Integer productCount, Instant createdAt) {}
```

---

## 17. Exemples JSON complets

### Création d'un produit — `POST /products`
**Request**
```json
{
  "shopId": "sh_1",
  "categoryId": "c_1",
  "name": "Burnous traditionnel",
  "description": "Burnous en laine, fabrication artisanale.",
  "price": 18500,
  "compareAtPrice": 22000,
  "currency": "DZD",
  "stock": 12,
  "images": ["https://cdn.souk.dz/p/burnous-1.jpg"],
  "active": true
}
```
**Response 201**
```json
{
  "id": "p_42",
  "shopId": "sh_1",
  "categoryId": "c_1",
  "name": "Burnous traditionnel",
  "slug": "burnous-traditionnel",
  "description": "Burnous en laine, fabrication artisanale.",
  "price": 18500,
  "compareAtPrice": 22000,
  "currency": "DZD",
  "stock": 12,
  "images": ["https://cdn.souk.dz/p/burnous-1.jpg"],
  "rating": 0,
  "reviewCount": 0,
  "active": true,
  "createdAt": "2026-06-16T10:30:00Z"
}
```

### Création d'une commande — `POST /orders`
**Request**
```json
{
  "shopId": "sh_1",
  "items": [
    { "productId": "p_1", "quantity": 2 },
    { "productId": "p_5", "quantity": 1 }
  ],
  "paymentMethod": "COD",
  "shippingAddressId": "ad_1",
  "promoCode": "RAMADAN10"
}
```
**Response 201**
```json
{
  "id": "o_128",
  "userId": "u_1",
  "shopId": "sh_1",
  "status": "PENDING",
  "paymentMethod": "COD",
  "paymentStatus": "UNPAID",
  "subtotal": 31000,
  "discount": 3100,
  "shippingFee": 600,
  "total": 28500,
  "currency": "DZD",
  "items": [
    { "productId": "p_1", "name": "Robe kabyle", "price": 12500, "quantity": 2, "imageUrl": "https://..." },
    { "productId": "p_5", "name": "Foulard", "price": 6000, "quantity": 1, "imageUrl": "https://..." }
  ],
  "shippingAddress": {
    "fullName": "Ahmed Benali", "phone": "+213 555 12 34 56",
    "wilaya": "Alger", "commune": "Bab Ezzouar", "street": "Cité 123", "postalCode": "16000"
  },
  "createdAt": "2026-06-16T10:35:00Z"
}
```

### Réponse de login — `POST /auth/login`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1XzEiLCJyb2xlIjoiQ0xJRU5UIn0.signature",
  "expiresIn": 3600,
  "user": {
    "id": "u_1",
    "email": "client@souk.dz",
    "name": "Ahmed Benali",
    "role": "CLIENT",
    "phone": "+213 555 12 34 56",
    "createdAt": "2026-01-10T10:00:00Z"
  }
}
```

### Erreur API (validation)
```json
{
  "timestamp": "2026-06-16T10:40:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation échouée",
  "path": "/api/products",
  "fieldErrors": {
    "price": "must be greater than 0",
    "name": "must not be blank"
  }
}
```

### Erreur — non authentifié
```json
{
  "timestamp": "2026-06-16T10:41:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token manquant ou invalide",
  "path": "/api/orders"
}
```

---

## 18. Convention Spring Boot recommandée

- **Package** : `dz.souk.api.{auth|shop|product|order|customer|cart|wishlist|address|shipping|analytics|promotion|review}`.
- **Layers** : `Controller` → `Service` → `Repository` (JPA) → `Entity`.
- **Validation** : `jakarta.validation` (`@Valid`, `@NotBlank`, `@Email`, `@Min`).
- **Mapping** : MapStruct entre `Entity` et `DTO`.
- **Sécurité** : Spring Security + filtre JWT (`OncePerRequestFilter`).
- **Pagination** : `Pageable` Spring (`?page=0&size=20&sort=createdAt,desc`) — le frontend attend une réponse de type :
```json
{ "content": [...], "totalElements": 120, "totalPages": 6, "size": 20, "number": 0 }
```
- **Documentation live** : exposer Swagger via `springdoc-openapi` sur `/swagger-ui.html`.

---

**Fin du contrat — version 1.0**
