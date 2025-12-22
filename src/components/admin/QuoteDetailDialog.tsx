import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Ship,
  Car,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PublicQuoteRequest } from "@/hooks/usePublicQuoteRequests";

const quoteResponseSchema = z.object({
  quote_status: z.enum(["pending", "issued", "expired", "accepted"]),
  quote_amount: z.string().optional(),
  currency: z.string().default("USD"),
  valid_until: z.string().optional(),
  admin_notes: z.string().max(2000, "Notes must be less than 2000 characters").optional(),
});

type QuoteResponseFormData = z.infer<typeof quoteResponseSchema>;

interface QuoteDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: PublicQuoteRequest | null;
  onSubmit: (data: {
    quote_status: "pending" | "issued" | "expired" | "accepted";
    quote_amount: number | null;
    currency: string;
    valid_until: string | null;
    admin_notes: string | null;
  }) => Promise<void>;
  isLoading?: boolean;
}

// Helper to parse vehicle details JSON
function parseVehicleDetails(detailsStr: string): Record<string, unknown> {
  try {
    return JSON.parse(detailsStr);
  } catch {
    return {};
  }
}

export function QuoteDetailDialog({
  open,
  onOpenChange,
  quote,
  onSubmit,
  isLoading,
}: QuoteDetailDialogProps) {
  const form = useForm<QuoteResponseFormData>({
    resolver: zodResolver(quoteResponseSchema),
    defaultValues: {
      quote_status: "pending",
      quote_amount: "",
      currency: "USD",
      valid_until: "",
      admin_notes: "",
    },
  });

  // Reset form when quote changes
  React.useEffect(() => {
    if (quote) {
      form.reset({
        quote_status: quote.quote_status,
        quote_amount: quote.quote_amount?.toString() || "",
        currency: quote.currency || "USD",
        valid_until: quote.valid_until || "",
        admin_notes: quote.admin_notes || "",
      });
    }
  }, [quote, form]);

  const handleSubmit = async (data: QuoteResponseFormData) => {
    await onSubmit({
      quote_status: data.quote_status,
      quote_amount: data.quote_amount ? parseFloat(data.quote_amount) : null,
      currency: data.currency,
      valid_until: data.valid_until || null,
      admin_notes: data.admin_notes || null,
    });
    onOpenChange(false);
  };

  if (!quote) return null;

  const vehicleDetails = parseVehicleDetails(quote.vehicle_details);
  const isOcean = quote.quote_type === "ocean_freight";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isOcean ? (
              <Ship className="h-5 w-5 text-primary" />
            ) : (
              <Car className="h-5 w-5 text-primary" />
            )}
            Quote Request Details
          </DialogTitle>
          <DialogDescription>
            Review and respond to this quote request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Info Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Quote ID</p>
              <p className="font-mono text-sm">{quote.id}</p>
            </div>
            <Badge variant="outline" className={isOcean ? "bg-primary/10 text-primary" : ""}>
              {isOcean ? "Ocean Freight" : "Inland Freight"}
            </Badge>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{quote.contact_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{quote.contact_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{quote.contact_phone}</p>
                </div>
              </div>
            </div>
            {quote.customer && (
              <div className="mt-2 p-2 bg-primary/5 rounded-md">
                <p className="text-xs text-primary font-medium">
                  ✓ Linked to customer: {quote.customer.full_name}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Vehicle Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Vehicle Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {vehicleDetails.vehicle_type && (
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{String(vehicleDetails.vehicle_type)}</p>
                </div>
              )}
              {vehicleDetails.year && (
                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="font-medium">{String(vehicleDetails.year)}</p>
                </div>
              )}
              {vehicleDetails.make && (
                <div>
                  <p className="text-xs text-muted-foreground">Make</p>
                  <p className="font-medium">{String(vehicleDetails.make)}</p>
                </div>
              )}
              {vehicleDetails.model && (
                <div>
                  <p className="text-xs text-muted-foreground">Model</p>
                  <p className="font-medium">{String(vehicleDetails.model)}</p>
                </div>
              )}
              {vehicleDetails.vin && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">VIN</p>
                  <p className="font-mono font-medium">{String(vehicleDetails.vin)}</p>
                </div>
              )}
              {vehicleDetails.auction_source && (
                <div>
                  <p className="text-xs text-muted-foreground">Auction</p>
                  <p className="font-medium capitalize">{String(vehicleDetails.auction_source)}</p>
                </div>
              )}
              {vehicleDetails.lot_number && (
                <div>
                  <p className="text-xs text-muted-foreground">Lot #</p>
                  <p className="font-medium">{String(vehicleDetails.lot_number)}</p>
                </div>
              )}
            </div>
            {vehicleDetails.additional_notes && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">Additional Notes</p>
                <p className="text-sm mt-1 p-2 bg-muted rounded-md">
                  {String(vehicleDetails.additional_notes)}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Shipping Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Shipping Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {isOcean ? "Origin Port" : "Pickup Location"}
                  </p>
                  <p className="text-sm font-medium">{quote.origin_location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Destination</p>
                  <p className="text-sm font-medium">{quote.destination_location}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quote Response Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Quote Response</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quote_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="issued">Issued</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Quote expiration date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quote_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                          <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                          <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="admin_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add internal notes about this quote..."
                        className="min-h-[80px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes are for internal use only and won't be visible to the customer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timestamps */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {format(new Date(quote.created_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Updated: {format(new Date(quote.updated_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
