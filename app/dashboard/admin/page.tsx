import AdminStatsDashboard from "../_component/admin/StatsAdmin";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform-wide statistics and insights.</p>
      </div>
      
      <AdminStatsDashboard />
    </div>
  );
}