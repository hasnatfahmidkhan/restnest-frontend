import { useQuery } from "@tanstack/react-query";

export type LandlordStats = {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  totalRentalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  activeRentals: number;
  completedRentals: number;
  totalRevenue: string;
  averageRating: number;
  totalReviews: number;
};

export const useLandlordStats = () => {
  return useQuery<LandlordStats>({
    queryKey: ["landlord-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landlord/stats`,
        {
          credentials: "include", // Send httpOnly cookies
        },
      );
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });
};
