"use client";

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
import { useLogout } from "@/hooks/auth.hooks";
import { cn } from "@/lib/utils";
import { ChevronDown, Home, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";

interface UserDropdownProps {
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  profilePhoto?: string; // Added optional profilePhoto prop
}

const ROLE_BADGE: Record<string, string> = {
  TENANT: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  LANDLORD: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ADMIN: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
};

const ROLE_DASHBOARD: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export function UserDropdown({ email, role, profilePhoto }: UserDropdownProps) {
  const initial = email.charAt(0).toUpperCase();
  const displayName = email.split("@")[0];
  const dashboardHref = ROLE_DASHBOARD[role];

  const { logout } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group relative h-10 w-auto rounded-full border border-border/60 p-1 pr-2 gap-1.5 cursor-pointer"
        >
          <Avatar className="h-8 w-8 border border-border/60">
            {profilePhoto && (
              <AvatarImage src={profilePhoto} alt={displayName} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs uppercase">
              {initial}
            </AvatarFallback>
          </Avatar>

          {/* Chevron Icon with Flip Animation */}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User info header */}
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none capitalize">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
            <span
              className={cn(
                "mt-1.5 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                ROLE_BADGE[role],
              )}
            >
              {role}
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
            href={dashboardHref}
            className="cursor-pointer flex items-center"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/${role.toLowerCase()}/profile`}
            className="cursor-pointer flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
