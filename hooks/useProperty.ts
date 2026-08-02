import { SinglePropertyResponse } from "@/schemas/property.schema";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5000/api";

export const useProperty = (id: string) => {
  const user = useAuthStore((state) => state.user);
  const url =
    user?.role === "ADMIN" ? `admin/properties/${id}` : `properties/${id}`;

  return useQuery<SinglePropertyResponse>({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/${url}`, {
        credentials: "include", // Sends httpOnly cookies automatically
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch property details");
      return res.json();
    },
    enabled: !!id, // Only run query if id exists
  });
};
