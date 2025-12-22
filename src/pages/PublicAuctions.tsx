import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Gavel, MapPin, Calendar, Car, Loader2, ImageOff, AlertTriangle } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchActiveAuctionVehicles, AuctionVehicle, AuctionSource } from "@/services/auctionVehicleService";

export default function PublicAuctions() {
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ["auction-vehicles", "active"],
    queryFn: fetchActiveAuctionVehicles,
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

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
              <Gavel className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Auction Vehicles</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Auction Vehicle Listings
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse available auction vehicles from third-party platforms. 
              Contact us to request bidding assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-destructive">Error loading auction listings</p>
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{vehicles.length}</span> active listings
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <AuctionVehicleCard key={vehicle.id} vehicle={vehicle} getSourceBadge={getSourceBadge} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Gavel className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Active Listings</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                There are currently no active auction vehicle listings. Check back soon for new opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-warning-muted border-y border-warning/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Important Disclaimer</p>
              <p>
                GESOD RIDES does not own these vehicles. All listings are from third-party auction platforms 
                (Copart, IAAI, etc.). We provide bidding assistance on your behalf. Auction fees, buyer premiums, 
                shipping, and customs/clearing costs are separate from the vehicle price. Winning bids are not guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl p-8 sm:p-10 border border-border">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  How Our Bidding Service Works
                </h2>
                <p className="mt-4 text-muted-foreground">
                  GESOD RIDES provides bidding assistance and full import logistics services for 
                  auction vehicles. We bid on your behalf and handle the entire process from purchase to delivery.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Bidding assistance on your behalf at U.S. auctions",
                    "Title and documentation coordination",
                    "Inland transport and ocean freight services",
                    "VIN status tracking through our customer portal",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Final costs include auction fees, buyer premiums, inland transport, 
                    ocean freight, and destination clearing charges. We provide transparent quotes for all services.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-primary/5 rounded-xl p-8 text-center">
                  <Gavel className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact us to discuss your requirements
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-2">
                    contact@gesodrides.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

interface AuctionVehicleCardProps {
  vehicle: AuctionVehicle;
  getSourceBadge: (source: AuctionSource) => React.ReactNode;
}

function AuctionVehicleCard({ vehicle, getSourceBadge }: AuctionVehicleCardProps) {
  const hasImages = vehicle.vehicle_images && vehicle.vehicle_images.length > 0;
  const primaryImage = hasImages ? vehicle.vehicle_images![0] : null;

  return (
    <Link to={`/auctions/${vehicle.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        {/* Image Section */}
        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <ImageOff className="h-12 w-12 mb-2" />
            <span className="text-sm">No image available</span>
          </div>
        )}
        {/* Source Badge Overlay */}
        <div className="absolute top-3 left-3">
          {getSourceBadge(vehicle.auction_source)}
        </div>
        {/* Image Count Badge */}
        {hasImages && vehicle.vehicle_images!.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-foreground/70 text-background text-xs font-medium px-2 py-1 rounded">
            +{vehicle.vehicle_images!.length - 1} photos
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-5">
        {/* Vehicle Title */}
        <h3 className="text-lg font-semibold text-foreground">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {vehicle.vehicle_type.toUpperCase()}
        </p>

        {/* Details */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Car className="h-4 w-4 shrink-0" />
            <span>Lot: <span className="font-mono font-medium text-foreground">{vehicle.lot_number}</span></span>
          </div>
          
          {vehicle.auction_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Auction: <span className="font-medium text-foreground">{format(new Date(vehicle.auction_date), "MMM d, yyyy")}</span></span>
            </div>
          )}
          
          {vehicle.yard_location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{vehicle.yard_location}</span>
            </div>
          )}
        </div>
        </CardContent>
      </Card>
    </Link>
  );
}
