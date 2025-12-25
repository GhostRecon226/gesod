import { format } from "date-fns";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStatus {
  id: string;
  status: string;
  date: string;
  description?: string | null;
  updatedBy?: string | null;
}

interface StatusTimelineProps {
  items: TimelineStatus[];
  emptyMessage?: string;
  showUpdatedBy?: boolean;
  className?: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  awaiting_action: "Awaiting Action",
  in_progress: "In Progress",
  delayed: "Delayed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  pending: "text-pending",
  active: "text-in-progress",
  awaiting_action: "text-awaiting",
  in_progress: "text-in-progress",
  delayed: "text-destructive",
  completed: "text-success",
  cancelled: "text-muted-foreground",
};

export function StatusTimeline({
  items,
  emptyMessage = "No status updates yet.",
  showUpdatedBy = false,
  className,
}: StatusTimelineProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Vertical timeline line */}
      <div 
        className="absolute left-[5px] top-2 bottom-2 w-px bg-border" 
        aria-hidden="true" 
      />

      <ol className="space-y-0">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const statusColor = statusColors[item.status] || "text-muted-foreground";
          const statusLabel = statusLabels[item.status] || item.status;

          return (
            <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    "h-[11px] w-[11px] rounded-full border-2 bg-background",
                    isFirst ? "border-primary bg-primary" : "border-border"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 -mt-0.5">
                {/* Header row: Status + Date */}
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Circle 
                      className={cn("h-2 w-2 fill-current flex-shrink-0", statusColor)} 
                    />
                    <span className={cn(
                      "text-sm font-medium",
                      isFirst ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {statusLabel}
                    </span>
                  </div>
                  <time 
                    className="text-xs text-muted-foreground tabular-nums flex-shrink-0"
                    dateTime={item.date}
                  >
                    {format(new Date(item.date), "MMM d, yyyy")}
                    <span className="mx-1.5 text-border">·</span>
                    {format(new Date(item.date), "h:mm a")}
                  </time>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="mt-1.5 text-sm text-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Updated by */}
                {showUpdatedBy && item.updatedBy && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updated by {item.updatedBy}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Horizontal variant for compact display
interface HorizontalTimelineProps {
  items: TimelineStatus[];
  className?: string;
}

export function HorizontalTimeline({ items, className }: HorizontalTimelineProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Show max 5 items for horizontal view
  const displayItems = items.slice(0, 5);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <ol className="flex items-start gap-0 min-w-max">
        {displayItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === displayItems.length - 1;
          const statusColor = statusColors[item.status] || "text-muted-foreground";
          const statusLabel = statusLabels[item.status] || item.status;

          return (
            <li key={item.id} className="flex items-start">
              {/* Step content */}
              <div className="flex flex-col items-center text-center min-w-[100px]">
                {/* Dot */}
                <div
                  className={cn(
                    "h-3 w-3 rounded-full border-2",
                    isFirst 
                      ? "border-primary bg-primary" 
                      : "border-border bg-background"
                  )}
                />
                
                {/* Label */}
                <div className="mt-2 space-y-0.5">
                  <p className={cn(
                    "text-xs font-medium",
                    isFirst ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {statusLabel}
                  </p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">
                    {format(new Date(item.date), "MMM d")}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-shrink-0 w-8 h-px bg-border mt-1.5" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
