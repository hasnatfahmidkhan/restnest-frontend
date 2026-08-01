import { Suspense } from "react";
import SuccessContent from "../_component/SuccessContent";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
