import { useMutation } from "@tanstack/react-query";
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
