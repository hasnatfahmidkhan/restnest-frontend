import PaymentsTable from "../../_component/tenant/PaymentTable";


export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Payment History</h1>
        <p className="text-muted-foreground mt-1">View all your past transactions and invoices.</p>
      </div>
      
      <PaymentsTable />
    </div>
  );
}