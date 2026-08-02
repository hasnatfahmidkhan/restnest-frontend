import AdminRentalsTable from "../../_component/admin/RentalsTable";

export default function AdminRentalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Manage Rentals
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor all rental agreements and payment statuses across the
          platform.
        </p>
      </div>

      <AdminRentalsTable />
    </div>
  );
}
