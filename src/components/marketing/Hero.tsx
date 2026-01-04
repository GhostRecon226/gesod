import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  features?: string[];
  children?: React.ReactNode;
  variant?: "light" | "dark";
}

export function Hero({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  features,
  children,
  variant = "dark",
}: HeroProps) {
  const isDark = variant === "dark";

  return (
    <section className={`py-16 sm:py-24 lg:py-32 ${isDark ? "bg-hero" : "bg-background"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Subtitle/Badge */}
          {subtitle && (
            <div className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium mb-6 ${
              isDark 
                ? "border border-hero-muted/30 text-hero-muted" 
                : "bg-accent text-accent-foreground"
            }`}>
              {subtitle}
            </div>
          )}

          {/* Title */}
          <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${
            isDark ? "text-hero-foreground" : "text-foreground"
          }`}>
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed ${
              isDark ? "text-hero-muted" : "text-muted-foreground"
            }`}>
              {description}
            </p>
          )}

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {primaryCta && (
                <Button 
                  size="lg" 
                  asChild 
                  className={isDark ? "bg-accent-bright hover:bg-accent-bright/90 text-accent-bright-foreground" : ""}
                >
                  <Link to={primaryCta.href}>
                    {primaryCta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className={isDark ? "border-hero-muted/30 text-hero-foreground hover:bg-hero-foreground/10" : ""}
                >
                  <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}

          {/* Features List */}
          {features && features.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    isDark ? "text-hero-muted" : "text-muted-foreground"
                  }`}
                >
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Custom Content */}
          {children && <div className="mt-12">{children}</div>}
        </div>
      </div>
    </section>
  );
}