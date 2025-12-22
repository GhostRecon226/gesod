import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Car, CheckCircle } from "lucide-react";

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
const inlandFreightSchema = z.object({
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

  // Location Details
  pickupLocation: z
    .string()
    .trim()
    .min(1, "Pickup location is required")
    .max(200, "Location must be less than 200 characters"),
  destinationPort: z
    .string()
    .trim()
    .min(1, "Destination port is required")
    .max(100, "Port name must be less than 100 characters"),

  // Vehicle Information
  vehicleCondition: z.enum(["drivable", "not_drivable"], {
    required_error: "Please select vehicle condition",
  }),
  vehicleType: z.enum(["car", "suv", "truck"], {
    required_error: "Please select a vehicle type",
  }),

  // Optional Fields
  vin: z
    .string()
    .trim()
    .max(17, "VIN must be 17 characters or less")
    .optional()
    .or(z.literal("")),
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
  pickupDeadline: z
    .string()
    .optional()
    .or(z.literal("")),
  additionalNotes: z
    .string()
    .trim()
    .max(1000, "Notes must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

type InlandFreightFormData = z.infer<typeof inlandFreightSchema>;

interface InlandFreightQuoteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function InlandFreightQuoteForm({ onSuccess, onCancel }: InlandFreightQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<InlandFreightFormData>({
    resolver: zodResolver(inlandFreightSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pickupLocation: "",
      destinationPort: "",
      vin: "",
      auctionSource: "",
      lotNumber: "",
      pickupDeadline: "",
      additionalNotes: "",
    },
  });

  async function onSubmit(data: InlandFreightFormData) {
    setIsSubmitting(true);
    try {
      // Build vehicle details including condition
      await createPublicQuoteRequest({
        quote_type: "inland_freight",
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        vehicle_type: data.vehicleType,
        make: "", // Not required for inland freight
        model: "", // Not required for inland freight
        year: "", // Not required for inland freight
        vin: data.vin || undefined,
        origin_port: data.pickupLocation,
        destination_port: data.destinationPort,
        auction_source: data.auctionSource || undefined,
        lot_number: data.lotNumber || undefined,
        additional_notes: [
          `Vehicle Condition: ${data.vehicleCondition === "drivable" ? "Drivable" : "Not Drivable"}`,
          data.pickupDeadline ? `Pickup Deadline: ${data.pickupDeadline}` : null,
          data.additionalNotes || null,
        ].filter(Boolean).join("\n"),
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
          <Car className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Inland Freight (Vehicle Towing) Quote</h2>
          <p className="text-sm text-muted-foreground">
            Domestic vehicle transport and towing services
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

          {/* Location Details Section */}
          <FormSection
            title="Location Details"
            description="Pickup and destination information"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pickup Location <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Copart Dallas, TX" {...field} />
                    </FormControl>
                    <FormDescription>
                      Full address or auction yard name
                    </FormDescription>
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
                      <Input placeholder="e.g., Houston, TX" {...field} />
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
            description="Details about the vehicle to be transported"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="vehicleCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Condition <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="drivable">Drivable</SelectItem>
                        <SelectItem value="not_drivable">Not Drivable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Non-drivable vehicles may require special equipment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </FormRow>
            <FormRow className="sm:grid-cols-2">
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

          {/* Optional Information Section */}
          <FormSection
            title="Additional Information"
            description="Optional details about your vehicle and pickup requirements"
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
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="pickupDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When does the vehicle need to be picked up?
                    </FormDescription>
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
                      placeholder="Any special requirements, access instructions, or additional information..."
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
              Quotes are estimates and subject to final confirmation. Final pricing may vary based on vehicle condition, distance, and special handling requirements.
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
              Submit Quote Request
            </Button>
          </FormActions>
        </form>
      </Form>
    </div>
  );
}
