import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconVariant = "flat" | "raised" | "floating" | "glass";
type IconSize = "sm" | "md" | "lg" | "xl";
type IconColor = "blue" | "emerald" | "violet" | "orange" | "primary" | "warning" | "success";

interface Icon3DProps {
  icon: LucideIcon;
  variant?: IconVariant;
  size?: IconSize;
  color?: IconColor;
  animate?: boolean;
  className?: string;
}

const sizeClasses: Record<IconSize, { container: string; icon: string }> = {
  sm: { container: "h-8 w-8", icon: "h-4 w-4" },
  md: { container: "h-12 w-12", icon: "h-6 w-6" },
  lg: { container: "h-16 w-16", icon: "h-8 w-8" },
  xl: { container: "h-20 w-20", icon: "h-10 w-10" },
};

const colorClasses: Record<IconColor, { gradient: string; shadow: string; glow: string }> = {
  blue: {
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    shadow: "shadow-blue-500/30",
    glow: "bg-blue-500/20",
  },
  emerald: {
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/30",
    glow: "bg-emerald-500/20",
  },
  violet: {
    gradient: "from-violet-400 via-violet-500 to-violet-600",
    shadow: "shadow-violet-500/30",
    glow: "bg-violet-500/20",
  },
  orange: {
    gradient: "from-orange-400 via-orange-500 to-orange-600",
    shadow: "shadow-orange-500/30",
    glow: "bg-orange-500/20",
  },
  primary: {
    gradient: "from-primary/80 via-primary to-primary",
    shadow: "shadow-primary/30",
    glow: "bg-primary/20",
  },
  warning: {
    gradient: "from-amber-400 via-amber-500 to-amber-600",
    shadow: "shadow-amber-500/30",
    glow: "bg-amber-500/20",
  },
  success: {
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/30",
    glow: "bg-emerald-500/20",
  },
};

export function Icon3D({
  icon: Icon,
  variant = "raised",
  size = "md",
  color = "primary",
  animate = false,
  className,
}: Icon3DProps) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  const baseClasses = cn(
    "relative flex items-center justify-center rounded-xl transition-all duration-300",
    sizeClass.container,
    className
  );

  if (variant === "flat") {
    return (
      <div className={cn(baseClasses, colorClass.glow)}>
        <Icon className={cn(sizeClass.icon, "text-foreground")} />
      </div>
    );
  }

  if (variant === "glass") {
    return (
      <div
        className={cn(
          baseClasses,
          "bg-white/10 backdrop-blur-md border border-white/20",
          "shadow-lg shadow-black/5",
          animate && "hover:scale-110 hover:-translate-y-1"
        )}
      >
        <Icon className={cn(sizeClass.icon, "text-white drop-shadow-sm")} />
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity",
            colorClass.glow
          )}
        />
        {/* Shadow layer */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl translate-y-1.5 blur-sm opacity-30",
            `bg-gradient-to-br ${colorClass.gradient}`
          )}
        />
        {/* Main icon */}
        <div
          className={cn(
            baseClasses,
            `bg-gradient-to-br ${colorClass.gradient}`,
            "shadow-xl",
            colorClass.shadow,
            animate && "group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3"
          )}
          style={{
            transform: "perspective(500px) rotateX(5deg)",
          }}
        >
          <Icon className={cn(sizeClass.icon, "text-white drop-shadow-md")} />
        </div>
      </div>
    );
  }

  // Default: raised variant
  return (
    <div className="relative group">
      {/* Bottom shadow layer */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl translate-y-1 opacity-50",
          `bg-gradient-to-br ${colorClass.gradient}`
        )}
      />
      {/* Main icon container */}
      <div
        className={cn(
          baseClasses,
          `bg-gradient-to-br ${colorClass.gradient}`,
          "shadow-lg",
          colorClass.shadow,
          animate && "group-hover:scale-105 group-hover:-translate-y-0.5"
        )}
      >
        <Icon className={cn(sizeClass.icon, "text-white drop-shadow-sm")} />
      </div>
    </div>
  );
}
