import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { TLoginInput } from "@/app/(auth)/_schemas/auth.schema";

import { getMeService, loginService } from "@/app/(auth)/_sevices/auth.service";
import { UserRole } from "@/app/(auth)/_types/auth.types";
import { deleteCookie } from "@/services/deleteCookie";
import { useAuthStore } from "@/store/auth-store";

const ROLE_REDIRECTS: Record<UserRole, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const redirectTo = useSearchParams().get("redirectTo") || "";

  return useMutation({
    mutationFn: (payload: TLoginInput) => loginService(payload),
    onSuccess: (data) => {
      const { userData } = data.data;

      // Save user data to global state (UI state only)
      setUser(userData);

      toast.success("Login successful!", {
        description: `Welcome back, ${userData.email}`,
      });

      if (
        redirectTo &&
        redirectTo.startsWith("/") &&
        !redirectTo.startsWith("//")
      ) {
        router.push(redirectTo);
      } else {
        // Redirect based on role
        router.push(ROLE_REDIRECTS[userData.role]);
      }
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.logout); // Your Zustand logout function

  const logout = async () => {
    try {
      // 1. Call the server action to delete HTTP-only cookies
      await deleteCookie();

      // 2. Clear the frontend Zustand state
      clearUser();

      // 3. Redirect to login page
      router.refresh();

      toast.success("Logged out successfully");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return { logout };
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
