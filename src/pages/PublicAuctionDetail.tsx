import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Gavel,
  MapPin,
  Calendar,
  Car,
  Loader2,
  ImageOff,
  ArrowLeft,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { fetchAuctionVehicleById, AuctionSource } from "@/services/auctionVehicleService";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBidRequest } from "@/hooks/useBidRequests";
import { supabase } from "@/integrations/supabase/client";

const bidFormSchema = z.object({
  max_bid_amount: z.coerce.number().min(100, "Minimum bid amount is $100"),
  destination_country: z.string().trim().min(1, "Destination country is required").max(100, "Country name too long"),
  destination_port: z.string().trim().min(1, "Destination port is required").max(100, "Port name too long"),
  accept_disclaimer: z.literal(true, {
    errorMap: () => ({ message: "You must accept the auction disclaimer to proceed" }),
  }),
});

type BidFormData = z.infer<typeof bidFormSchema>;

export default function PublicAuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ["auction-vehicle", id],
    queryFn: () => fetchAuctionVehicleById(id!),
    enabled: !!id,
  });

  const createBidMutation = useCreateBidRequest();

  const form = useForm<BidFormData>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      max_bid_amount: 0,
      destination_country: "",
      destination_port: "",
      accept_disclaimer: false as unknown as true,
    },
  });

  const getSourceBadge = (source: AuctionSource) => {
    const colors: Record<AuctionSource, string> = {
      copart: "bg-primary/10 text-primary border-primary/20",
      iaai: "bg-secondary/10 text-secondary border-secondary/20",
      other: "bg-muted text-muted-foreground border-border",
    };
    return (
      <Badge variant="outline" className={colors[source]}>
        {source.toUpperCase()}
      </Badge>
    );
  };

  const handleBidSubmit = async (data: BidFormData) => {
    if (!user || !vehicle) return;

    // Get customer ID from user
    const { data: customerData } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!customerData) {
      return;
    }

    await createBidMutation.mutateAsync({
      customer_id: customerData.id,
      auction_vehicle_id: vehicle.id,
      auction_vehicle_reference: `${vehicle.year} ${vehicle.make} ${vehicle.model} - Lot #${vehicle.lot_number}`,
      max_bid_amount: data.max_bid_amount,
      destination_country: data.destination_country,
      destination_port: data.destination_port,
    });

    setSubmissionSuccess(true);
    form.reset();
  };

  const handleDialogClose = (open: boolean) => {
    setBidDialogOpen(open);
    if (!open) {
      setSubmissionSuccess(false);
      form.reset();
    }
  };

  const hasImages = vehicle?.vehicle_images && vehicle.vehicle_images.length > 0;
  const images = hasImages ? vehicle!.vehicle_images! : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !vehicle) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <Gavel className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Vehicle Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            This auction listing may have been removed or is no longer available.
          </p>
          <Button asChild>
            <Link to="/auctions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-background py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            to="/auctions"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Auction Listings
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden relative">
                {hasImages ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-foreground/70 text-background p-2 rounded-full hover:bg-foreground/90 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-foreground/70 text-background p-2 rounded-full hover:bg-foreground/90 transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/70 text-background text-sm px-3 py-1 rounded-full">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <ImageOff className="h-16 w-16 mb-3" />
                    <span className="text-lg">No images available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {images.slice(0, 6).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex
                          ? "border-primary"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {getSourceBadge(vehicle.auction_source)}
                  {vehicle.status === "expired" && (
                    <Badge variant="secondary">Expired</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  {vehicle.vehicle_type.toUpperCase()}
                </p>
              </div>

              {/* Key Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Auction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Gavel className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Auction Source</p>
                        <p className="font-medium text-foreground">{vehicle.auction_source.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Car className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lot Number</p>
                        <p className="font-mono font-medium text-foreground">{vehicle.lot_number}</p>
                      </div>
                    </div>
                    {vehicle.auction_date && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Auction Date</p>
                          <p className="font-medium text-foreground">
                            {format(new Date(vehicle.auction_date), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    )}
                    {vehicle.yard_location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Yard Location</p>
                          <p className="font-medium text-foreground">{vehicle.yard_location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Important Disclaimers */}
              <Alert variant="default" className="border-warning/30 bg-warning-muted">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertTitle className="text-foreground">Important Disclaimer</AlertTitle>
                <AlertDescription className="text-muted-foreground space-y-2">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>GESOD RIDES does not own this vehicle</strong> — it is listed on {vehicle.auction_source.toUpperCase()}, a third-party auction platform</li>
                    <li>We provide <strong>bidding assistance on your behalf</strong> — we bid for you, not sell to you</li>
                    <li>Final cost includes <strong>auction fees, buyer premiums, shipping, and clearing charges</strong> (quoted separately)</li>
                    <li>Vehicle condition is as-is; review auction reports before requesting a bid</li>
                    <li><strong>Winning a bid is not guaranteed</strong> — outcomes depend on auction competition</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Info Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How It Works</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  Submit a bid request and our team will assist you with the auction process, 
                  handle all documentation, and coordinate shipping to your destination.
                </AlertDescription>
              </Alert>

              {/* CTA */}
              {vehicle.status === "active" && (
                <Dialog open={bidDialogOpen} onOpenChange={handleDialogClose}>
                  <DialogTrigger asChild>
                    {user ? (
                      <Button size="lg" className="w-full text-base">
                        <Gavel className="h-5 w-5 mr-2" />
                        Request GESOD RIDES to Bid on My Behalf
                      </Button>
                    ) : (
                      <Button size="lg" className="w-full text-base" asChild>
                        <Link to={`/auth?redirect=/auctions/${vehicle.id}`}>
                          <Gavel className="h-5 w-5 mr-2" />
                          Sign In to Request Bidding Assistance
                        </Link>
                      </Button>
                    )}
                  </DialogTrigger>
                  {user && (
                    <DialogContent className="sm:max-w-[500px]">
                      {submissionSuccess ? (
                        <>
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                              <CheckCircle2 className="h-8 w-8 text-success" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Bid Request Submitted!
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                              Your bid request for the <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong> has been submitted successfully. 
                              Our team will review your request and contact you shortly.
                            </p>
                            <div className="bg-muted/50 rounded-lg p-4 w-full mb-6">
                              <p className="text-sm text-muted-foreground">
                                <strong>What happens next?</strong>
                              </p>
                              <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left list-disc list-inside">
                                <li>Our team will review your request</li>
                                <li>We'll contact you to confirm details</li>
                                <li>You'll receive updates on bid status</li>
                              </ul>
                            </div>
                            <div className="flex gap-3 w-full">
                              <Button
                                variant="outline"
                                onClick={() => handleDialogClose(false)}
                                className="flex-1"
                              >
                                Close
                              </Button>
                              <Button asChild className="flex-1">
                                <Link to="/dashboard/quotes">View My Requests</Link>
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <DialogHeader>
                            <DialogTitle>Request Bidding Assistance</DialogTitle>
                            <DialogDescription>
                              Submit your bid request for the {vehicle.year} {vehicle.make} {vehicle.model}. 
                              Our team will contact you to discuss details.
                            </DialogDescription>
                          </DialogHeader>

                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleBidSubmit)} className="space-y-4 mt-4">
                              <div className="bg-muted/50 rounded-lg p-4 mb-2">
                                <p className="text-sm font-medium text-foreground">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Lot #{vehicle.lot_number} • {vehicle.auction_source.toUpperCase()}
                                </p>
                              </div>

                              <FormField
                                control={form.control}
                                name="max_bid_amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Maximum Bid Amount (USD)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter your max bid"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      The maximum amount you're willing to bid (excluding fees)
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="destination_country"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Destination Country</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Nigeria" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="destination_port"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Destination Port</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Lagos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Disclaimer Checkbox */}
                              <FormField
                                control={form.control}
                                name="accept_disclaimer"
                                render={({ field }) => (
                                  <FormItem className="bg-warning-muted border border-warning/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          className="mt-0.5"
                                        />
                                      </FormControl>
                                      <div className="space-y-1">
                                        <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                                          I understand and accept the terms
                                        </FormLabel>
                                        <p className="text-xs text-muted-foreground">
                                          I understand that: (1) GESOD RIDES does not own this vehicle and will bid on my behalf, 
                                          (2) winning is not guaranteed and depends on auction competition, (3) auction fees, 
                                          buyer premiums, shipping, and clearing costs are separate and will be quoted, and 
                                          (4) vehicle condition is sold as-is.
                                        </p>
                                        <FormMessage />
                                      </div>
                                    </div>
                                  </FormItem>
                                )}
                              />

                              <div className="flex gap-3 pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleDialogClose(false)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={createBidMutation.isPending}
                                  className="flex-1"
                                >
                                  {createBidMutation.isPending && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  )}
                                  Submit Request
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </>
                      )}
                    </DialogContent>
                  )}
                </Dialog>
              )}

              {vehicle.status === "expired" && (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-muted-foreground">
                    This auction listing has expired. Browse our other{" "}
                    <Link to="/auctions" className="text-primary hover:underline">
                      active listings
                    </Link>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
