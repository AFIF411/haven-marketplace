export const mockProducts = [
  { id: "1", name: "Sac en cuir artisanal tressé", price: 129, originalPrice: 159, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", rating: 4.8, reviews: 124, shop: "Maison Cuir", badge: "Bestseller" },
  { id: "2", name: "Montre minimaliste en bois d'érable", price: 89, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", rating: 4.6, reviews: 89, shop: "Temps Naturel" },
  { id: "3", name: "Bougie parfumée cèdre et vanille", price: 34, originalPrice: 42, image: "https://images.unsplash.com/photo-1602607700009-1b3e2f2426c5?w=400&h=400&fit=crop", rating: 4.9, reviews: 256, shop: "L'Atelier des Sens", badge: "Nouveau" },
  { id: "4", name: "Céramique fait-main bol ramen", price: 45, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop", rating: 4.7, reviews: 67, shop: "Terre & Feu" },
  { id: "5", name: "Pull en cachemire col rond gris", price: 195, originalPrice: 250, image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a50?w=400&h=400&fit=crop", rating: 4.5, reviews: 43, shop: "Mode Éthique" },
  { id: "6", name: "Huile d'olive bio extra vierge", price: 18, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop", rating: 4.8, reviews: 312, shop: "Saveurs du Sud" },
  { id: "7", name: "Carnet de notes cuir recyclé A5", price: 24, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop", rating: 4.4, reviews: 78, shop: "Papier & Cie" },
  { id: "8", name: "Sneakers éco-responsables blanches", price: 115, originalPrice: 140, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", rating: 4.6, reviews: 201, shop: "Walk Green" },
];

export const mockShops = [
  { id: "1", name: "Maison Cuir", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=200&fit=crop", rating: 4.8, reviews: 342, products: 56, category: "Maroquinerie", verified: true },
  { id: "2", name: "Temps Naturel", logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=200&fit=crop", rating: 4.6, reviews: 189, products: 23, category: "Horlogerie", verified: true },
  { id: "3", name: "L'Atelier des Sens", logo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1602607700009-1b3e2f2426c5?w=600&h=200&fit=crop", rating: 4.9, reviews: 567, products: 34, category: "Bien-être", verified: true },
  { id: "4", name: "Terre & Feu", logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=200&fit=crop", rating: 4.7, reviews: 145, products: 42, category: "Céramique" },
  { id: "5", name: "Mode Éthique", logo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a50?w=600&h=200&fit=crop", rating: 4.5, reviews: 98, products: 67, category: "Mode", verified: true },
  { id: "6", name: "Saveurs du Sud", logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=200&fit=crop", rating: 4.8, reviews: 423, products: 89, category: "Alimentation" },
];

export const mockCategories = [
  { name: "Électronique", icon: "💻", count: 1240, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop" },
  { name: "Mode", icon: "👗", count: 3456, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop" },
  { name: "Maison", icon: "🏠", count: 2100, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop" },
  { name: "Beauté", icon: "✨", count: 890, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop" },
  { name: "Sports", icon: "⚽", count: 670, image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=300&h=300&fit=crop" },
  { name: "Alimentation", icon: "🍽️", count: 1560, image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&h=300&fit=crop" },
  { name: "Artisanat", icon: "🎨", count: 780, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=300&h=300&fit=crop" },
  { name: "High-Tech", icon: "📱", count: 2300, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop" },
];

export const mockOrders = [
  { id: "CMD-2024-001", date: "2024-01-15", status: "delivered", total: 234, items: 3, shop: "Maison Cuir" },
  { id: "CMD-2024-002", date: "2024-01-18", status: "shipped", total: 89, items: 1, shop: "Temps Naturel" },
  { id: "CMD-2024-003", date: "2024-01-20", status: "processing", total: 156, items: 2, shop: "L'Atelier des Sens" },
  { id: "CMD-2024-004", date: "2024-01-22", status: "pending", total: 45, items: 1, shop: "Terre & Feu" },
  { id: "CMD-2024-005", date: "2024-01-25", status: "delivered", total: 312, items: 4, shop: "Mode Éthique" },
];
