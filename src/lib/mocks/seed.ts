// ============================================================
// Données seed — toutes les entités marketplace
// 100 % en mémoire ; remplacer plus tard par appels API Postgres.
// ============================================================

import type {
  Shop, Category, Product, Order, Promotion, ProductReview, Address, ShopPage,
} from "@/types/marketplace";

const now = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const seedCategories: Category[] = [
  { id: "c1", parentId: null, slug: "electronique", name: "Électronique", nameAr: "إلكترونيات", icon: "💻", productsCount: 1240 },
  { id: "c2", parentId: null, slug: "mode", name: "Mode", nameAr: "أزياء", icon: "👗", productsCount: 3456 },
  { id: "c3", parentId: null, slug: "maison", name: "Maison", nameAr: "منزل", icon: "🏠", productsCount: 2100 },
  { id: "c4", parentId: null, slug: "beaute", name: "Beauté", nameAr: "جمال", icon: "✨", productsCount: 890 },
  { id: "c5", parentId: null, slug: "sports", name: "Sports", nameAr: "رياضة", icon: "⚽", productsCount: 670 },
  { id: "c6", parentId: null, slug: "alimentation", name: "Alimentation", nameAr: "غذاء", icon: "🍽️", productsCount: 1560 },
  { id: "c7", parentId: null, slug: "artisanat", name: "Artisanat", nameAr: "حرف يدوية", icon: "🎨", productsCount: 780 },
  { id: "c8", parentId: "c2", slug: "sacs", name: "Sacs", icon: "👜" },
  { id: "c9", parentId: "c2", slug: "chaussures", name: "Chaussures", icon: "👟" },
];

export const seedShops: Shop[] = [
  { id: "s1", ownerId: "u1", slug: "artisan-cuir-alger", name: "Artisan Cuir Alger", description: "Maroquinerie artisanale faite main à Alger.", logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200", coverUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200", category: "Maroquinerie", wilaya: "Alger", phone: "0555 11 22 33", email: "contact@artisancuir.dz", rc: "16/00-1234567 B 24", nif: "000016001234567", rating: 4.8, reviewsCount: 342, productsCount: 56, verified: true, status: "active", createdAt: daysAgo(180) },
  { id: "s2", ownerId: "u2", slug: "temps-naturel", name: "Temps Naturel DZ", description: "Montres en bois d'olivier algérien.", logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", coverUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200", category: "Horlogerie", wilaya: "Tizi Ouzou", phone: "0666 44 55 66", rating: 4.6, reviewsCount: 189, productsCount: 23, verified: true, status: "active", createdAt: daysAgo(120) },
  { id: "s3", ownerId: "u3", slug: "atelier-des-sens", name: "L'Atelier des Sens", description: "Bougies et parfums artisanaux.", logoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", coverUrl: "https://images.unsplash.com/photo-1602607700009-1b3e2f2426c5?w=1200", category: "Bien-être", wilaya: "Oran", rating: 4.9, reviewsCount: 567, productsCount: 34, verified: true, status: "active", createdAt: daysAgo(90) },
  { id: "s4", ownerId: "u4", slug: "terre-et-feu", name: "Terre & Feu", description: "Céramique traditionnelle.", logoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", coverUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200", category: "Céramique", wilaya: "Tlemcen", rating: 4.7, reviewsCount: 145, productsCount: 42, verified: false, status: "pending", createdAt: daysAgo(45) },
];

const img = (url: string, position = 0) => ({ id: `img-${Math.random().toString(36).slice(2, 8)}`, url, position });

export const seedProducts: Product[] = [
  { id: "p1", shopId: "s1", shopName: "Artisan Cuir Alger", categoryId: "c8", slug: "sac-cuir-tresse", name: "Sac en cuir artisanal tressé", description: "Sac en cuir véritable tressé à la main, finition premium.", price: 8500, originalPrice: 10500, stock: 12, minStock: 3, sku: "AC-001", images: [img("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600")], rating: 4.8, reviewsCount: 124, badge: "Bestseller", status: "active", createdAt: daysAgo(30), updatedAt: now() },
  { id: "p2", shopId: "s2", shopName: "Temps Naturel DZ", categoryId: "c1", slug: "montre-bois-olivier", name: "Montre minimaliste en bois d'olivier", price: 5900, stock: 8, sku: "TN-014", images: [img("https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600")], rating: 4.6, reviewsCount: 89, status: "active", createdAt: daysAgo(20), updatedAt: now() },
  { id: "p3", shopId: "s3", shopName: "L'Atelier des Sens", categoryId: "c4", slug: "bougie-jasmin-ambre", name: "Bougie parfumée jasmin et ambre", price: 2200, originalPrice: 2800, stock: 45, sku: "AS-022", images: [img("https://images.unsplash.com/photo-1602607700009-1b3e2f2426c5?w=600")], rating: 4.9, reviewsCount: 256, badge: "Nouveau", status: "active", createdAt: daysAgo(7), updatedAt: now() },
  { id: "p4", shopId: "s4", shopName: "Terre & Feu", categoryId: "c3", slug: "bol-ceramique", name: "Céramique fait-main bol traditionnel", price: 3000, stock: 22, sku: "TF-008", images: [img("https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600")], rating: 4.7, reviewsCount: 67, status: "active", createdAt: daysAgo(60), updatedAt: now() },
  { id: "p5", shopId: "s1", shopName: "Artisan Cuir Alger", categoryId: "c2", slug: "ceinture-cuir", name: "Ceinture cuir véritable noire", price: 3500, stock: 30, sku: "AC-009", images: [img("https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600")], rating: 4.5, reviewsCount: 43, status: "active", createdAt: daysAgo(15), updatedAt: now() },
  { id: "p6", shopId: "s3", shopName: "L'Atelier des Sens", categoryId: "c4", slug: "huile-essentielle-rose", name: "Huile essentielle de rose", price: 1800, stock: 60, sku: "AS-031", images: [img("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600")], rating: 4.8, reviewsCount: 312, status: "active", createdAt: daysAgo(40), updatedAt: now() },
];

export const seedReviews: ProductReview[] = [
  { id: "r1", productId: "p1", userId: "u10", userName: "Mohamed B.", rating: 5, comment: "Excellente qualité, livraison rapide.", status: "approved", createdAt: daysAgo(5) },
  { id: "r2", productId: "p1", userId: "u11", userName: "Amina K.", rating: 4, comment: "Très beau sac, conforme à la description.", status: "approved", createdAt: daysAgo(12) },
  { id: "r3", productId: "p3", userId: "u12", userName: "Yasmine L.", rating: 5, comment: "Parfum divin, je recommande !", status: "pending", createdAt: daysAgo(2) },
];

export const seedAddresses: Address[] = [
  { id: "a1", userId: "current", label: "Maison", firstName: "Mohamed", lastName: "Benali", phone: "0555 12 34 56", street: "Cité 5 Juillet, Bt 12", commune: "Bab Ezzouar", wilaya: "Alger", isDefault: true },
  { id: "a2", userId: "current", label: "Bureau", firstName: "Mohamed", lastName: "Benali", phone: "0555 12 34 56", street: "Avenue Pasteur 23", commune: "Sidi M'Hamed", wilaya: "Alger", isDefault: false },
];

export const seedOrders: Order[] = [
  {
    id: "o1", number: "CMD-2024-001", userId: "current", customerName: "Mohamed Benali", customerPhone: "0555 12 34 56",
    items: [
      { id: "oi1", productId: "p1", productName: "Sac en cuir artisanal tressé", imageUrl: seedProducts[0].images[0].url, quantity: 1, unitPrice: 8500, total: 8500, shopId: "s1", shopName: "Artisan Cuir Alger" },
      { id: "oi2", productId: "p3", productName: "Bougie parfumée jasmin et ambre", imageUrl: seedProducts[2].images[0].url, quantity: 2, unitPrice: 2200, total: 4400, shopId: "s3", shopName: "L'Atelier des Sens" },
    ],
    subtotal: 12900, shippingFee: 400, discount: 0, total: 13300,
    shippingAddress: seedAddresses[0], deliveryMode: "home", paymentMethod: "cod", paymentStatus: "unpaid", status: "delivered",
    history: [
      { status: "pending", at: daysAgo(10) },
      { status: "confirmed", at: daysAgo(9) },
      { status: "shipped", at: daysAgo(7) },
      { status: "delivered", at: daysAgo(5) },
    ],
    createdAt: daysAgo(10), updatedAt: daysAgo(5),
  },
  {
    id: "o2", number: "CMD-2024-002", userId: "current", customerName: "Mohamed Benali", customerPhone: "0555 12 34 56",
    items: [{ id: "oi3", productId: "p2", productName: "Montre minimaliste en bois", imageUrl: seedProducts[1].images[0].url, quantity: 1, unitPrice: 5900, total: 5900, shopId: "s2", shopName: "Temps Naturel DZ" }],
    subtotal: 5900, shippingFee: 800, discount: 0, total: 6700,
    shippingAddress: seedAddresses[0], deliveryMode: "express", paymentMethod: "ccp", paymentStatus: "paid", status: "shipped",
    history: [
      { status: "pending", at: daysAgo(3) },
      { status: "confirmed", at: daysAgo(2) },
      { status: "shipped", at: daysAgo(1) },
    ],
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
];

export const seedPromotions: Promotion[] = [
  { id: "pr1", shopId: "s1", code: "CUIR10", type: "percent", value: 10, minOrder: 5000, startsAt: daysAgo(30), endsAt: daysAgo(-30), usageLimit: 100, usedCount: 23, active: true },
  { id: "pr2", code: "BIENVENUE", type: "fixed", value: 500, minOrder: 3000, startsAt: daysAgo(60), endsAt: daysAgo(-60), usedCount: 187, active: true },
  { id: "pr3", code: "FREESHIP", type: "free_shipping", value: 0, minOrder: 8000, startsAt: daysAgo(15), endsAt: daysAgo(-15), usedCount: 45, active: true },
];

export const seedShopPages: ShopPage[] = [
  {
    id: "sp1", shopId: "s1", updatedAt: now(),
    blocks: [
      { id: "b1", type: "hero", props: { title: "Artisan Cuir Alger", subtitle: "Maroquinerie de qualité, faite à la main.", imageUrl: seedShops[0].coverUrl, ctaLabel: "Voir les produits", ctaHref: "#products" } },
      { id: "b2", type: "product_grid", props: { title: "Nos best-sellers", productIds: ["p1", "p5"], columns: 4 } },
      { id: "b3", type: "text", props: { content: "Depuis 1985, notre atelier perpétue le savoir-faire algérien du cuir." } },
    ],
  },
];
