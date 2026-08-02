import MyReviewsTable from "../../_component/tenant/MyReviewsTable";

export default function MyReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          My Reviews
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage the reviews you&apos;ve submitted for past rentals.
        </p>
      </div>

      <MyReviewsTable />
    </div>
  );
}
