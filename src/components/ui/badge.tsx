import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-primary border border-primary/20",
        secondary: "bg-muted text-muted-foreground border border-border/50",
        destructive: "bg-destructive-muted text-destructive border border-destructive/20",
        outline: "border border-border text-foreground",
        // Standardized status badges
        pending: "bg-pending-muted text-pending border border-pending/20",
        active: "bg-success-muted text-success border border-success/20",
        awaiting: "bg-awaiting-muted text-awaiting border border-awaiting/20",
        "in-progress": "bg-in-progress-muted text-in-progress border border-in-progress/20",
        delayed: "bg-warning-muted text-warning border border-warning/20",
        completed: "bg-success-muted text-success border border-success/20",
        cancelled: "bg-destructive-muted text-destructive border border-destructive/20",
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
