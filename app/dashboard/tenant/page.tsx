import TenantStatsDashboard from "../_component/tenant/TenantStats";

export default function TenantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your rental activity.
        </p>
      </div>

      <TenantStatsDashboard />
    </div>
  );
}
