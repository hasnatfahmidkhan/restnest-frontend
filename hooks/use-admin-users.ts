import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BAN";

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
};

export type AdminUserQuery = {
  page: number;
  limit: number;
  sortBy: "name" | "createdAt" | "email";
  sortOrder: "asc" | "desc";
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
};

type AdminUsersResponse = {
  success: boolean;
  message: string;
  data: {
    meta: { page: number; limit: number; total: number; totalPage: number };
    data: AdminUser[];
  };
};

export const useAdminUsers = (query: AdminUserQuery) => {
  return useQuery<AdminUsersResponse>({
    queryKey: ["admin-users", query],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params.toString()}`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string;
      status: UserStatus;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update user status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
