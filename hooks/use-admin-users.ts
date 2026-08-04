import {
  getAdminUsersService,
  updateUserStatusService,
} from "@/services/admin.service";
import { getNewAccesssToken } from "@/services/getNewAccesssToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminPropertyQuery } from "./useAdminProperties";

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
    queryFn: () => getAdminUsersService(query),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateUserStatusService(userId, status),

    onSuccess: (data) => {
      toast.success(data.message || "User status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};


