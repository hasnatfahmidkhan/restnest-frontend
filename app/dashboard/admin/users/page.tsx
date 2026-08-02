import AdminUsersTable from "../../_component/admin/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Manage Users
        </h1>
        <p className="text-muted-foreground mt-1">
          View, filter, and manage tenant/landlord accounts.
        </p>
      </div>

      <AdminUsersTable />
    </div>
  );
}
