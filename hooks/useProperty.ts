import { SinglePropertyResponse } from "@/schemas/property.schema";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5000/api";

export const useProperty = (id: string) => {
  return useQuery<SinglePropertyResponse>({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (!res.ok) throw new Error("Failed to fetch property details");
      return res.json();
    },
    enabled: !!id, // Only run query if id exists
  });
};
