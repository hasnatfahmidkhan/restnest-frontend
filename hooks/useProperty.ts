import { SinglePropertyResponse } from "@/schemas/property.schema";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
        credentials: "include", 
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

export const useSaveProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ propertyId, payload }: { propertyId: string | null; payload: any }) => {
      const isEdit = !!propertyId;
      const endpoint = isEdit
        ? `${API_BASE_URL}/landlord/properties/${propertyId}`
        : `${API_BASE_URL}/landlord/properties`;

      const res = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to ${isEdit ? "update" : "create"} property`);
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      if (variables.propertyId) {
        queryClient.invalidateQueries({ queryKey: ["property", variables.propertyId] });
      }
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await fetch(`${API_BASE_URL}/landlord/properties/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete property");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
