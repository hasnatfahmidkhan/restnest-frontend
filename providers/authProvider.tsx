"use client";

import { useInitializeAuth } from "@/hooks/auth.hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isPending, isError } = useInitializeAuth();

  // Show a full-screen loader while checking the HTTP-only cookie against the backend
  // if (isPending) {
  //   return <GlobalLoading />;
  // }

  // If isError, it means no cookie or invalid token. Just render the app (user state remains null).
  return <>{children}</>;
}
