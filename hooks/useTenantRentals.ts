import {
  cancelRentalService,
  getTenantRentalsService,
} from "@/services/tenant.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type TenantRentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELED";

export type TenantRental = {
  id: string;
  status: TenantRentalStatus;
  moveInDate: string;
  leaseMonths: number;
  endDate: string;
  createdAt: string;
  tenant: {
    id: string;
    name: string | null;
    email: string;
  };
  property: {
    id: string;
    title: string;
    rentPrice: string;
    city: string;
    division: string;
    propertyImages: { id: string; url: string; isPrimary: boolean }[];
  };
};

export interface TenantRentalsQuery {
  searchTerm?: string;
  status?: TenantRentalStatus;
  page?: number;
  limit?: number;
}

export const useTenantRentals = (query: TenantRentalsQuery) => {
  return useQuery({
    queryKey: ["tenant-rentals", query],
    queryFn: () => getTenantRentalsService(query),
    placeholderData: (previousData) => previousData,
  });
};

export const useCancelRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelRentalService,

    onSuccess: () => {
      toast.success("Rental request canceled successfully.");

      queryClient.invalidateQueries({
        queryKey: ["tenant-rentals"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
