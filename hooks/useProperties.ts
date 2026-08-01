import {
  PropertyFilterValues,
  PropertyResponse,
  SelectableResponse,
} from "@/schemas/property.schema";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useProperties = (filters: PropertyFilterValues) => {
  return useQuery<PropertyResponse>({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((v) => params.append(key, v));
          } else if (!Array.isArray(value)) {
            params.append(key, String(value));
          }
        }
      });

      const res = await fetch(
        `${API_BASE_URL}/properties?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });
};

export const useCategories = () => {
  return useQuery<SelectableResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/category`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });
};

export const useAmenities = () => {
  return useQuery<SelectableResponse>({
    queryKey: ["amenities"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/amenities`);
      if (!res.ok) throw new Error("Failed to fetch amenities");
      return res.json();
    },
  });
};
