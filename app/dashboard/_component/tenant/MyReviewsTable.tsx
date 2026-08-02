"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MyReview, useMyReviews } from "@/hooks/useReviews";
import { Pencil, Star } from "lucide-react";
import { useState } from "react";
import ReviewDialog from "./ReviewDialog";

export default function MyReviewsTable() {
  const { data, isPending, isError } = useMyReviews();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<MyReview | null>(null);

  const reviews = data?.data || [];

  const handleEdit = (review: MyReview) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  if (isError)
    return (
      <div className="text-center text-destructive py-8">
        Failed to load reviews.
      </div>
    );

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Property</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-12"
                >
                  You haven&apos;t submitted any reviews yet.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium text-foreground">
                    {review.rentalRequest.property.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="font-semibold text-foreground">
                        {parseFloat(review.rating).toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {review.comment}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(review)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reusable Review Dialog (Update Mode) */}
      <ReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reviewId={selectedReview?.id}
        propertyTitle={selectedReview?.rentalRequest.property.title || ""}
        reviewData={
          selectedReview
            ? { rating: selectedReview.rating, comment: selectedReview.comment }
            : null
        }
      />
    </>
  );
}
