"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentHistoryItem, usePaymentHistory } from "@/hooks/usePayment";

import { ImageOff } from "lucide-react";
import Image from "next/image";

// Helper to get badge styles based on payment status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20">
          Completed
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20">
          Pending
        </Badge>
      );
    case "FAILED":
    case "CANCELED":
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20"
        >
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function PaymentsTable() {
  const { data, isPending, isError } = usePaymentHistory();
  const payments = data?.data || [];

  if (isError) {
    return (
      <div className="text-center text-destructive py-8">
        Failed to load payment history.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Property</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
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
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-12"
              >
                No payment history found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment: PaymentHistoryItem) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                      {payment.rentalRequest.property.propertyImages?.[0] ? (
                        <Image
                          fill
                          src={
                            payment.rentalRequest.property.propertyImages[0].url
                          }
                          alt={payment.rentalRequest.property.title}
                          className="object-cover"
                        />
                      ) : (
                        <ImageOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-medium text-foreground">
                      {payment.rentalRequest.property.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">
                  {payment.transactionId.substring(0, 16)}...
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right font-bold text-foreground">
                  ${Number(payment.amount).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
