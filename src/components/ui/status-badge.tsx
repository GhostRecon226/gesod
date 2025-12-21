import * as React from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle,
  XCircle,
  CircleDot,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

/**
 * Standardized status types used across the platform:
 * - VIN Tracking
 * - Quotes
 * - Bid Requests
 * - Vehicles
 */
export type StatusType =
  | "pending"
  | "active"
  | "awaiting"
  | "in-progress"
  | "delayed"
  | "completed"
  | "cancelled";

interface StatusConfig {
  label: string;
  description: string;
  icon: LucideIcon;
  variant: StatusType;
}

/**
 * Status configuration with clear, non-promissory language
 */
export const statusConfig: Record<StatusType, StatusConfig> = {
  pending: {
    label: "Pending",
    description: "Awaiting initial processing",
    icon: Clock,
    variant: "pending",
  },
  active: {
    label: "Active",
    description: "Currently being processed",
    icon: CircleDot,
    variant: "active",
  },
  awaiting: {
    label: "Awaiting Action",
    description: "Requires attention or input",
    icon: AlertCircle,
    variant: "awaiting",
  },
  "in-progress": {
    label: "In Progress",
    description: "Work is underway",
    icon: Loader2,
    variant: "in-progress",
  },
  delayed: {
    label: "Delayed",
    description: "Processing has been delayed",
    icon: AlertTriangle,
    variant: "delayed",
  },
  completed: {
    label: "Completed",
    description: "Successfully finished",
    icon: CheckCircle2,
    variant: "completed",
  },
  cancelled: {
    label: "Cancelled",
    description: "Has been cancelled",
    icon: XCircle,
    variant: "cancelled",
  },
};

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

/**
 * StatusBadge - A consistent status indicator component
 * 
 * Usage:
 * <StatusBadge status="pending" />
 * <StatusBadge status="active" showIcon />
 * <StatusBadge status="completed" size="lg" showIcon />
 */
export function StatusBadge({
  status,
  showIcon = false,
  size = "default",
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    default: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(sizeClasses[size], className)}
    >
      {showIcon && (
        <Icon
          className={cn(
            iconSizes[size],
            status === "in-progress" && "animate-spin"
          )}
        />
      )}
      {config.label}
    </Badge>
  );
}

/**
 * Hook to get status configuration
 */
export function useStatus(status: StatusType) {
  return statusConfig[status];
}

/**
 * Get all available statuses
 */
export function getAllStatuses(): StatusType[] {
  return Object.keys(statusConfig) as StatusType[];
}

/**
 * Status display component for detailed views
 */
interface StatusDisplayProps {
  status: StatusType;
  showDescription?: boolean;
  className?: string;
}

export function StatusDisplay({
  status,
  showDescription = false,
  className,
}: StatusDisplayProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <StatusBadge status={status} showIcon size="lg" />
      {showDescription && (
        <span className="text-sm text-muted-foreground">
          {config.description}
        </span>
      )}
    </div>
  );
}
