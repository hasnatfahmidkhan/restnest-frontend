import { getTenantStatsService } from "@/services/tenant.service";
import { useQuery } from "@tanstack/react-query";

export type TenantOverview = {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  activeRentals: number;
  rejectedRequests: number;
  cancelledRequests: number;
  completedRentals: number;
  totalPaid: string;
};

export type RecentRequest = {
  id: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELED";
  moveInDate: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    city: string;
    rentPrice: string;
    propertyImages: { url: string }[];
  };
};

export type TenantStats = {
  overview: TenantOverview;
  recentRequests: RecentRequest[];
};

export const useTenantStats = () => {
  return useQuery({
    queryKey: ["tenant-stats"],
    queryFn: getTenantStatsService,
    refetchOnWindowFocus: false,
  });
};
