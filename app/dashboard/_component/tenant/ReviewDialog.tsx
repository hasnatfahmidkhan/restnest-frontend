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
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReview } from "@/hooks/useReviews";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
  rentalId: string;
  propertyTitle: string;
}

export default function ReviewDialog({
  open,
  onOpenChange,
  rentalId,
  propertyTitle,
}: ReviewDialogProps) {
  const { mutate: submitReview, isPending } = useSubmitReview(rentalId);

  const {
    handleSubmit,
    setValue,
    control,
    register,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const ratingValue = useWatch({
    control,
    name: "rating",
  });

  const onSubmit = (data: ReviewFormValues) => {
    submitReview(data, {
      onSuccess: () => onOpenChange(false), // Close dialog on success
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="m:max-w-125">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience living at{" "}
            <span className="font-semibold text-foreground">
              {propertyTitle}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {/* Rating Input */}
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

          {/* Comment Input */}
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
                  Submitting...
                </>
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
