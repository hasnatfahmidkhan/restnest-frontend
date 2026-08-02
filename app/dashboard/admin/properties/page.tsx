import AdminPropertiesTable from "../../_component/admin/PropertiesTable";

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Manage Properties
        </h1>
        <p className="text-muted-foreground mt-1">
          View, filter, and monitor all properties listed on the platform.
        </p>
      </div>

      <AdminPropertiesTable />
    </div>
  );
}
