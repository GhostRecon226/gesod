import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-muted text-muted-foreground",
        destructive: "bg-destructive-muted text-destructive",
        outline: "border border-border text-foreground",
        // Status-specific badges for logistics
        pending: "bg-pending-muted text-pending",
        active: "bg-success-muted text-success",
        completed: "bg-success-muted text-success",
        delayed: "bg-warning-muted text-warning",
        cancelled: "bg-destructive-muted text-destructive",
        "in-transit": "bg-pending-muted text-pending",
        delivered: "bg-success-muted text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
