import StatsLandlord from "../_component/landlord/StatsLandlord";

export default function LandlordDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your properties.
        </p>
      </div>

      <StatsLandlord />
    </div>
  );
}
