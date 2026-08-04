import { getLandlordStatsService } from "@/services/landlord.service";
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
    queryFn: getLandlordStatsService,
    refetchOnWindowFocus: false,
  });
};
