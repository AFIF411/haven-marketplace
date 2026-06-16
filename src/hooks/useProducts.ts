import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessStore, type MProduct } from "@/lib/mocks/businessStore";
import { toast } from "sonner";

export type Product = MProduct;

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => businessStore.listProducts(),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, "id" | "created_at" | "updated_at">) =>
      businessStore.createProduct(product),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Produit ajouté"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) =>
      businessStore.updateProduct(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Produit mis à jour"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => businessStore.deleteProduct(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Produit supprimé"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
