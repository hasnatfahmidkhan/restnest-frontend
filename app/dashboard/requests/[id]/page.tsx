import RentalDetails from "@/app/dashboard/_component/rentalDetails";
import { Suspense } from "react";

export default async function RentalDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-4 md:p-8">
      {/* Suspense is required because we use useSearchParams inside the component */}
      <Suspense fallback={<div>Loading...</div>}>
        <RentalDetails params={params} />
      </Suspense>
    </div>
  );
}
