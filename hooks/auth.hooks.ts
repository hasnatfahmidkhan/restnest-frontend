import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TLoginInput } from "@/app/(auth)/_schemas/auth.schema";

import { loginService } from "@/app/(auth)/_sevices/auth.service";
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
