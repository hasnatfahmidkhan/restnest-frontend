"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Hash,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type PaymentDetails = {
  id: string;
  amount: string;
  status: string;
  paidAt: string;
  transactionId: string;
  rentalRequest: {
    property: {
      title: string;
      address: string;
      city: string;
    };
    moveInDate: string;
    leaseMonths: number;
  };
};

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
    }
  }, [sessionId, router]);

  const { data, isPending, isError } = useQuery<{
    success: boolean;
    data: PaymentDetails;
  }>({
    queryKey: ["payment-success", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/payments/success?session_id=${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch payment details");
      return res.json();
    },
    enabled: !!sessionId,
  });

  if (!sessionId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="max-w-md mx-auto my-20">
        <Skeleton className="h-40 w-full rounded-2xl mb-6" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="max-w-md mx-auto my-20 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Payment Verification Failed
        </h1>
        <p className="text-muted-foreground mb-8">
          We could not verify your payment. Please contact support if you were
          charged.
        </p>
        <Link href="/dashboard/tenant">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const payment = data.data;

  return (
    <div className="max-w-md mx-auto my-12 md:my-20 px-4">
      {/* Success Icon Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20"></div>
          <div className="relative w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/30">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mt-2">
          Your booking is now confirmed. Enjoy your new home!
        </p>
      </motion.div>

      {/* Receipt Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Receipt</span>
              <span className="text-xs font-normal text-muted-foreground">
                {new Date(payment.paidAt).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Property Info */}
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-semibold text-foreground">
                  {payment.rentalRequest.property.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.rentalRequest.property.address},{" "}
                  {payment.rentalRequest.property.city}
                </p>
              </div>
            </div>

            {/* Lease Info */}
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {payment.rentalRequest.leaseMonths} Month Lease
                </p>
                <p className="text-xs text-muted-foreground">
                  Starting:{" "}
                  {new Date(
                    payment.rentalRequest.moveInDate,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="w-4 h-4" /> Transaction ID
                </span>
                <span className="font-mono text-foreground">
                  {payment.transactionId.substring(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  <DollarSign className="w-4 h-4" /> Amount Paid
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${payment.amount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col gap-3"
      >
        <Link href="/dashboard/tenant/payment-history">
          <Button className="w-full" size="lg">
            View Payment History <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/dashboard/tenant">
          <Button variant="outline" className="w-full" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
