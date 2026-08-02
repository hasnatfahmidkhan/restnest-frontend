import { Property } from "@/schemas/property.schema";
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

type AdminPropertiesResponse = {
  success: boolean;
  message: string;
  data: {
    properties: Property[];
    pagination: {
      total: number;
      pageNumber: number;
      limit: number;
      totalPage: number;
    };
  };
};

export const useAdminProperties = (query: AdminPropertyQuery) => {
  return useQuery<AdminPropertiesResponse>({
    queryKey: ["admin-properties", query],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/properties?${params.toString()}`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });
};
