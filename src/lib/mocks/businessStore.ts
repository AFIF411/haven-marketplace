// ============================================================
// Mock store en mémoire pour la partie gestion interne (POS / B2B)
// Remplace toutes les tables Supabase : products, clients, sales,
// sale_items, payments, stock_movements, profiles, user_roles.
// Persiste optionnellement dans localStorage.
// ============================================================
import type { AppRole } from "@/lib/permissions";

const K = "souk_business_db_v1";
const nowISO = () => new Date().toISOString();
const uid = (p = "id") => `${p}-${Math.random().toString(36).slice(2, 10)}`;

export interface MProduct {
  id: string; name: string; code: string | null; category: string | null;
  purchase_price: number | null; sale_price: number; stock: number; min_stock: number;
  unit: string | null; description: string | null; is_active: boolean | null;
  created_at: string; updated_at: string;
}
export interface MClient {
  id: string; name: string; phone: string | null; email: string | null;
  address: string | null; wilaya: string | null; notes: string | null;
  created_at: string; updated_at: string;
}
export interface MSaleItem {
  id: string; sale_id: string; product_id: string | null; product_name: string;
  quantity: number; unit_price: number; total: number;
}
export interface MSale {
  id: string; client_id: string | null; doc_type: string; doc_number: string;
  sale_date: string; total: number; paid_amount: number; status: string;
  payment_status: string; payment_mode: string | null; notes: string | null;
  created_at: string; updated_at: string; clients?: { name: string } | null;
}
export interface MPayment {
  id: string; sale_id: string; amount: number; payment_mode: string;
  payment_date: string; notes: string | null; created_at: string;
}
export interface MStockMovement {
  id: string; product_id: string; movement_type: string; quantity: number;
  reference: string | null; notes: string | null; created_at: string;
  products?: { name: string } | null;
}
export interface MProfile {
  user_id: string; display_name: string | null; phone: string | null;
  status: string; created_at: string;
}
export interface MUserRole { user_id: string; role: AppRole }

interface DB {
  products: MProduct[]; clients: MClient[]; sales: MSale[];
  sale_items: MSaleItem[]; payments: MPayment[]; stock_movements: MStockMovement[];
  profiles: MProfile[]; user_roles: MUserRole[];
}

function seed(): DB {
  const t = nowISO();
  return {
    products: [
      { id: "p1", name: "Sac cuir tressé", code: "AC-001", category: "Maroquinerie", purchase_price: 5000, sale_price: 8500, stock: 12, min_stock: 3, unit: "u", description: null, is_active: true, created_at: t, updated_at: t },
      { id: "p2", name: "Bougie jasmin", code: "AS-022", category: "Bien-être", purchase_price: 1000, sale_price: 2200, stock: 45, min_stock: 5, unit: "u", description: null, is_active: true, created_at: t, updated_at: t },
      { id: "p3", name: "Bol céramique", code: "TF-008", category: "Maison", purchase_price: 1500, sale_price: 3000, stock: 2, min_stock: 5, unit: "u", description: null, is_active: true, created_at: t, updated_at: t },
    ],
    clients: [
      { id: "cl1", name: "Mohamed Benali", phone: "0555 12 34 56", email: "m.benali@example.dz", address: "Cité 5 Juillet", wilaya: "Alger", notes: null, created_at: t, updated_at: t },
      { id: "cl2", name: "Amina Kessous", phone: "0666 78 90 12", email: null, address: null, wilaya: "Oran", notes: null, created_at: t, updated_at: t },
    ],
    sales: [
      { id: "s1", client_id: "cl1", doc_type: "invoice", doc_number: "FAC-00001", sale_date: t.slice(0,10), total: 12900, paid_amount: 12900, status: "completed", payment_status: "paid", payment_mode: "cash", notes: null, created_at: t, updated_at: t, clients: { name: "Mohamed Benali" } },
      { id: "s2", client_id: "cl2", doc_type: "invoice", doc_number: "FAC-00002", sale_date: t.slice(0,10), total: 6000, paid_amount: 3000, status: "completed", payment_status: "partial", payment_mode: "ccp", notes: null, created_at: t, updated_at: t, clients: { name: "Amina Kessous" } },
    ],
    sale_items: [],
    payments: [
      { id: "pm1", sale_id: "s1", amount: 12900, payment_mode: "cash", payment_date: t.slice(0,10), notes: null, created_at: t },
      { id: "pm2", sale_id: "s2", amount: 3000, payment_mode: "ccp", payment_date: t.slice(0,10), notes: null, created_at: t },
    ],
    stock_movements: [
      { id: "sm1", product_id: "p1", movement_type: "in", quantity: 15, reference: "Achat fournisseur", notes: null, created_at: t, products: { name: "Sac cuir tressé" } },
      { id: "sm2", product_id: "p1", movement_type: "sale", quantity: -3, reference: "FAC-00001", notes: null, created_at: t, products: { name: "Sac cuir tressé" } },
    ],
    profiles: [
      { user_id: "demo-super_admin", display_name: "Admin Démo", phone: "+213500000000", status: "active", created_at: t },
      { user_id: "demo-vendeur", display_name: "Vendeur Démo", phone: "+213500000001", status: "active", created_at: t },
      { user_id: "demo-viewer", display_name: "Client Démo", phone: "+213500000002", status: "active", created_at: t },
    ],
    user_roles: [
      { user_id: "demo-super_admin", role: "super_admin" },
      { user_id: "demo-vendeur", role: "vendeur" },
      { user_id: "demo-viewer", role: "viewer" },
    ],
  };
}

function load(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(K);
    if (raw) return JSON.parse(raw) as DB;
  } catch {}
  const fresh = seed();
  try { localStorage.setItem(K, JSON.stringify(fresh)); } catch {}
  return fresh;
}

let db: DB = load();
const save = () => { try { localStorage.setItem(K, JSON.stringify(db)); } catch {} };

export const businessStore = {
  // products
  listProducts: () => [...db.products].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  createProduct: (input: Omit<MProduct, "id" | "created_at" | "updated_at">) => {
    const p: MProduct = { ...input, id: uid("p"), created_at: nowISO(), updated_at: nowISO() };
    db.products.unshift(p); save(); return p;
  },
  updateProduct: (id: string, patch: Partial<MProduct>) => {
    const p = db.products.find(x => x.id === id); if (!p) throw new Error("Produit introuvable");
    Object.assign(p, patch, { updated_at: nowISO() }); save(); return p;
  },
  deleteProduct: (id: string) => { db.products = db.products.filter(p => p.id !== id); save(); },

  // clients
  listClients: () => [...db.clients].sort((a, b) => a.name.localeCompare(b.name)),
  createClient: (input: Omit<MClient, "id" | "created_at" | "updated_at">) => {
    const c: MClient = { ...input, id: uid("cl"), created_at: nowISO(), updated_at: nowISO() };
    db.clients.unshift(c); save(); return c;
  },
  updateClient: (id: string, patch: Partial<MClient>) => {
    const c = db.clients.find(x => x.id === id); if (!c) throw new Error("Client introuvable");
    Object.assign(c, patch, { updated_at: nowISO() }); save(); return c;
  },
  deleteClient: (id: string) => { db.clients = db.clients.filter(c => c.id !== id); save(); },

  // sales
  listSales: (docType?: string) => {
    let res = [...db.sales];
    if (docType) res = res.filter(s => s.doc_type === docType);
    return res.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(s => ({
      ...s, clients: s.client_id ? { name: db.clients.find(c => c.id === s.client_id)?.name || "-" } : null,
    }));
  },
  createSale: (sale: Omit<MSale, "id" | "doc_number" | "sale_date" | "created_at" | "updated_at" | "status" | "payment_status" | "clients">, items: Omit<MSaleItem, "id" | "sale_id">[]) => {
    const docMap: Record<string, string> = { invoice: "FAC", quote: "DEV", order: "BC", delivery: "BL", direct: "VD" };
    const prefix = docMap[sale.doc_type] || "DOC";
    const n = db.sales.filter(s => s.doc_type === sale.doc_type).length + 1;
    const doc_number = `${prefix}-${String(n).padStart(5, "0")}`;
    const t = nowISO();
    const newSale: MSale = {
      ...sale, id: uid("s"), doc_number, sale_date: t.slice(0, 10),
      status: "completed",
      payment_status: sale.paid_amount >= sale.total ? "paid" : sale.paid_amount > 0 ? "partial" : "unpaid",
      created_at: t, updated_at: t,
    };
    db.sales.unshift(newSale);
    for (const it of items) {
      db.sale_items.push({ ...it, id: uid("si"), sale_id: newSale.id });
      if (it.product_id) {
        const p = db.products.find(x => x.id === it.product_id);
        if (p) {
          p.stock = Math.max(0, p.stock - it.quantity);
          db.stock_movements.unshift({
            id: uid("sm"), product_id: it.product_id, movement_type: "sale",
            quantity: -it.quantity, reference: doc_number, notes: null,
            created_at: t, products: { name: p.name },
          });
        }
      }
    }
    if (newSale.paid_amount > 0) {
      db.payments.unshift({
        id: uid("pm"), sale_id: newSale.id, amount: newSale.paid_amount,
        payment_mode: newSale.payment_mode || "cash", payment_date: t.slice(0, 10),
        notes: null, created_at: t,
      });
    }
    save(); return newSale;
  },
  addPayment: (saleId: string, amount: number, mode: string, notes?: string) => {
    const s = db.sales.find(x => x.id === saleId); if (!s) throw new Error("Vente introuvable");
    const t = nowISO();
    db.payments.unshift({ id: uid("pm"), sale_id: saleId, amount, payment_mode: mode, payment_date: t.slice(0, 10), notes: notes || null, created_at: t });
    s.paid_amount += amount;
    s.payment_status = s.paid_amount >= s.total ? "paid" : "partial";
    s.updated_at = t;
    save();
  },
  listPayments: (saleId?: string) => {
    let res = [...db.payments];
    if (saleId) res = res.filter(p => p.sale_id === saleId);
    return res.sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  // stock
  listStockMovements: (productId?: string) => {
    let res = [...db.stock_movements];
    if (productId) res = res.filter(m => m.product_id === productId);
    return res.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50).map(m => ({
      ...m, products: { name: db.products.find(p => p.id === m.product_id)?.name || "-" },
    }));
  },
  addStockMovement: (input: { product_id: string; movement_type: string; quantity: number; reference?: string | null; notes?: string | null }) => {
    const p = db.products.find(x => x.id === input.product_id); if (!p) throw new Error("Produit introuvable");
    p.stock = Math.max(0, p.stock + input.quantity);
    db.stock_movements.unshift({
      id: uid("sm"), product_id: input.product_id, movement_type: input.movement_type,
      quantity: input.quantity, reference: input.reference || null, notes: input.notes || null,
      created_at: nowISO(), products: { name: p.name },
    });
    save();
  },

  // users / profiles / roles
  listProfilesWithRoles: () => db.profiles.map(p => ({
    ...p,
    roles: db.user_roles.filter(r => r.user_id === p.user_id).map(r => r.role),
  })),
  setUserRoles: (userId: string, roles: AppRole[]) => {
    db.user_roles = db.user_roles.filter(r => r.user_id !== userId);
    for (const role of roles) db.user_roles.push({ user_id: userId, role });
    save();
  },
  setProfileStatus: (userId: string, status: string) => {
    const p = db.profiles.find(x => x.user_id === userId); if (p) { p.status = status; save(); }
  },
};
