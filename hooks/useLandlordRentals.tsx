import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export const useLandlordRentals = () => {
  return useQuery<{ success: boolean; data: LandlordRental[] }>({
    queryKey: ["landlord-rentals"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/rentals/landlord`, {
        headers: {
          "Content-Type": "application/json",
        },
        // Crucial: sends the HTTP-only cookie automatically
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch rentals");
      return res.json();
    },
  });
};

export const useRentalDetails = (rentalId: string, tenantId: string) => {
  return useQuery<{ success: boolean; data: RentalDetails }>({
    queryKey: ["rental-details", rentalId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/rentals/${rentalId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch rental details");
      return res.json();
    },
    enabled: !!rentalId && !!tenantId, // Only run if both IDs exist
  });
};

type UpdateStatusArgs = {
  rentalId: string;
  status: "APPROVED" | "REJECTED";
};

export const useUpdateRentalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rentalId, status }: UpdateStatusArgs) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rentals/landlord/requests/${rentalId}`,
        {
          method: "PATCH",
          credentials: "include", // Sends httpOnly cookies automatically
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update rental status");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      // Show success toast based on the action taken
      if (variables.status === "APPROVED") {
        toast.success("Request Approved! Tenant can now pay.");
      } else {
        toast.error("Request Rejected.");
      }

      // Invalidate the table query to refetch new data instantly
      queryClient.invalidateQueries({ queryKey: ["landlord-rentals"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
