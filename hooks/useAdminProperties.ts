import { getAdminPropertiesService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export type AdminPropertyQuery = {
  page: number;
  limit: number;
  sortBy: "createdAt" | "rentPrice" | "averageRating";
  sortOrder: "asc" | "desc";
  searchTerm?: string;
  city?: string;
  division?: string;
  category?: string;
  landlordId?: string;
  availability?: boolean;
};

export const useAdminProperties = (query: AdminPropertyQuery) => {
  return useQuery({
    queryKey: ["admin-properties", query],
    queryFn: () => getAdminPropertiesService(query),
  });
};
