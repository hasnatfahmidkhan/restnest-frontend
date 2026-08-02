"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminUser,
  useAdminUsers,
  UserRole,
  UserStatus,
  useUpdateUserStatus,
} from "@/hooks/use-admin-users";
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const roleBadgeClass: Record<UserRole, string> = {
  TENANT: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  LANDLORD: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  ADMIN: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

const statusBadgeClass: Record<UserStatus, string> = {
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/30",
  BAN: "bg-red-500/10 text-red-600 border-red-500/30",
};

export default function AdminUsersTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  const filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    sortBy:
      (searchParams.get("sortBy") as "name" | "createdAt" | "email") ||
      "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    searchTerm: searchParams.get("searchTerm") || "",
    role: (searchParams.get("role") as UserRole) || undefined,
    status: (searchParams.get("status") as UserStatus) || undefined,
  };

  const { data, isPending, isError } = useAdminUsers(filters);
  const users = data?.data.data || [];
  const meta = data?.data.meta;

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateQuery("searchTerm", term);
  }, 500);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleToggleStatus = (user: AdminUser) => {
    const newStatus = user.status === "ACTIVE" ? "BAN" : "ACTIVE";
    updateStatus({ userId: user.id, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            defaultValue={filters.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select
            defaultValue={filters.role || "all"}
            onValueChange={(val) => updateQuery("role", val)}
          >
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="TENANT">Tenants</SelectItem>
              <SelectItem value="LANDLORD">Landlords</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.status || "all"}
            onValueChange={(val) => updateQuery("status", val)}
          >
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BAN">Banned</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.sortBy}
            onValueChange={(val) => updateQuery("sortBy", val)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Joined</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.sortOrder}
            onValueChange={(val) => updateQuery("sortOrder", val)}
          >
            <SelectTrigger className="w-27.5">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-destructive py-8"
                >
                  Failed to load users.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-12"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {user.name || "Unnamed User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={roleBadgeClass[user.role]}
                      variant="outline"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={statusBadgeClass[user.status]}
                      variant="outline"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(user)}
                      disabled={isUpdating}
                      className={
                        user.status === "ACTIVE"
                          ? "text-red-600 border-red-600/30 hover:bg-red-600/10"
                          : "text-green-600 border-green-600/30 hover:bg-green-600/10"
                      }
                    >
                      {user.status === "ACTIVE" ? (
                        <>
                          <Ban className="w-4 h-4 mr-1" /> Ban User
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Activate
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPage} (Total: {meta.total} users)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPage}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
