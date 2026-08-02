"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSubmitReview, useUpdateReview } from "@/hooks/useReviews";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import StarRating from "./star-rating";

const reviewSchema = z.object({
  rating: z.number().min(0.5, "Please select a rating").max(5),
  comment: z.string().min(10, "Review must be at least 10 characters long"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rentalId?: string; // Needed for Create mode
  reviewId?: string; // Needed for Update mode
  propertyTitle: string;
  reviewData?: { rating: string; comment: string } | null; // Needed for Update mode
}

export default function ReviewDialog({
  open,
  onOpenChange,
  rentalId,
  reviewId,
  propertyTitle,
  reviewData,
}: ReviewDialogProps) {
  const isEditMode = !!reviewData;

  const { mutate: submitReview, isPending: isSubmitting } = useSubmitReview(
    rentalId || "",
  );
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(
    reviewId || "",
  );

  const isPending = isSubmitting || isUpdating;

  const {
    handleSubmit,
    setValue,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  // Pre-fill form if in Edit mode
  useEffect(() => {
    if (open && reviewData) {
      reset({
        rating: parseFloat(reviewData.rating),
        comment: reviewData.comment,
      });
    } else if (open && !reviewData) {
      reset({ rating: 0, comment: "" }); // Clear form for Create mode
    }
  }, [open, reviewData, reset]);

  const ratingValue = useWatch({
    control,
    name: "rating",
  });

  const onSubmit = (data: ReviewFormValues) => {
    if (isEditMode) {
      updateReview(data, { onSuccess: () => onOpenChange(false) });
    } else {
      submitReview(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Your Review" : "Leave a Review"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update your experience for ${propertyTitle}.`
              : `Share your experience for ${propertyTitle}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <StarRating
              value={ratingValue}
              onChange={(val) =>
                setValue("rating", val, { shouldValidate: true })
              }
              disabled={isPending}
            />
            {errors.rating && (
              <p className="text-sm text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience..."
              rows={5}
              disabled={isPending}
              {...register("comment")}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  {isEditMode ? "Updating..." : "Submitting..."}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
