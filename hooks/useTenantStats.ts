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
  return useQuery<TenantStats>({
    queryKey: ["tenant-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/stats`,
        {
          credentials: "include", // Send httpOnly cookies
        },
      );
      if (!res.ok) throw new Error("Failed to fetch tenant stats");
      const data = await res.json();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });
};
