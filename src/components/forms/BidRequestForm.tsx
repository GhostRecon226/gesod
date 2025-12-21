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

// Bid request validation schema
const bidRequestSchema = z.object({
  // Auction Information
  auctionId: z
    .string()
    .trim()
    .min(1, "Auction ID is required"),
  vehicleVin: z
    .string()
    .trim()
    .min(17, "VIN must be 17 characters")
    .max(17, "VIN must be 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]+$/, "Invalid VIN format"),
  
  // Bid Details
  maxBidAmount: z
    .string()
    .min(1, "Maximum bid amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  bidType: z.enum(["single", "proxy"], {
    required_error: "Please select a bid type",
  }),
  
  // Shipping Preference
  shippingDestination: z
    .string()
    .trim()
    .min(1, "Shipping destination is required")
    .max(200, "Destination must be less than 200 characters"),
  preferredPort: z
    .string()
    .trim()
    .max(100, "Port name must be less than 100 characters")
    .optional(),
  includeShipping: z.enum(["yes", "no", "quote"], {
    required_error: "Please select shipping preference",
  }),
  
  // Additional Requirements
  inspectionRequired: z.enum(["yes", "no"], {
    required_error: "Please select inspection preference",
  }),
  bidDeadline: z.date({
    required_error: "Please select a bid deadline",
  }),
  specialRequirements: z
    .string()
    .trim()
    .max(500, "Requirements must be less than 500 characters")
    .optional(),
});

type BidRequestFormData = z.infer<typeof bidRequestSchema>;

interface BidRequestFormProps {
  auctionId?: string;
  vehicleVin?: string;
  onSuccess?: (data: BidRequestFormData) => void;
  onCancel?: () => void;
}

export function BidRequestForm({
  auctionId = "",
  vehicleVin = "",
  onSuccess,
  onCancel,
}: BidRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BidRequestFormData>({
    resolver: zodResolver(bidRequestSchema),
    defaultValues: {
      auctionId,
      vehicleVin,
      maxBidAmount: "",
      shippingDestination: "",
      preferredPort: "",
      specialRequirements: "",
    },
  });

  async function onSubmit(data: BidRequestFormData) {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Bid Request Submitted",
        description: "We'll process your request and notify you of updates.",
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
      title="Submit Bid Request"
      description="Request our team to bid on an auction vehicle on your behalf."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Auction Information */}
          <FormSection
            title="Auction Details"
            description="Identify the auction and vehicle"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="auctionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Auction ID <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USS-12345" {...field} />
                    </FormControl>
                    <FormDescription>
                      Found on the auction listing page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleVin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle VIN <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="17-character VIN"
                        maxLength={17}
                        className="uppercase"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
          </FormSection>

          {/* Bid Details */}
          <FormSection
            title="Bid Details"
            description="Set your bidding preferences"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="maxBidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Maximum Bid Amount (USD) <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          placeholder="0.00"
                          className="pl-7"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      We will not exceed this amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bidType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bid Type <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bid type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Bid</SelectItem>
                        <SelectItem value="proxy">Proxy Bid (Auto-increment)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Proxy bids auto-increase up to your max
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
            <FormField
              control={form.control}
              name="bidDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col max-w-sm">
                  <FormLabel>
                    Bid Deadline <RequiredIndicator />
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
                            <span>Select deadline</span>
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
                  <FormDescription>
                    The auction date or your deadline
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Shipping Preferences */}
          <FormSection
            title="Shipping Preferences"
            description="Where should we ship the vehicle if you win?"
          >
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="shippingDestination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Destination Country/City <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos, Nigeria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Port</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apapa Port" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
            <FormRow className="sm:grid-cols-2">
              <FormField
                control={form.control}
                name="includeShipping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Include Shipping in Quote <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes, include shipping</SelectItem>
                        <SelectItem value="no">No, vehicle only</SelectItem>
                        <SelectItem value="quote">Quote separately</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inspectionRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pre-Bid Inspection <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes, inspect before bidding</SelectItem>
                        <SelectItem value="no">No, proceed without inspection</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Inspection may delay bidding
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>
          </FormSection>

          {/* Additional Requirements */}
          <FormSection title="Additional Requirements">
            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements, condition expectations, or notes for our bidding team..."
                      className="min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum 500 characters
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
              {isSubmitting ? "Submitting..." : "Submit Bid Request"}
            </Button>
          </FormActions>
        </form>
      </Form>
    </FormCard>
  );
}
