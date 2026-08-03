import { useQuery } from "@tanstack/react-query";

export type AdminStats = {
  users: {
    total: number;
    landlords: number;
    tenants: number;
  };
  properties: {
    total: number;
    available: number;
    occupied: number;
  };
  rentals: {
    total: number;
    pending: number;
    approved: number;
    active: number;
    completed: number;
    rejected: number;
    cancelled: number;
  };
  payments: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    revenue: string;
  };
};

export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      const data = await res.json();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });
};
