// components/dashboard/app-header.tsx
"use client";

import { ThemeToggler } from "@/components/shared/theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppHeader() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    if (clearUser) clearUser();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <SidebarTrigger className="-ml-1" />

      {/* Logo for Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Home className="w-4 h-4" />
        </div>
        <span className="font-heading font-bold text-lg">RestNest</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme Toggler Added Here */}
        <ThemeToggler />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
            >
              <Avatar className="h-9 w-9 border border-border">
                {user?.profile?.profilePhoto && (
                  <AvatarImage
                    src={user.profile.profilePhoto}
                    alt={user.name || "User"}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "Not logged in"}
                </p>
                <span className="mt-2 text-xs inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  {user?.role || "UNKNOWN"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer flex items-center">
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/${user?.role.toLowerCase()}/profile`}
                className="cursor-pointer flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
