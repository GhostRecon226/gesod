import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeConfig = {
  sm: { container: "h-10 w-10", icon: "h-5 w-5" },
  md: { container: "h-12 w-12", icon: "h-6 w-6" },
  lg: { container: "h-14 w-14", icon: "h-7 w-7" },
  xl: { container: "h-16 w-16", icon: "h-8 w-8" },
};

export function FeatureIcon({
  icon: Icon,
  size = "md",
  className,
}: FeatureIconProps) {
  const sizes = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-primary/10",
        sizes.container,
        className
      )}
    >
      <Icon className={cn(sizes.icon, "text-primary")} />
    </div>
  );
}