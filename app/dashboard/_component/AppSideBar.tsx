"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";
import {
  Building,
  FileText,
  Home,
  LayoutDashboard,
  Settings,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const role = user?.role?.toLowerCase() || "tenant";
  const baseUrl = `/dashboard/${role}`;

  const navItems = [
    {
      title: "Dashboard",
      url: baseUrl,
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: `${baseUrl}/profile`,
      icon: Settings,
    },
  ];

  // Add role-specific links
  if (user?.role === "TENANT") {
    navItems.push({
      title: "My Rentals",
      url: `${baseUrl}/rentals`,
      icon: FileText,
    });
    navItems.push({
      title: "My Reviews",
      url: `${baseUrl}/reviews`,
      icon: Star,
    });
  } else if (user?.role === "LANDLORD") {
    navItems.push({
      title: "My Properties",
      url: `${baseUrl}/properties`,
      icon: Building,
    });
    navItems.push({
      title: "Requests",
      url: `${baseUrl}/requests`,
      icon: FileText,
    });
  } else if (user?.role === "ADMIN") {
    navItems.push({
      title: "Manage Users",
      url: `${baseUrl}/users`,
      icon: Users,
    });
    navItems.push({
      title: "Manage Properties",
      url: `${baseUrl}/properties`,
      icon: Building,
    });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="w-4 h-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-heading font-semibold">
                    RestNest
                  </span>
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {user?.role || "User"} Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
