"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Home, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Cancelled Icon Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-500/10"></div>
            <div className="relative w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500/30">
              <XCircle className="w-12 h-12 text-red-600" />
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
            Payment Canceled
          </h1>
          <p className="text-muted-foreground mt-2">
            You have canceled the payment process. No money has been charged.
            Your rental request is still pending payment.
          </p>
        </motion.div>

        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <p>Your rental request is still approved by the landlord.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <p>
                  You can attempt the payment again at any time from your
                  dashboard.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <p>
                  If you face any issues, feel free to reach out to our support
                  team.
                </p>
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
          <Link href="/dashboard/tenant/rentals">
            <Button className="w-full" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </Link>
          <Link href="/dashboard/tenant">
            <Button variant="outline" className="w-full" size="lg">
              <Home className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
