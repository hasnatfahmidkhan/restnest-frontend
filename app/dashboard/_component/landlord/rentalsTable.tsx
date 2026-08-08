"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  LandlordRental,
  RentalStatus,
  useLandlordRentals,
  useUpdateRentalStatus,
} from "@/hooks/useLandlordRentals";

const DEFAULT_LIMIT = 10;

const STATUS_OPTIONS: {
  label: string;
  value: RentalStatus;
}[] = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Approved",
    value: "APPROVED",
  },
  {
    label: "Rejected",
    value: "REJECTED",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Canceled",
    value: "CANCELED",
  },
];

const getStatusBadge = (status: RentalStatus) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;

    case "APPROVED":
      return <Badge>Approved</Badge>;

    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>;

    case "ACTIVE":
      return <Badge className="bg-green-600 hover:bg-green-600">Active</Badge>;

    case "COMPLETED":
      return <Badge variant="outline">Completed</Badge>;

    case "CANCELED":
      return <Badge variant="destructive">Canceled</Badge>;

    default:
      return <Badge>{status}</Badge>;
  }
};

export default function RentalsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * Read query parameters from URL
   */
  const searchTermFromUrl = searchParams.get("searchTerm") ?? "";

  const statusFromUrl =
    (searchParams.get("status") as RentalStatus | null) ?? undefined;

  const pageFromUrl = Number(searchParams.get("page") ?? "1");

  const limitFromUrl = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);

  /*
   * Update URL query parameters
   */
  const updateQueryParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  /*
   * Debounced search
   *
   * API request will only happen after
   * the user stops typing for 500ms.
   */
  const handleSearch = useDebouncedCallback((value: string) => {
    updateQueryParams({
      searchTerm: value.trim() || undefined,
      page: "1",
    });
  }, 500);

  /*
   * Fetch rentals
   */
  const { data, isPending, isError, error } = useLandlordRentals({
    searchTerm: searchTermFromUrl || undefined,
    status: statusFromUrl,
    page: pageFromUrl,
    limit: limitFromUrl,
  });

  /*
   * Rental mutation
   */
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateRentalStatus();

  /*
   * Backend response:
   *
   * data: {
   *   rentals: [],
   *   pagination: {}
   * }
   */
  const rentals = data?.data.rentals ?? [];
  const pagination = data?.data.pagination;

  /*
   * Approve rental
   */
  const handleApprove = (id: string) => {
    updateStatus({
      rentalId: id,
      status: "APPROVED",
    });
  };

  /*
   * Reject rental
   */
  const handleReject = (id: string) => {
    updateStatus({
      rentalId: id,
      status: "REJECTED",
    });
  };

  /*
   * Status filter
   */
  const handleStatusChange = (value: string) => {
    updateQueryParams({
      status: value === "ALL" ? undefined : value,
      page: "1",
    });
  };

  /*
   * Change limit
   */
  const handleLimitChange = (value: string) => {
    updateQueryParams({
      limit: value,
      page: "1",
    });
  };

  /*
   * Pagination
   */
  const handlePageChange = (page: number) => {
    if (!pagination) return;

    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    updateQueryParams({
      page: String(page),
    });
  };

  /*
   * Error state
   */
  if (isError) {
    return (
      <div className="rounded-md border p-6 text-center text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "Failed to load rental requests."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* =========================
          Filters
      ========================== */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          {/* Search */}
          <Input
            defaultValue={searchTermFromUrl}
            placeholder="Search tenant or property..."
            onChange={(event) => {
              handleSearch(event.target.value);
            }}
            className="sm:max-w-sm"
          />

          {/* Status Filter */}
          <Select
            value={statusFromUrl ?? "ALL"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full m:w-45">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>

              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Limit */}
        <Select value={String(limitFromUrl)} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-full sm:w-32.5">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="5">5 / page</SelectItem>

            <SelectItem value="10">10 / page</SelectItem>

            <SelectItem value="20">20 / page</SelectItem>

            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* =========================
          Table
      ========================== */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>

              <TableHead>Tenant</TableHead>

              <TableHead>Move-in Date</TableHead>

              <TableHead>Duration</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading */}
            {isPending ? (
              Array.from({
                length: limitFromUrl,
              }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-8 w-28" />
                  </TableCell>
                </TableRow>
              ))
            ) : rentals.length === 0 ? (
              /* Empty */
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No rental requests found.
                </TableCell>
              </TableRow>
            ) : (
              /* Rentals */
              rentals.map((rental: LandlordRental) => (
                <TableRow key={rental.id}>
                  {/* Property */}
                  <TableCell>
                    <Link
                      href={`/dashboard/requests/${rental.id}?tenantId=${rental.tenant.id}`}
                      className="font-medium hover:underline"
                    >
                      {rental.property.title}
                    </Link>

                    <p className="text-sm text-muted-foreground">
                      ${rental.property.rentPrice} · {rental.property.city}
                    </p>
                  </TableCell>

                  {/* Tenant */}
                  <TableCell>
                    <p className="font-medium">
                      {rental.tenant.name || "Unnamed"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {rental.tenant.email}
                    </p>
                  </TableCell>

                  {/* Move-in Date */}
                  <TableCell>
                    {new Date(rental.moveInDate).toLocaleDateString()}
                  </TableCell>

                  {/* Duration */}
                  <TableCell>{rental.leaseMonths} Month(s)</TableCell>

                  {/* Status */}
                  <TableCell>{getStatusBadge(rental.status)}</TableCell>

                  {/* Actions */}
                  <TableCell>
                    {rental.status === "PENDING" ? (
                      <div className="flex items-center gap-2">
                        {/* Accept */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600/30 text-green-600 hover:bg-green-600/10"
                          onClick={() => handleApprove(rental.id)}
                          disabled={isUpdating}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Accept
                        </Button>

                        {/* Reject */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600/30 text-red-600 hover:bg-red-600/10"
                          onClick={() => handleReject(rental.id)}
                          disabled={isUpdating}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No action required
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* =========================
          Pagination
      ========================== */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Pagination info */}
          <p className="text-sm text-muted-foreground">
            Showing page{" "}
            <span className="font-medium text-foreground">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.totalPages}
            </span>{" "}
            ({pagination.total} total requests)
          </p>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isPending}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>

            <span className="min-w-17.5 text-center text-sm">
              {pagination.page} / {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || isPending}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
