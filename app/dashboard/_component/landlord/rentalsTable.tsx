// components/dashboard/landlord/rentals-table.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  LandlordRental,
  RentalStatus,
  useLandlordRentals,
  useUpdateRentalStatus,
} from "@/hooks/useLandlordRentals";

import { Check, X } from "lucide-react";
import Link from "next/link";

// Helper to get badge styles based on status
const getStatusBadge = (status: RentalStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20">
          Pending
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20">
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20"
        >
          Rejected
        </Badge>
      );
    case "ACTIVE":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20">
          Active
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="secondary"
          className="bg-gray-500/10 text-gray-600 border-gray-500/30 hover:bg-gray-500/20"
        >
          Completed
        </Badge>
      );
    case "CANCELED":
      return (
        <Badge
          variant="outline"
          className="bg-slate-700/10 text-slate-700 border-slate-700/30 hover:bg-slate-700/20"
        >
          Canceled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function RentalsTable() {
  const { data, isPending, isError } = useLandlordRentals();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateRentalStatus();

  const rentals = data?.data || [];

  // Updated handlers to call the mutation
  const handleApprove = (id: string) =>
    updateStatus({ rentalId: id, status: "APPROVED" });
  const handleReject = (id: string) =>
    updateStatus({ rentalId: id, status: "REJECTED" });

  if (isError)
    return (
      <div className="text-center text-destructive py-8">
        Failed to load rental requests.
      </div>
    );

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Property</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Move-in Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : rentals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-12"
              >
                No rental requests found.
              </TableCell>
            </TableRow>
          ) : (
            rentals.map((rental: LandlordRental) => (
              <TableRow key={rental.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/landlord/requests/${rental.id}?tenantId=${rental.tenant.id}`}
                  >
                    <p className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer">
                      {rental.property.title}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    ${rental.property.rentPrice} | {rental.property.city}
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
                <TableCell className="text-sm text-muted-foreground">
                  {rental.leaseMonths} Month(s)
                </TableCell>
                <TableCell>{getStatusBadge(rental.status)}</TableCell>
                <TableCell className="text-right">
                  {/* Landlord can only take action if the status is PENDING */}
                  {rental.status === "PENDING" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600/30 hover:bg-green-600/10"
                        onClick={() => handleApprove(rental.id)}
                        disabled={isUpdating} // Disable while mutation is running
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600/30 hover:bg-red-600/10"
                        onClick={() => handleReject(rental.id)}
                        disabled={isUpdating} // Disable while mutation is running
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
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
  );
}
