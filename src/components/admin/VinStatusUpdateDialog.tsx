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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vinStatuses, type VinStatus } from "@/services/vinService";
import { useCreateStatusUpdate } from "@/hooks/useVinStatusUpdates";

interface VinStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vinRecordId: string;
  vinNumber: string;
  currentStatus: VinStatus;
}

export function VinStatusUpdateDialog({
  open,
  onOpenChange,
  vinRecordId,
  vinNumber,
  currentStatus,
}: VinStatusUpdateDialogProps) {
  const [status, setStatus] = useState<VinStatus>(currentStatus);
  const [description, setDescription] = useState("");
  const createMutation = useCreateStatusUpdate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createMutation.mutateAsync({
      vin_record_id: vinRecordId,
      status,
      description: description || undefined,
    });
    
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Status Update</DialogTitle>
          <DialogDescription>
            Add a new status update for VIN: {vinNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as VinStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {vinStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this status change..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
