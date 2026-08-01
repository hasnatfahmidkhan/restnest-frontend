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
  property: {
    id: string;
    title: string;
    rentPrice: string;
    city: string;
    division: string;
    propertyImages: { id: string; url: string; isPrimary: boolean }[];
  };
};

export const useTenantRentals = () => {
  return useQuery<{ success: boolean; data: TenantRental[] }>({
    queryKey: ["tenant-rentals"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rentals`, {
        credentials: "include", // Send httpOnly cookies
      });
      if (!res.ok) throw new Error("Failed to fetch your rentals");
      return res.json();
    },
  });
};

export const useCancelRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rentalId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rentals/tenant/requests/${rentalId}`,
        {
          method: "PATCH", // or POST, depending on your backend
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELED" }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to cancel rental");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Rental request canceled successfully.");
      queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
