import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePaymentSession = () => {
  return useMutation({
    mutationFn: async (rentalRequestId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create`,
        {
          method: "POST",
          credentials: "include", // Send httpOnly cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rentalRequestId }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to create checkout session",
        );
      }

      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        window.location.href = data.data;
      } else {
        toast.error("Invalid payment session response.");
      }
    },
    onError: (error: Error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
};

export type PaymentHistoryItem = {
  id: string;
  amount: string;
  status: string;
  paidAt: string;
  transactionId: string;
  sessionId: string;
  rentalRequestId: string;
  rentalRequest: {
    status: string;
    moveInDate: string;
    endDate: string;
    property: {
      title: string;
      propertyImages: { url: string }[];
    };
  };
};

export const usePaymentHistory = () => {
  return useQuery<{ success: boolean; data: PaymentHistoryItem[] }>({
    queryKey: ["payment-history"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
        credentials: "include", // Send httpOnly cookies
      });
      if (!res.ok) throw new Error("Failed to fetch payment history");
      return res.json();
    },
  });
};
