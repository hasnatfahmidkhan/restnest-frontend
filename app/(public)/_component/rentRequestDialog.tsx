"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth-store";
import { KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { createRentalRequest, RentalState } from "../_actions/rentals";

export default function RentRequestDialog({
  propertyId,
}: {
  propertyId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Get current user from Zustand store
  const user = useAuthStore((state) => state.user);

  // Wrap the server action so we can handle side effects upon completion
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, isPending] = useActionState<RentalState, FormData>(
    async (prevState, formData) => {
      // 1. Execute the actual server action
      const result = await createRentalRequest(prevState, formData);

      // 2. Handle side effects safely after the action resolves
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false); // Close dialog safely
      } else if (result.error) {
        toast.error(result.error);
      }

      // 3. Return the state to update the form
      return result;
    },
    {},
  );

  // Handle the click event on the main button
  const handleRequestClick = () => {
    if (!user) {
      // If user is not logged in according to Zustand, redirect to login
      router.push(`/login?redirectTo=/properties/${propertyId}`);
    } else {
      // If user exists, open the dialog
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Manual trigger to check auth state before opening */}
      <Button className="w-full" size="lg" onClick={handleRequestClick}>
        <KeyRound className="w-4 h-4 mr-2" /> Send Rent Request
      </Button>

      <DialogContent className="`sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Send Rent Request</DialogTitle>
          <DialogDescription>
            Submit your details to the landlord to initiate the rental process.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          {/* Hidden input for propertyId */}
          <Input type="hidden" name="propertyId" value={propertyId} />

          <div className="space-y-2">
            <Label htmlFor="moveInDate">Move-in Date</Label>
            <Input
              id="moveInDate"
              name="moveInDate"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaseMonths">Lease Duration (Months)</Label>
            <Select name="leaseMonths" defaultValue="1">
              <SelectTrigger id="leaseMonths">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">1 Year (12 Months)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Introduce yourself to the landlord..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
