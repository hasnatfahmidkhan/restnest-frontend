"use client";
import {
  getLandlordRentalsService,
  getRentalDetailsService,
  LandlordRentalsQuery,
  updateRentalStatusService,
} from "@/services/rental.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELED";

export type LandlordRental = {
  id: string;
  status: RentalStatus;
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
  };
};

export type RentalDetails = {
  id: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELED";
  moveInDate: string;
  leaseMonths: number;
  endDate: string;
  createdAt: string;
  message?: string;
  tenant: {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
  };
  property: {
    id: string;
    title: string;
    rentPrice: string;
    city: string;
    division: string;
    address?: string;
  };
};

export const useLandlordRentals = (query: LandlordRentalsQuery) => {
  return useQuery({
    queryKey: ["landlord-rentals", query],
    queryFn: () => getLandlordRentalsService(query),
    placeholderData: (previousData) => previousData,
  });
};

export const useRentalDetails = (rentalId: string, tenantId: string) => {
  return useQuery<{ success: boolean; data: RentalDetails }>({
    queryKey: ["rental-details", rentalId],
    queryFn: () => getRentalDetailsService(rentalId, tenantId),
    enabled: !!rentalId && !!tenantId,
  });
};

export const useUpdateRentalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rentalId,
      status,
    }: {
      rentalId: string;
      status: "APPROVED" | "REJECTED";
    }) => updateRentalStatusService(rentalId, status),

    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "APPROVED"
          ? "Request Approved! Tenant can now pay."
          : "Request Rejected.",
      );

      queryClient.invalidateQueries({
        queryKey: ["landlord-rentals"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
