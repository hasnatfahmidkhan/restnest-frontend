import { getAdminRentalsService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export type AdminRentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELED";
export type PaymentStatus = "COMPLETED" | "PENDING" | "FAILED" | "CANCELED";

export type AdminRental = {
  id: string;
  status: AdminRentalStatus;
  moveInDate: string;
  leaseMonths: number;
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
    landlord: {
      id: string;
      name: string | null;
      email: string;
    };
  };
  payment: {
    id: string;
    amount: string;
    status: PaymentStatus;
    transactionId: string;
    paidAt: string;
  } | null; // Payment might be null if not paid yet
};

export type AdminRentalQuery = {
  page: number;
  limit: number;
  searchTerm?: string;
  status?: AdminRentalStatus;
  paymentStatus?: PaymentStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type AdminRentalsResponse = {
  success: boolean;
  message: string;
  meta: { page: number; limit: number; total: number; totalPage: number };
  data: AdminRental[];
};

export const useAdminRentals = (query: AdminRentalQuery) => {
  return useQuery({
    queryKey: ["admin-rentals", query],
    queryFn: () => getAdminRentalsService(query),
  });
};
