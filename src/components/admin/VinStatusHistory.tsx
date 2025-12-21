import { format } from "date-fns";
import { Clock, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusType } from "@/components/ui/status-badge";
import { useVinStatusUpdates, useDeleteStatusUpdate } from "@/hooks/useVinStatusUpdates";
import { Skeleton } from "@/components/ui/skeleton";
import type { VinStatus } from "@/services/vinService";

interface VinStatusHistoryProps {
  vinRecordId: string;
  showDelete?: boolean;
}

// Map database status to StatusBadge status type
function mapToStatusType(status: VinStatus): StatusType {
  const map: Record<VinStatus, StatusType> = {
    pending: "pending",
    active: "active",
    awaiting_action: "awaiting",
    in_progress: "in-progress",
    delayed: "delayed",
    completed: "completed",
    cancelled: "cancelled",
  };
  return map[status];
}

export function VinStatusHistory({ vinRecordId, showDelete = true }: VinStatusHistoryProps) {
  const { data: updates, isLoading } = useVinStatusUpdates(vinRecordId);
  const deleteMutation = useDeleteStatusUpdate();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!updates || updates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No status updates yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((update, index) => (
        <div
          key={update.id}
          className={`relative pl-6 pb-4 ${
            index !== updates.length - 1 ? "border-l-2 border-border ml-2" : "ml-2"
          }`}
        >
          <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
          
          <div className="bg-muted/50 rounded-lg p-3 ml-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={mapToStatusType(update.status)} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                
                {update.description && (
                  <p className="text-sm text-foreground">{update.description}</p>
                )}
                
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {update.updater_profile?.full_name || update.updater_profile?.email || "Unknown"}
                </p>
              </div>
              
              {showDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMutation.mutate({ 
                    id: update.id, 
                    vinRecordId 
                  })}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
