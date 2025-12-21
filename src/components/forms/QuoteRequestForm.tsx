import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormSection,
  FormRow,
  FormActions,
  RequiredIndicator,
  FormCard,
} from "./FormComponents";
import { toast } from "@/hooks/use-toast";

// Validation schema with security best practices
const quoteRequestSchema = z.object({
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
  company: z
    .string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional(),

  // Vehicle Information
  vehicleType: z.enum(["sedan", "suv", "truck", "van", "luxury", "other"], {
    required_error: "Please select a vehicle type",
  }),
  vehicleMake: z
    .string()
    .trim()
    .min(1, "Vehicle make is required")
    .max(50, "Make must be less than 50 characters"),
  vehicleModel: z
    .string()
    .trim()
    .min(1, "Vehicle model is required")
    .max(50, "Model must be less than 50 characters"),
  vehicleYear: z
    .string()
    .regex(/^\d{4}$/, "Please enter a valid year (e.g., 2024)"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .regex(/^\d+$/, "Please enter a valid number"),

  // Shipping Details
  originCountry: z
    .string()
    .trim()
    .min(1, "Origin country is required")
    .max(100, "Country name must be less than 100 characters"),
  destinationCountry: z
    .string()
    .trim()
    .min(1, "Destination country is required")
    .max(100, "Country name must be less than 100 characters"),
  destinationPort: z
    .string()
    .trim()
    .max(100, "Port name must be less than 100 characters")
    .optional(),
  preferredDate: z.date({
    required_error: "Please select a preferred shipping date",
  }),

  // Additional Information
  additionalServices: z.array(z.string()).optional(),
  specialInstructions: z
    .string()
    .trim()
    .max(1000, "Instructions must be less than 1000 characters")
    .optional(),
});

type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;

interface QuoteRequestFormProps {
  onSuccess?: (data: QuoteRequestFormData) => void;
  onCancel?: () => void;
}

export function QuoteRequestForm({ onSuccess, onCancel }: QuoteRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<QuoteRequestFormData>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      quantity: "1",
      originCountry: "",
      destinationCountry: "",
      destinationPort: "",
      specialInstructions: "",
      additionalServices: [],
    },
  });

  async function onSubmit(data: QuoteRequestFormData) {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Quote Request Submitted",
        description: "We'll get back to you within 24-48 hours.",
      });
      
      onSuccess?.(data);
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormCard
      title="Request a Quote"
      description="Fill out the form below and our team will provide you with a detailed quote for your vehicle import needs."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Information Section */}
          <FormSection
            title="Contact Information"
            description="How can we reach you?"
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
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="max-w-md">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company (optional)" {...field} />
                  </FormControl>
                  <FormDescription>
                    For business customers only
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Vehicle Information Section */}
          <FormSection
            title="Vehicle Information"
            description="Tell us about the vehicle(s) you want to import"
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
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleMake"
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
                name="vehicleModel"
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
                name="vehicleYear"
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Quantity <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>Number of vehicles</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
          </FormSection>

          {/* Shipping Details Section */}
          <FormSection
            title="Shipping Details"
            description="Where should we ship your vehicle(s)?"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="originCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Origin Country <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Japan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Destination Country <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nigeria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="destinationPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Destination Port</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos Port" {...field} />
                    </FormControl>
                    <FormDescription>Optional - we'll suggest the best option</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Preferred Shipping Date <RequiredIndicator />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
          </FormSection>

          {/* Additional Information Section */}
          <FormSection
            title="Additional Information"
            description="Any special requirements or instructions"
          >
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please include any special requirements, preferred shipping methods, or additional notes..."
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum 1000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

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
    </FormCard>
  );
}
