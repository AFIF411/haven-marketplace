import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessStore, type MSale } from "@/lib/mocks/businessStore";
import { toast } from "sonner";

export type Sale = MSale;

export type SaleItem = {
  id?: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export function useSales(docType?: string) {
  return useQuery({
    queryKey: ["sales", docType],
    queryFn: async () => businessStore.listSales(docType),
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
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
        payment_mode?: string;
        notes?: string;
      };
      items: SaleItem[];
    }) => {
      return businessStore.createSale(
        {
          client_id: sale.client_id ?? null,
          doc_type: sale.doc_type,
          total: sale.total,
          paid_amount: sale.paid_amount || 0,
          payment_mode: sale.payment_mode || "cash",
          notes: sale.notes ?? null,
        },
        items.map(it => ({
          product_id: it.product_id, product_name: it.product_name,
          quantity: it.quantity, unit_price: it.unit_price, total: it.total,
        })),
      );
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
    queryFn: async () => businessStore.listPayments(saleId),
    enabled: !!saleId,
  });
}

export function useStockMovements(productId?: string) {
  return useQuery({
    queryKey: ["stock_movements", productId],
    queryFn: async () => businessStore.listStockMovements(productId),
  });
}
