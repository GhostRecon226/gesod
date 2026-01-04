import React from "react";
import { Link } from "react-router-dom";
import gesodLogo from "@/assets/gesod_logo_white.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-hover opacity-90" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={gesodLogo} alt="GESOD RIDES" className="h-14 w-auto" />
          </Link>

          {/* Tagline */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
              Your Trusted Partner in Vehicle Logistics
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Streamline your vehicle import operations with our comprehensive 
              logistics platform. Track shipments, manage documents, and 
              coordinate deliveries all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">10K+</p>
              <p className="text-sm text-primary-foreground/70">Vehicles Shipped</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">98%</p>
              <p className="text-sm text-primary-foreground/70">On-Time Delivery</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">50+</p>
              <p className="text-sm text-primary-foreground/70">Countries Served</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-foreground/5" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-12 xl:px-24">
        {/* Mobile Logo */}
        <div className="mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={gesodLogo} alt="GESOD RIDES" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            {children}
          </div>

          {/* Footer Links */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
