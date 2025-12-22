import React from "react";
import { AlertTriangle, Info, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type DisclaimerVariant = "info" | "warning" | "neutral";

interface DisclaimerProps {
  variant?: DisclaimerVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<DisclaimerVariant, { icon: typeof Info; containerClass: string; iconClass: string }> = {
  info: {
    icon: Info,
    containerClass: "bg-accent/50 border-border",
    iconClass: "text-muted-foreground",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "bg-warning/5 border-warning/20",
    iconClass: "text-warning",
  },
  neutral: {
    icon: Shield,
    containerClass: "bg-muted/50 border-border",
    iconClass: "text-muted-foreground",
  },
};

export function Disclaimer({
  variant = "info",
  title,
  children,
  className,
}: DisclaimerProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        config.containerClass,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClass)} />
        <div className="text-sm text-muted-foreground space-y-1">
          {title && (
            <p className="font-medium text-foreground">{title}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

// Standard disclaimers for reuse across pages
export const DISCLAIMERS = {
  quoteEstimate: (
    <>
      <p>
        All quotes provided are estimates based on current rates and are subject to 
        final confirmation. Actual pricing may vary based on vehicle specifications, 
        shipping schedules, and market conditions.
      </p>
    </>
  ),
  vinTracking: (
    <>
      <p>
        <span className="font-medium text-foreground">Status-Based Tracking:</span>{" "}
        VIN tracking displays milestone updates as recorded by our operations team. 
        This is not GPS-based real-time location tracking.
      </p>
      <p>
        Updates are based on information received from logistics partners. Timelines 
        are indicative and may be affected by customs, weather, port congestion, or 
        other external factors.
      </p>
    </>
  ),
  auctionVehicles: (
    <>
      <p>
        GESOD RIDES does not own auction vehicles. All listings are sourced from 
        third-party auction platforms (Copart, IAAI, etc.). We provide bidding 
        assistance on your behalf.
      </p>
      <p>
        Auction fees, buyer premiums, shipping, and customs/clearing costs are 
        separate from the vehicle price. Winning bids are not guaranteed.
      </p>
    </>
  ),
  serviceFacilitation: (
    <>
      <p>
        GESOD RIDES operates as a logistics facilitation company. We coordinate 
        services between clients and third-party providers including auction houses, 
        shipping lines, and transport carriers. We do not own vehicles, vessels, 
        or transport equipment.
      </p>
    </>
  ),
  timelineIndicative: (
    <>
      <p>
        All transit times, delivery estimates, and schedules are indicative and 
        subject to change based on factors outside our control, including carrier 
        availability, weather conditions, port congestion, and customs processing.
      </p>
    </>
  ),
} as const;
