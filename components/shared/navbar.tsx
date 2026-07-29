"use client";

import { cn } from "@/lib/utils";
import { Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggler } from "./theme-toggler";
import { UserDropdown } from "./user-dropdown";

//  Demo user — replace with zustand/auth store later
const user = {
  email: "tenant@rentnest.com",
  role: "TENANT" as "TENANT" | "LANDLORD" | "ADMIN",
};

const ROLE_ROUTES: Record<string, { label: string; href: string }[]> = {
  TENANT: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "My Rentals", href: "/tenant/rentals" },
    { label: "Payments", href: "/tenant/payments" },
  ],
  LANDLORD: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Dashboard", href: "/landlord/dashboard" },
    { label: "My Properties", href: "/landlord/properties" },
    { label: "Requests", href: "/landlord/requests" },
  ],
  ADMIN: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Rentals", href: "/admin/rentals" },
  ],
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routes = ROLE_ROUTES[user.role] ?? ROLE_ROUTES.TENANT;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Left: Logo ───────────────────────────── */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Home className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Rent<span className="text-primary">Nest</span>
          </span>
        </Link>

        {/* ── Middle: Desktop routes ───────────────── */}
        <div className="hidden items-center gap-1 md:flex">
          {routes.map((route) => {
            const active = isActive(route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {route.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right: Toggler + Dropdown + Mobile toggle ── */}
        <div className="flex items-center gap-1.5">
          <ThemeToggler />
          <UserDropdown email={user.email} role={user.role} />

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ──────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="space-y-0.5 px-4 py-3">
            {routes.map((route) => {
              const active = isActive(route.href);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {route.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
