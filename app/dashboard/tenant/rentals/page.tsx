import TenantRentalsTable from "../../_component/tenant/RentalsTable";

export default function TenantRentalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          My Rentals
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your rental requests, payments, and history.
        </p>
      </div>

      <TenantRentalsTable />
    </div>
  );
}
