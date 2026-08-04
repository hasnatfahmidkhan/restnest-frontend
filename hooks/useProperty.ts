import { SinglePropertyResponse } from "@/schemas/property.schema";
import {
  deletePropertyService,
  getPropertyService,
  savePropertyService,
} from "@/services/property.service";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProperty = (id: string) => {
  const user = useAuthStore((state) => state.user);

  return useQuery<SinglePropertyResponse>({
    queryKey: ["property", id],
    queryFn: () => getPropertyService(id, user?.role),
    enabled: !!id, // Only run query if id exists
  });
};

export const useSaveProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      payload,
    }: {
      propertyId: string | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: any;
    }) => savePropertyService(propertyId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      if (variables.propertyId) {
        queryClient.invalidateQueries({
          queryKey: ["property", variables.propertyId],
        });
      }
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePropertyService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
