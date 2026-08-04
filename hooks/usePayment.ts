import {
  createPaymentSessionService,
  getPaymentHistoryService,
} from "@/services/payment.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePaymentSession = () => {
  return useMutation({
    mutationFn: createPaymentSessionService,

    onSuccess: (data) => {
      if (data.success && data.data) {
        window.location.href = data.data;
      } else {
        toast.error("Invalid payment session response.");
      }
    },

    onError: (error: Error) => {
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
  return useQuery<{
    success: boolean;
    data: PaymentHistoryItem[];
  }>({
    queryKey: ["payment-history"],
    queryFn: getPaymentHistoryService,
  });
};
