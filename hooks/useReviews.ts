import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ReviewPayload = {
  rating: number;
  comment: string;
};

export const useSubmitReview = (rentalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReviewPayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${rentalId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
