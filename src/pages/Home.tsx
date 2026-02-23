import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Gavel,
  Ship,
  Truck,
  ArrowRight,
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  ImageOff,
  Car,
} from "lucide-react";
import heroCar1 from "@/assets/hero-car-1.png";
import heroCar2 from "@/assets/hero-car-2.png";
import heroCar3 from "@/assets/hero-car-3.png";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchActiveAuctionVehicles } from "@/services/auctionVehicleService";

const services = [
  {
    icon: Gavel,
    title: "Auction Vehicle Bidding Support",
    description: "We place bids on your behalf at U.S. vehicle auctions including Copart and IAAI. You provide your maximum bid amount, and we handle the bidding process.",
    href: "/services#auction-bidding",
  },
  {
    icon: Ship,
    title: "Ocean Freight (RORO)",
    description: "Roll-on/Roll-off shipping from U.S. ports to international destinations. We coordinate with shipping lines to transport your vehicle overseas.",
    href: "/services#ocean-freight",
  },
  {
    icon: Truck,
    title: "Inland Vehicle Towing",
    description: "Vehicle transport from auction yards to U.S. ports. We arrange pickup and delivery to ensure your vehicle reaches the departure port.",
    href: "/services#inland-freight",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Find Your Vehicle",
    description: "Browse auction listings from Copart, IAAI, and other U.S. platforms.",
  },
  {
    step: "02",
    title: "We Bid For You",
    description: "Set your maximum bid and we handle the auction process on your behalf.",
  },
  {
    step: "03",
    title: "Secure Shipping",
    description: "We coordinate inland transport and ocean freight to your destination.",
  },
  {
    step: "04",
    title: "Track & Receive",
    description: "Monitor your vehicle's journey with VIN tracking until delivery.",
  },
];

const trackingSteps = [
  { label: "Auction Won", completed: true },
  { label: "Payment Verified", completed: true },
  { label: "Inland Transport", completed: true },
  { label: "At Port", completed: false },
  { label: "Ocean Freight", completed: false },
  { label: "Delivered", completed: false },
];

const heroImages = [heroCar1, heroCar2, heroCar3];

function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-2xl overflow-hidden relative min-h-[520px] lg:min-h-[600px]">
        {/* Background Carousel - full bleed */}
        <div className="absolute inset-0">
          <div ref={emblaRef} className="overflow-hidden h-full">
            <div className="flex h-full">
              {heroImages.map((src, idx) => (
                <div key={idx} className="flex-[0_0_100%] min-w-0 h-full">
                  <img
                    src={src}
                    alt={`Premium vehicle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Dark overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>

        {/* Text Content - overlaid */}
        <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10 lg:p-14 xl:p-16 h-full min-h-[520px] lg:min-h-[600px] max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-medium mb-6 w-fit">
            Vehicle Import & Logistics
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold tracking-tight text-white leading-[1.1]">
            U.S. Auction Vehicles, Shipped Worldwide
          </h1>

          <p className="mt-5 text-white/70 leading-relaxed text-base lg:text-lg max-w-lg">
            GESOD RIDES coordinates vehicle acquisition from U.S. auctions and handles 
            the complete logistics chain — bidding support, inland transport, and ocean freight.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-accent-bright hover:bg-accent-bright/90 text-accent-bright-foreground shadow-glow-accent">
              <Link to="/quote">
                Request a Quote
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              <Link to="/track">
                <Search className="h-4 w-4 mr-2" />
                Track a Vehicle
              </Link>
            </Button>
          </div>

          {/* Stats Row */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Vehicles Imported" },
              { value: "30+", label: "Countries Served" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 right-8 z-20 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === selectedIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: vehicles } = useQuery({
    queryKey: ["auction-vehicles", "active", "preview"],
    queryFn: fetchActiveAuctionVehicles,
  });

  const previewVehicles = vehicles?.slice(0, 6) || [];

  return (
    <PublicLayout>
      {/* Hero Section - Split Layout */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <HeroSection />
      </section>

      {/* How It Works - Process Steps */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              A simple, structured process from vehicle selection to delivery.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 border border-primary/20 text-primary text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link to="/how-it-works">
                Learn More About Our Process
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Auction Preview */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Available Auction Vehicles
              </h2>
              <p className="mt-2 text-muted-foreground">
                Browse current listings from U.S. auction platforms.
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/auctions">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {previewVehicles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {previewVehicles.map((vehicle) => (
                <Link key={vehicle.id} to={`/auctions/${vehicle.id}`}>
                  <Card className="overflow-hidden group cursor-pointer">
                    <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                      {vehicle.vehicle_images && vehicle.vehicle_images.length > 0 ? (
                        <img
                          src={vehicle.vehicle_images[0]}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                          <ImageOff className="h-10 w-10 mb-2" />
                          <span className="text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="bg-card/90 border-border/50 backdrop-blur-sm">
                          {vehicle.auction_source.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5" />
                          Lot: {vehicle.lot_number}
                        </span>
                        {vehicle.auction_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(vehicle.auction_date), "MMM d")}
                          </span>
                        )}
                      </div>
                      {vehicle.yard_location && (
                        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {vehicle.yard_location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card rounded-xl">
              <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Active Listings</h3>
              <p className="text-muted-foreground mt-1">Check back soon for new auction vehicles.</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button asChild>
              <Link to="/auctions">
                View All Auction Vehicles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VIN Tracking Demo */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Track Your Vehicle's Journey
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Every vehicle is tracked by its unique VIN. Get real-time status updates 
                as your vehicle moves through each stage of the import process.
              </p>
              <ul className="mt-6 space-y-3">
                {["Status updates at every milestone", "Document access through your dashboard", "Email notifications for key events"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="glow" asChild>
                  <Link to="/track">
                    <Search className="h-4 w-4 mr-2" />
                    Track a Vehicle
                  </Link>
                </Button>
              </div>
            </div>

            {/* Tracking Preview */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-label">Sample VIN</p>
                    <p className="text-mono font-semibold text-foreground mt-1">1HGCM82633A******</p>
                  </div>
                  <Badge variant="in-progress">In Transit</Badge>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>50%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full shadow-glow" style={{ width: "50%" }} />
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  {trackingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? "bg-success text-success-foreground" 
                          : "bg-muted border-2 border-border"
                      }`}>
                        {step.completed && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <span className={step.completed ? "text-foreground" : "text-muted-foreground"}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Complete vehicle import logistics from U.S. auctions to international destinations.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, idx) => (
              <Card key={idx} className="glass-card border-border/30">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <Link 
                    to={service.href}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Learn more
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-hero rounded-2xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-hero-foreground sm:text-3xl lg:text-4xl">
                Ready to Import Your Vehicle?
              </h2>
              <p className="mt-4 text-hero-muted max-w-xl mx-auto text-lg">
                Get started with a quote or browse current auction listings.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent-bright hover:bg-accent-bright/90 text-accent-bright-foreground shadow-glow-accent">
                  <Link to="/quote">
                    Request a Quote
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="border-hero-muted/30 text-hero-foreground hover:bg-hero-foreground/10">
                  <Link to="/auctions">Browse Auctions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t border-border/50 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
            GESOD RIDES is a logistics facilitation company. We coordinate services between 
            clients and third-party providers including auction houses, shipping lines, and 
            transport carriers. All quotes are estimates subject to final confirmation. 
            Timelines are indicative and may vary based on external factors.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
