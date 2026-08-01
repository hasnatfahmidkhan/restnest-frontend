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
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemData: any;
  itemName?: string;
  entityType: string;
  onDeleteAction: (
    id: string,
  ) => Promise<{ success: boolean; message?: string }>;
  onSuccess?: () => void; // Callback to refresh data
}

export default function DeleteDialog({
  open,
  onOpenChange,
  itemData,
  itemName,
  entityType,
  onDeleteAction,
  onSuccess,
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!itemData?.id) return;

    setIsDeleting(true);
    const result = await onDeleteAction(itemData.id);

    if (result.success) {
      toast.success(result.message || `${entityType} deleted successfully!`);
      onSuccess?.(); // Trigger table refresh
      onOpenChange(false); // Close dialog
    } else {
      toast.error(result.message || `Failed to delete ${entityType}`);
    }

    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" /> Delete {entityType}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {entityType.toLowerCase()}
            <span className="font-semibold text-foreground">
              {" "}
              &quot;{itemName || itemData?.id}&quot;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
