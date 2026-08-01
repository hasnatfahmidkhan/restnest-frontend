import RentalsTable from "../../_component/landlord/rentalsTable";

export default function RentalsRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Rental Requests
        </h1>
        <p className="text-muted-foreground mt-1">
          Review, approve, or reject incoming tenancy requests.
        </p>
      </div>

      <RentalsTable />
    </div>
  );
}
