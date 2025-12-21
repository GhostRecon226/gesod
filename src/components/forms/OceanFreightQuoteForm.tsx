import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Ship, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormSection,
  FormRow,
  FormActions,
  RequiredIndicator,
} from "./FormComponents";
import { toast } from "@/hooks/use-toast";
import { createPublicQuoteRequest } from "@/services/publicQuoteService";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation schema
const oceanFreightSchema = z.object({
  // Contact Information
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),

  // Vehicle Information
  vehicleType: z.enum(["car", "suv", "truck"], {
    required_error: "Please select a vehicle type",
  }),
  make: z
    .string()
    .trim()
    .min(1, "Vehicle make is required")
    .max(50, "Make must be less than 50 characters"),
  model: z
    .string()
    .trim()
    .min(1, "Vehicle model is required")
    .max(50, "Model must be less than 50 characters"),
  year: z
    .string()
    .regex(/^\d{4}$/, "Please enter a valid year (e.g., 2024)"),
  vin: z
    .string()
    .trim()
    .max(17, "VIN must be 17 characters or less")
    .optional()
    .or(z.literal("")),

  // Shipping Details
  originPort: z
    .string()
    .trim()
    .min(1, "Origin port is required")
    .max(100, "Port name must be less than 100 characters"),
  destinationPort: z
    .string()
    .trim()
    .min(1, "Destination port is required")
    .max(100, "Port name must be less than 100 characters"),

  // Optional Fields
  auctionSource: z
    .string()
    .trim()
    .max(50, "Auction source must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  lotNumber: z
    .string()
    .trim()
    .max(50, "Lot number must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  additionalNotes: z
    .string()
    .trim()
    .max(1000, "Notes must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

type OceanFreightFormData = z.infer<typeof oceanFreightSchema>;

interface OceanFreightQuoteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OceanFreightQuoteForm({ onSuccess, onCancel }: OceanFreightQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<OceanFreightFormData>({
    resolver: zodResolver(oceanFreightSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      make: "",
      model: "",
      year: "",
      vin: "",
      originPort: "",
      destinationPort: "",
      auctionSource: "",
      lotNumber: "",
      additionalNotes: "",
    },
  });

  async function onSubmit(data: OceanFreightFormData) {
    setIsSubmitting(true);
    try {
      await createPublicQuoteRequest({
        quote_type: "ocean_freight",
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        vehicle_type: data.vehicleType,
        make: data.make,
        model: data.model,
        year: data.year,
        vin: data.vin || undefined,
        origin_port: data.originPort,
        destination_port: data.destinationPort,
        auction_source: data.auctionSource || undefined,
        lot_number: data.lotNumber || undefined,
        additional_notes: data.additionalNotes || undefined,
      });

      setIsSubmitted(true);
      toast({
        title: "Quote Request Submitted",
        description: "Your quote request has been received. We will respond shortly.",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Quote Request Received</h2>
        <p className="text-muted-foreground max-w-md">
          Your quote request has been received. We will respond shortly.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Ship className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Ocean Freight (RORO) Quote</h2>
          <p className="text-sm text-muted-foreground">
            Roll-on/Roll-off shipping for your vehicle
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Information Section */}
          <FormSection
            title="Contact Information"
            description="How can we reach you regarding this quote?"
          >
            <FormRow>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
          </FormSection>

          {/* Vehicle Information Section */}
          <FormSection
            title="Vehicle Information"
            description="Details about the vehicle you want to ship"
          >
            <FormRow>
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Type <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Make <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Model <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Land Cruiser" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Year <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN</FormLabel>
                    <FormControl>
                      <Input placeholder="Vehicle Identification Number" maxLength={17} {...field} />
                    </FormControl>
                    <FormDescription>Optional - 17 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
          </FormSection>

          {/* Shipping Details Section */}
          <FormSection
            title="Shipping Details"
            description="Origin and destination ports for your shipment"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="originPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Origin Port <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Los Angeles, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Destination Port <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos, Nigeria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
          </FormSection>

          {/* Optional Information Section */}
          <FormSection
            title="Additional Information"
            description="Optional details about your vehicle source"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="auctionSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auction Source</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select auction (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="copart">Copart</SelectItem>
                        <SelectItem value="iaai">IAAI</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements, questions, or additional information..."
                      className="min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 1000 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Disclaimer */}
          <Alert>
            <AlertDescription className="text-sm text-muted-foreground">
              Quotes are estimates and subject to final confirmation. Final pricing may vary based on vehicle condition, shipping schedules, and port fees.
            </AlertDescription>
          </Alert>

          {/* Form Actions */}
          <FormActions>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Quote Request"}
            </Button>
          </FormActions>
        </form>
      </Form>
    </div>
  );
}
