// components/dashboard/landlord/rental-details.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRentalDetails } from "@/hooks/useLandlordRentals";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

export default function RentalDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const router = useRouter();
  const { data, isPending, isError } = useRentalDetails(id, tenantId);
 

  if (isPending) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-40" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="text-center text-destructive py-20">
        Failed to load rental details.
      </div>
    );
  }

  const rental = data.data;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      APPROVED: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      REJECTED: "bg-red-500/10 text-red-600 border-red-500/30",
      ACTIVE: "bg-green-500/10 text-green-600 border-green-500/30",
    };
    return <Badge className={styles[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Requests
      </Button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold">
          Rental Request Details
        </h1>
        {getStatusBadge(rental.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Property</p>
              <p className="font-medium">{rental.property.title}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <p className="text-sm">
                {rental.property.address ||
                  `${rental.property.city}, ${rental.property.division}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rent Price</p>
              <p className="font-medium text-primary">
                ${rental.property.rentPrice}/month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tenant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {rental.tenant.name || "Not provided"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a
                href={`mailto:${rental.tenant.email}`}
                className="text-sm hover:text-primary"
              >
                {rental.tenant.email}
              </a>
            </div>
            {rental.tenant.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{rental.tenant.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lease Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lease Terms</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8 p-2 bg-muted rounded-md text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Move-in Date</p>
              <p className="text-sm font-medium">
                {new Date(rental.moveInDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 p-2 bg-muted rounded-md text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium">
                {rental.leaseMonths} Month(s)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8 p-2 bg-muted rounded-md text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">End Date</p>
              <p className="text-sm font-medium">
                {new Date(rental.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Message (if any) */}
      {rental.message && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tenant Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              &quot;{rental.message}&quot;
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {rental.status === "PENDING" && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="text-red-600 border-red-600/30 hover:bg-red-600/10"
            onClick={() => toast.error("Request Rejected")}
          >
            <X className="w-4 h-4 mr-2" /> Reject Request
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() =>
              toast.success("Request Approved! Tenant can now pay.")
            }
          >
            <Check className="w-4 h-4 mr-2" /> Approve Request
          </Button>
        </div>
      )}
    </div>
  );
}
