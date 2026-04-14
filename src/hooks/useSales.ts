import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Sale = {
  id: string;
  client_id: string | null;
  doc_type: string;
  doc_number: string;
  sale_date: string;
  total: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  payment_mode: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: { name: string } | null;
};

export type SaleItem = {
  id?: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export function useSales(docType?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sales", user?.id, docType],
    queryFn: async () => {
      let q = supabase
        .from("sales")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });
      if (docType) q = q.eq("doc_type", docType);
      const { data, error } = await q;
      if (error) throw error;
      return data as Sale[];
    },
    enabled: !!user,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      sale,
      items,
    }: {
      sale: {
        client_id?: string | null;
        doc_type: string;
        total: number;
        paid_amount?: number;
        status?: string;
        payment_status?: string;
        payment_mode?: string;
        notes?: string;
      };
      items: SaleItem[];
    }) => {
      // Generate doc number via RPC
      const { data: docNumber } = await supabase.rpc("generate_doc_number", {
        p_user_id: user!.id,
        p_doc_type: sale.doc_type,
      });

      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert({
          ...sale,
          user_id: user!.id,
          doc_number: docNumber || "DOC-00001",
          payment_status: (sale.paid_amount || 0) >= sale.total ? "paid" : (sale.paid_amount || 0) > 0 ? "partial" : "unpaid",
        })
        .select()
        .single();
      if (saleError) throw saleError;

      // Insert sale items
      if (items.length > 0) {
        const { error: itemsError } = await supabase.from("sale_items").insert(
          items.map((item) => ({
            sale_id: saleData.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
          }))
        );
        if (itemsError) throw itemsError;
      }

      // Decrement stock for each item
      for (const item of items) {
        if (item.product_id) {
          await supabase.rpc("generate_doc_number", { p_user_id: user!.id, p_doc_type: "direct" }).then(() => {
            // We'll handle stock decrement directly
          });

          const { data: prod } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();

          if (prod) {
            await supabase
              .from("products")
              .update({ stock: Math.max(0, prod.stock - item.quantity) })
              .eq("id", item.product_id);

            await supabase.from("stock_movements").insert({
              user_id: user!.id,
              product_id: item.product_id,
              movement_type: "sale",
              quantity: -item.quantity,
              reference: saleData.doc_number,
            });
          }
        }
      }

      // Record payment if paid
      if ((sale.paid_amount || 0) > 0) {
        await supabase.from("payments").insert({
          sale_id: saleData.id,
          user_id: user!.id,
          amount: sale.paid_amount || 0,
          payment_mode: sale.payment_mode || "cash",
        });
      }

      return saleData;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success("Vente enregistrée");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function usePayments(saleId?: string) {
  return useQuery({
    queryKey: ["payments", saleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("sale_id", saleId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!saleId,
  });
}

export function useStockMovements(productId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["stock_movements", user?.id, productId],
    queryFn: async () => {
      let q = supabase
        .from("stock_movements")
        .select("*, products(name)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (productId) q = q.eq("product_id", productId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
