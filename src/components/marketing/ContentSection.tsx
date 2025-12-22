import React from "react";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "muted" | "primary";
  className?: string;
}

export function ContentSection({
  title,
  subtitle,
  description,
  children,
  variant = "default",
  className,
}: ContentSectionProps) {
  return (
    <section
      className={cn(
        "py-16 sm:py-24",
        variant === "muted" && "bg-muted",
        variant === "primary" && "bg-primary text-primary-foreground",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle || description) && (
          <div className="text-center mb-12 lg:mb-16">
            {subtitle && (
              <p
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider mb-2",
                  variant === "primary"
                    ? "text-primary-foreground/80"
                    : "text-primary"
                )}
              >
                {subtitle}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "text-3xl font-bold tracking-tight sm:text-4xl",
                  variant === "primary"
                    ? "text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "mx-auto mt-4 max-w-2xl text-lg",
                  variant === "primary"
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
