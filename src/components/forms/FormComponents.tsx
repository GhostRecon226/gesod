import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * FormSection - Groups related form fields with a title and optional description
 */
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="border-b border-border pb-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * FormRow - Horizontal layout for multiple form fields
 */
interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * FormActions - Consistent button alignment for form submit/cancel
 */
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "between" | "center";
}

export function FormActions({
  children,
  className,
  align = "right",
}: FormActionsProps) {
  const alignmentClasses = {
    left: "justify-start",
    right: "justify-end",
    between: "justify-between",
    center: "justify-center",
  };

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 pt-6 border-t border-border sm:flex-row",
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * RequiredIndicator - Visual indicator for required fields
 */
export function RequiredIndicator() {
  return (
    <span className="text-destructive ml-0.5" aria-hidden="true">
      *
    </span>
  );
}

/**
 * FormFieldWrapper - Simple wrapper for non-react-hook-form usage
 */
interface FormFieldWrapperProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormFieldWrapper({
  label,
  htmlFor,
  required,
  helperText,
  error,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "block text-sm font-medium",
          error ? "text-destructive" : "text-foreground"
        )}
      >
        {label}
        {required && <RequiredIndicator />}
      </label>
      {children}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}

/**
 * FormCard - Card wrapper for standalone forms
 */
interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormCard({
  title,
  description,
  children,
  className,
}: FormCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
