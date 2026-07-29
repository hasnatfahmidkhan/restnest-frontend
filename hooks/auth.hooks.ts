import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TLoginInput } from "@/app/(auth)/_schemas/auth.schema";

import { getMeService, loginService } from "@/app/(auth)/_sevices/auth.service";
import { UserRole } from "@/app/(auth)/_types/auth.types";
import { useAuthStore } from "@/store/auth-store";

const ROLE_REDIRECTS: Record<UserRole, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: TLoginInput) => loginService(payload),
    onSuccess: (data) => {
      const { userData } = data.data;

      // Save user data to global state (UI state only)
      setUser(userData);

      toast.success("Login successful!", {
        description: `Welcome back, ${userData.email}`,
      });

      // Redirect based on role
      router.push(ROLE_REDIRECTS[userData.role]);
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });
};

export const useInitializeAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const user = await getMeService();
      // Save to Zustand global state
      setUser(user);
      return user;
    },
    retry: false, // Don't retry if token is invalid/expired
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
