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
import { useCreatePaymentSession } from "@/hooks/useCreatePaymentSession";
import {
  TenantRental,
  TenantRentalStatus,
  useCancelRental,
  useTenantRentals,
} from "@/hooks/useTenantRentals";

import { Ban, CreditCard, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReviewDialog from "./ReviewDialog";

// Helper to get badge styles based on status
const getStatusBadge = (status: TenantRentalStatus) => {
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
      // Choosing a muted slate/outline style for canceled
      return (
        <Badge
          variant="outline"
          className="bg-slate-700/10 text-slate-500 border-slate-700/30 hover:bg-slate-700/20"
        >
          Canceled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function TenantRentalsTable() {
  const { data, isPending, isError } = useTenantRentals();
  const { mutate: cancelRental, isPending: isCanceling } = useCancelRental();
  const { mutate: createPayment } = useCreatePaymentSession();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const rentals = data?.data || [];

  const handlePayNow = (id: string) => createPayment(id);

  const handleReview = (rental: TenantRental) => {
    setSelectedRental({ id: rental.id, title: rental.property.title });
    setIsReviewOpen(true);
  };

  const handleCancel = (id: string) => cancelRental(id);

  if (isError)
    return (
      <div className="text-center text-destructive py-8">
        Failed to load your rental requests.
      </div>
    );

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Property</TableHead>
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
                <TableCell colSpan={5}>
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : rentals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-12"
              >
                You have no rental requests yet.
              </TableCell>
            </TableRow>
          ) : (
            rentals.map((rental: TenantRental) => (
              <TableRow key={rental.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md bg-muted overflow-hidden shrink-0">
                      {rental.property.propertyImages?.[0] ? (
                        <Image
                          fill
                          src={rental.property.propertyImages[0].url}
                          alt={rental.property.title}
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      {/* Updated Link to /dashboard/requests/:id */}
                      <Link href={`/dashboard/requests/${rental.id}`}>
                        <p className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer">
                          {rental.property.title}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        ${rental.property.rentPrice} | {rental.property.city}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(rental.moveInDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {rental.leaseMonths} Month(s)
                </TableCell>
                <TableCell>{getStatusBadge(rental.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* APPROVED: Shows Pay Now & Cancel */}
                    {rental.status === "APPROVED" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handlePayNow(rental.id)}
                        >
                          <CreditCard className="w-4 h-4 mr-1" /> Pay Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600/30 hover:bg-red-600/10"
                          onClick={() => handleCancel(rental.id)}
                          disabled={isCanceling}
                        >
                          <Ban className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </>
                    )}

                    {/* PENDING: Shows Cancel only */}
                    {rental.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600/30 hover:bg-red-600/10"
                        onClick={() => handleCancel(rental.id)}
                        disabled={isCanceling}
                      >
                        <Ban className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    )}

                    {/* ACTIVE: Shows Leave Review */}
                    {rental.status === "COMPLETED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReview(rental)}
                      >
                        <Star className="w-4 h-4 mr-1" /> Leave Review
                      </Button>
                    )}

                    {/* REJECTED, COMPLETED, CANCELED: No action */}
                    {!["REJECTED", "COMPLETED", "CANCELED"].includes(
                      rental.status,
                    ) && (
                      <span className="text-xs text-muted-foreground italic">
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
      {selectedRental && (
        <ReviewDialog
          open={isReviewOpen}
          onOpenChange={setIsReviewOpen}
          rentalId={selectedRental.id}
          propertyTitle={selectedRental.title}
        />
      )}
    </div>
  );
}
