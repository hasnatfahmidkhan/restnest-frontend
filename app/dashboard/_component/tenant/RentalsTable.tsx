"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Ban, CreditCard, Star } from "lucide-react";

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

import { useCreatePaymentSession } from "@/hooks/usePayment";
import {
  TenantRental,
  TenantRentalStatus,
  useCancelRental,
  useTenantRentals,
} from "@/hooks/useTenantRentals";

import ReviewDialog from "./ReviewDialog";

const DEFAULT_LIMIT = 10;

const STATUS_OPTIONS: {
  label: string;
  value: TenantRentalStatus;
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

const getStatusBadge = (status: TenantRentalStatus) => {
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
      return <Badge variant="outline">Canceled</Badge>;

    default:
      return <Badge>{status}</Badge>;
  }
};

export default function TenantRentalsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [selectedRental, setSelectedRental] = useState<{
    id: string;
    title: string;
  } | null>(null);

  /*
   * Read query parameters
   */
  const searchTermFromUrl = searchParams.get("searchTerm") ?? "";

  const statusFromUrl =
    (searchParams.get("status") as TenantRentalStatus | null) ?? undefined;

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
   * API request will be triggered
   * 500ms after the user stops typing.
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
  const { data, isPending, isError, error } = useTenantRentals({
    searchTerm: searchTermFromUrl || undefined,
    status: statusFromUrl,
    page: pageFromUrl,
    limit: limitFromUrl,
  });

  console.log(data);

  /*
   * Mutations
   */
  const { mutate: cancelRental, isPending: isCanceling } = useCancelRental();

  const { mutate: createPayment, isPending: isCreatingPayment } =
    useCreatePaymentSession();

  const rentals = data?.data?.rentals ?? [];
  const pagination = data?.data?.pagination;

  /*
   * Pay Now
   */
  const handlePayNow = (id: string) => {
    createPayment(id);
  };

  /*
   * Review
   */
  const handleReview = (rental: TenantRental) => {
    setSelectedRental({
      id: rental.id,
      title: rental.property.title,
    });

    setIsReviewOpen(true);
  };

  /*
   * Cancel rental
   */
  const handleCancel = (id: string) => {
    cancelRental(id);
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
   * Limit
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

    if (page < 1 || page > pagination.totalPage) {
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
          : "Failed to load your rental requests."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* =========================
          Search & Filters
      ========================== */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          {/* Search */}
          <Input
            defaultValue={searchTermFromUrl}
            placeholder="Search property or location..."
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
            <SelectTrigger className="w-full sm:w-[180px]">
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
          <SelectTrigger className="w-full sm:w-[130px]">
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
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-md" />

                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28" />
                      </div>
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
                <TableCell colSpan={5} className="h-24 text-center">
                  You have no rental requests yet.
                </TableCell>
              </TableRow>
            ) : (
              rentals.map((rental: TenantRental) => (
                <TableRow key={rental.id}>
                  {/* =========================
                        Property
                    ========================== */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {rental.property.propertyImages?.[0] ? (
                        <Image
                          src={rental.property.propertyImages[0].url}
                          alt={rental.property.title}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}

                      <div>
                        <Link
                          href={`/dashboard/requests/${rental.id}?tenantId=${rental.tenant.id}`}
                          className="font-medium hover:underline hover:text-primary"
                        >
                          {rental.property.title}
                        </Link>

                        <p className="text-sm text-muted-foreground">
                          ${rental.property.rentPrice} · {rental.property.city}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* =========================
                        Move-in Date
                    ========================== */}
                  <TableCell>
                    {new Date(rental.moveInDate).toLocaleDateString()}
                  </TableCell>

                  {/* =========================
                        Duration
                    ========================== */}
                  <TableCell>{rental.leaseMonths} Month(s)</TableCell>

                  {/* =========================
                        Status
                    ========================== */}
                  <TableCell>{getStatusBadge(rental.status)}</TableCell>

                  {/* =========================
                        Actions
                    ========================== */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* APPROVED */}
                      {rental.status === "APPROVED" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(rental.id)}
                            disabled={isCreatingPayment}
                          >
                            <CreditCard className="mr-1 h-4 w-4" />
                            Pay Now
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600/30 text-red-600 hover:bg-red-600/10"
                            onClick={() => handleCancel(rental.id)}
                            disabled={isCanceling}
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      )}

                      {/* PENDING */}
                      {rental.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600/30 text-red-600 hover:bg-red-600/10"
                          onClick={() => handleCancel(rental.id)}
                          disabled={isCanceling}
                        >
                          <Ban className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      )}

                      {/* COMPLETED */}
                      {rental.status === "COMPLETED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReview(rental)}
                        >
                          <Star className="mr-1 h-4 w-4" />
                          Leave Review
                        </Button>
                      )}

                      {/* No action */}
                      {["REJECTED", "ACTIVE", "CANCELED"].includes(
                        rental.status,
                      ) && (
                        <span className="text-xs italic text-muted-foreground">
                          No action required
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* =========================
            Review Dialog
        ========================== */}
        {selectedRental && (
          <ReviewDialog
            open={isReviewOpen}
            onOpenChange={setIsReviewOpen}
            rentalId={selectedRental.id}
            propertyTitle={selectedRental.title}
          />
        )}
      </div>

      {/* =========================
          Pagination
      ========================== */}
      {pagination && pagination.totalPage > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Pagination Info */}
          <p className="text-sm text-muted-foreground">
            Showing page{" "}
            <span className="font-medium text-foreground">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.totalPage}
            </span>{" "}
            ({pagination.total} total rentals)
          </p>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isPending}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>

            <span className="min-w-[70px] text-center text-sm">
              {pagination.page} / {pagination.totalPage}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPage || isPending}
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
