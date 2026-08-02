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
  return useQuery<AdminRentalsResponse>({
    queryKey: ["admin-rentals", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/rentals?${params.toString()}`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch rentals");
      return res.json();
    },
  });
};
