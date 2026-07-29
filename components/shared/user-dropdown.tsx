"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";

interface UserDropdownProps {
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
}

const ROLE_BADGE: Record<string, string> = {
  TENANT: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  LANDLORD: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ADMIN: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
};

const ROLE_DASHBOARD: Record<string, string> = {
  TENANT: "/tenant/rentals",
  LANDLORD: "/landlord/dashboard",
  ADMIN: "/admin/dashboard",
};

export function UserDropdown({ email, role }: UserDropdownProps) {
  const initial = email.charAt(0).toUpperCase();
  const displayName = email.split("@")[0];
  const dashboardHref = ROLE_DASHBOARD[role];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="group flex items-center gap-1.5 rounded-full border border-border/60 bg-background py-1 pl-1 pr-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold uppercase text-primary-foreground">
            {initial}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className={cn(
            "z-50 min-w-[16rem] overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-lg shadow-black/5",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          {/* User info header */}
          <div className="mb-1 border-b border-border/60 px-3 py-2.5">
            <p className="truncate text-sm font-medium capitalize">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
            <span
              className={cn(
                "mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                ROLE_BADGE[role],
              )}
            >
              {role}
            </span>
          </div>

          {/* Items */}
          <DropdownMenu.Item asChild>
            <Link
              href={dashboardHref}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/90 outline-none transition-colors hover:bg-accent data-highlighted:bg-accent"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/90 outline-none transition-colors hover:bg-accent data-highlighted:bg-accent">
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/90 outline-none transition-colors hover:bg-accent data-highlighted:bg-accent">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border/60" />

          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 data-highlighted:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
