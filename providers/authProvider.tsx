"use client";

import { useInitializeAuth } from "@/hooks/auth.hooks";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isPending, isError } = useInitializeAuth();

  // Show a full-screen loader while checking the HTTP-only cookie against the backend
  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If isError, it means no cookie or invalid token. Just render the app (user state remains null).
  return <>{children}</>;
}
