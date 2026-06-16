import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessStore, type MClient } from "@/lib/mocks/businessStore";
import { toast } from "sonner";

export type Client = MClient;

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => businessStore.listClients(),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (client: Omit<Client, "id" | "created_at" | "updated_at">) =>
      businessStore.createClient(client),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients"] }); toast.success("Client ajouté"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) =>
      businessStore.updateClient(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients"] }); toast.success("Client mis à jour"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => businessStore.deleteClient(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients"] }); toast.success("Client supprimé"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
