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
  AdminRental,
  AdminRentalStatus,
  PaymentStatus,
  useAdminRentals,
} from "@/hooks/useAdminRentals";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

// Helper for Rental Status Badges
const getRentalStatusBadge = (status: AdminRentalStatus) => {
  const styles: Record<AdminRentalStatus, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    APPROVED: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/30",
    ACTIVE: "bg-green-500/10 text-green-600 border-green-500/30",
    COMPLETED: "bg-gray-500/10 text-gray-600 border-gray-500/30",
    CANCELED: "bg-slate-700/10 text-slate-500 border-slate-700/30",
  };
  return (
    <Badge className={styles[status]} variant="outline">
      {status}
    </Badge>
  );
};

// Helper for Payment Status Badges
const getPaymentStatusBadge = (status?: PaymentStatus) => {
  if (!status)
    return (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
        Unpaid
      </Badge>
    );

  const styles: Record<PaymentStatus, string> = {
    COMPLETED: "bg-green-500/10 text-green-600 border-green-500/30",
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    FAILED: "bg-red-500/10 text-red-600 border-red-500/30",
    CANCELED: "bg-slate-700/10 text-slate-500 border-slate-700/30",
  };
  return (
    <Badge className={styles[status]} variant="outline">
      {status}
    </Badge>
  );
};

export default function AdminRentalsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    searchTerm: searchParams.get("searchTerm") || "",
    status: (searchParams.get("status") as AdminRentalStatus) || undefined,
    paymentStatus:
      (searchParams.get("paymentStatus") as PaymentStatus) || undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };

  const { data, isPending, isError } = useAdminRentals(filters);
  const rentals = (data?.data as AdminRental[]) || [];
  const meta = data?.meta;

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
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

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by property, tenant, landlord..."
            className="pl-9"
            defaultValue={filters.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select
            defaultValue={filters.status || "all"}
            onValueChange={(val) => updateQuery("status", val)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Rental Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rentals</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.paymentStatus || "all"}
            onValueChange={(val) => updateQuery("paymentStatus", val)}
          >
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
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
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="rentPrice">Rent Price</SelectItem>
              <SelectItem value="moveInDate">Move-in Date</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.sortOrder}
            onValueChange={(val) => updateQuery("sortOrder", val)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Property & Landlord</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Move-in Date</TableHead>
              <TableHead>Rent Status</TableHead>
              <TableHead>Payment Status</TableHead>
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
                  Failed to load rentals.
                </TableCell>
              </TableRow>
            ) : rentals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-12"
                >
                  No rental requests found.
                </TableCell>
              </TableRow>
            ) : (
              rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {rental.property.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${rental.property.rentPrice} | Landlord:{" "}
                      {rental.property.landlord.name ||
                        rental.property.landlord.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground">
                      {rental.tenant.name || "Unnamed"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rental.tenant.email}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(rental.moveInDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getRentalStatusBadge(rental.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(rental.payment?.status)}
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
            Page {meta.page} of {meta.totalPage} (Total: {meta.total} rentals)
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
