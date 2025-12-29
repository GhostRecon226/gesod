import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { VinStatus } from "@/services/vehicleService";

const statusOptions: { value: VinStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "awaiting_action", label: "Awaiting Action" },
  { value: "in_progress", label: "In Progress" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Valid status values for validation
const validStatuses: VinStatus[] = ["pending", "active", "awaiting_action", "in_progress", "delayed", "completed", "cancelled"];

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (status: VinStatus, description: string) => Promise<void>;
  isLoading?: boolean;
  currentStatus?: VinStatus;
}

export function StatusUpdateDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  currentStatus,
}: StatusUpdateDialogProps) {
  const [status, setStatus] = useState<VinStatus | "">("");
  const [description, setDescription] = useState("");

  const handleStatusChange = (value: string) => {
    // Normalize and validate status value
    const normalizedValue = value.toLowerCase().replace(/ /g, "_") as VinStatus;
    if (validStatuses.includes(normalizedValue)) {
      setStatus(normalizedValue);
    } else {
      console.error(`Invalid status value received: ${value}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;
    
    await onSubmit(status, description);
    setStatus("");
    setDescription("");
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStatus("");
      setDescription("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Status Update</DialogTitle>
          <DialogDescription>
            Update the tracking status for this vehicle.
            {currentStatus && (
              <span className="block mt-1">
                Current status: <strong className="capitalize">{currentStatus.replace("_", " ")}</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">
              New Status <span className="text-destructive">*</span>
            </Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    disabled={option.value === currentStatus}
                  >
                    {option.label}
                    {option.value === currentStatus && " (current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this status change..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!status || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
