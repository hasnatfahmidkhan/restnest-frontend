import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ReviewPayload = {
  rating: number;
  comment: string;
};

export type MyReview = {
  id: string;
  rating: string;
  comment: string;
  createdAt: string;
  rentalRequest: {
    property: {
      id: string;
      title: string;
      propertyImages: { url: string }[];
    };
  };
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

export const useMyReviews = () => {
  return useQuery<{ success: boolean; data: MyReview[] }>({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/my-reviews`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch your reviews");
      return res.json();
    },
  });
};

// Hook to update a review
export const useUpdateReview = (reviewId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update review");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
