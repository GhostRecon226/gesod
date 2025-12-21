import { useQuery } from "@tanstack/react-query";
import { fetchCustomerDocuments, VinDocumentGroup } from "@/services/customerDocumentService";

// Query keys
export const customerDocumentKeys = {
  all: ["customer-documents"] as const,
  list: () => [...customerDocumentKeys.all, "list"] as const,
};

// Fetch all customer documents grouped by VIN
export function useCustomerDocuments() {
  return useQuery({
    queryKey: customerDocumentKeys.list(),
    queryFn: fetchCustomerDocuments,
  });
}

export type { VinDocumentGroup };
