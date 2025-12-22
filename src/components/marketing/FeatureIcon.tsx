import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureIconColor = "blue" | "emerald" | "violet" | "orange" | "primary";

interface FeatureIconProps {
  icon: LucideIcon;
  color?: FeatureIconColor;
  size?: "md" | "lg" | "xl";
  className?: string;
}

const colorConfig: Record<FeatureIconColor, {
  gradient: string;
  shadow: string;
  glow: string;
  ring: string;
}> = {
  blue: {
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    shadow: "shadow-blue-500/40",
    glow: "bg-blue-500/20",
    ring: "ring-blue-400/30",
  },
  emerald: {
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/40",
    glow: "bg-emerald-500/20",
    ring: "ring-emerald-400/30",
  },
  violet: {
    gradient: "from-violet-400 via-violet-500 to-violet-600",
    shadow: "shadow-violet-500/40",
    glow: "bg-violet-500/20",
    ring: "ring-violet-400/30",
  },
  orange: {
    gradient: "from-orange-400 via-orange-500 to-orange-600",
    shadow: "shadow-orange-500/40",
    glow: "bg-orange-500/20",
    ring: "ring-orange-400/30",
  },
  primary: {
    gradient: "from-primary/70 via-primary to-primary",
    shadow: "shadow-primary/40",
    glow: "bg-primary/20",
    ring: "ring-primary/30",
  },
};

const sizeConfig = {
  md: { container: "h-14 w-14", icon: "h-7 w-7", glow: "h-16 w-16" },
  lg: { container: "h-16 w-16", icon: "h-8 w-8", glow: "h-20 w-20" },
  xl: { container: "h-20 w-20", icon: "h-10 w-10", glow: "h-24 w-24" },
};

export function FeatureIcon({
  icon: Icon,
  color = "primary",
  size = "md",
  className,
}: FeatureIconProps) {
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  return (
    <div className={cn("relative group", className)}>
      {/* Ambient glow */}
      <div
        className={cn(
          "absolute -inset-2 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500",
          colors.glow
        )}
      />
      
      {/* Outer ring */}
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl ring-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          colors.ring
        )}
      />
      
      {/* Shadow layer for depth */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl translate-y-2 blur-sm opacity-40",
          `bg-gradient-to-br ${colors.gradient}`
        )}
      />
      
      {/* Second shadow layer */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl translate-y-1 opacity-60",
          `bg-gradient-to-br ${colors.gradient}`
        )}
      />
      
      {/* Main icon container */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl",
          `bg-gradient-to-br ${colors.gradient}`,
          "shadow-2xl",
          colors.shadow,
          sizes.container,
          "group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-2",
          "transition-all duration-300 ease-out"
        )}
        style={{
          transform: "perspective(800px) rotateX(5deg) rotateY(-2deg)",
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        
        {/* Icon */}
        <Icon
          className={cn(
            sizes.icon,
            "text-white relative z-10",
            "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          )}
        />
      </div>
    </div>
  );
}
