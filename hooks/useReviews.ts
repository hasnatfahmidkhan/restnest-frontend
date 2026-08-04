import {
  getMyReviewsService,
  submitReviewService,
  updateReviewService,
} from "@/services/review.service";
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
    mutationFn: (payload: ReviewPayload) =>
      submitReviewService(rentalId, payload),

    onSuccess: () => {
      toast.success("Review submitted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["tenant-rentals"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useMyReviews = () => {
  return useQuery<{
    success: boolean;
    data: MyReview[];
  }>({
    queryKey: ["my-reviews"],
    queryFn: getMyReviewsService,
  });
};

export const useUpdateReview = (reviewId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayload) =>
      updateReviewService(reviewId, payload),

    onSuccess: () => {
      toast.success("Review updated successfully!");

      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tenant-rentals"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
