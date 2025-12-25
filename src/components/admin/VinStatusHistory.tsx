import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusTimeline, type TimelineStatus } from "@/components/ui/status-timeline";
import { useVinStatusUpdates, useDeleteStatusUpdate } from "@/hooks/useVinStatusUpdates";
import { Skeleton } from "@/components/ui/skeleton";

interface VinStatusHistoryProps {
  vinRecordId: string;
  showDelete?: boolean;
}

export function VinStatusHistory({ vinRecordId, showDelete = true }: VinStatusHistoryProps) {
  const { data: updates, isLoading } = useVinStatusUpdates(vinRecordId);
  const deleteMutation = useDeleteStatusUpdate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!updates || updates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No status updates yet.
      </p>
    );
  }

  // If delete is enabled, render custom view with delete buttons
  if (showDelete) {
    return (
      <div className="space-y-0">
        {/* Vertical line */}
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
          
          <ol className="space-y-0">
            {updates.map((update, index) => {
              const isFirst = index === 0;
              const statusLabels: Record<string, string> = {
                pending: "Pending",
                active: "Active",
                awaiting_action: "Awaiting Action",
                in_progress: "In Progress",
                delayed: "Delayed",
                completed: "Completed",
                cancelled: "Cancelled",
              };

              return (
                <li key={update.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`h-[11px] w-[11px] rounded-full border-2 bg-background ${
                        isFirst ? "border-primary bg-primary" : "border-border"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 -mt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className={`text-sm font-medium ${isFirst ? "text-foreground" : "text-muted-foreground"}`}>
                            {statusLabels[update.status] || update.status}
                          </span>
                          <time className="text-xs text-muted-foreground tabular-nums">
                            {format(new Date(update.created_at), "MMM d, yyyy · h:mm a")}
                          </time>
                        </div>

                        {update.description && (
                          <p className="mt-1 text-sm text-foreground">
                            {update.description}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-muted-foreground">
                          {update.updater_profile?.full_name || update.updater_profile?.email || "Unknown"}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => deleteMutation.mutate(update.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  // Read-only view using the shared component
  const timelineItems: TimelineStatus[] = updates.map((update) => ({
    id: update.id,
    status: update.status,
    date: update.created_at,
    description: update.description,
    updatedBy: update.updater_profile?.full_name || update.updater_profile?.email || undefined,
  }));

  return <StatusTimeline items={timelineItems} showUpdatedBy />;
}
