import { Link } from "react-router-dom";
import {
  Gavel,
  Ship,
  Truck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Anchor,
  MapPin,
  Clock,
  FileText,
  Users,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/marketing/FeatureIcon";
import { Separator } from "@/components/ui/separator";

interface ServiceDetail {
  id: string;
  icon: typeof Gavel;
  color: "blue" | "emerald" | "violet" | "orange";
  title: string;
  subtitle: string;
  description: string[];
  included: string[];
  notIncluded: string[];
  ctaLabel: string;
  ctaHref: string;
}

const services: ServiceDetail[] = [
  {
    id: "auction-bidding",
    icon: Gavel,
    color: "blue",
    title: "Auction Vehicle Sourcing & Bidding Support",
    subtitle: "Access U.S. salvage and clean-title auctions with structured bidding assistance",
    description: [
      "GESOD RIDES provides access to vehicle listings from major U.S. auction platforms, including Copart and IAAI. These are third-party auction houses that hold and sell vehicles on behalf of insurance companies, dealers, and private sellers.",
      "Clients can request bid-on-behalf services by specifying the vehicle of interest and their maximum bid amount. Our team places bids according to your instructions during the auction. Winning a vehicle is subject to auction dynamics including competing bidders and reserve prices.",
      "Once a vehicle is won, we coordinate the subsequent logistics — including pickup, inland transport, and ocean freight — as separate service requests.",
    ],
    included: [
      "Access to auction listings from Copart, IAAI, and other platforms",
      "Bid placement on your behalf according to your specified maximum bid",
      "Auction results notification (win/loss outcome)",
      "Coordination with logistics services post-auction (separate service)",
      "Basic vehicle information as provided by auction platforms",
    ],
    notIncluded: [
      "Physical vehicle inspection prior to bidding",
      "Guarantee of winning any specific vehicle",
      "Assessment of vehicle condition beyond auction-provided information",
      "Title transfer or registration services",
      "Repair or reconditioning services",
    ],
    ctaLabel: "View Auction Listings",
    ctaHref: "/auctions",
  },
  {
    id: "ocean-freight",
    icon: Ship,
    color: "violet",
    title: "Ocean Freight (RORO Shipping)",
    subtitle: "Roll-on/Roll-off shipping from U.S. ports to international destinations",
    description: [
      "GESOD RIDES coordinates Roll-on/Roll-off (RORO) ocean freight for vehicles being exported from the United States. RORO shipping involves driving or rolling vehicles onto specialized cargo vessels, which then transport them to destination ports worldwide.",
      "We work with established shipping lines to arrange vessel space and provide estimated sailing schedules. Origin ports typically include locations such as New Jersey, Georgia, Texas, and California, depending on vehicle pickup location and destination.",
      "Transit times vary based on the destination port, vessel routing, and port schedules. All timelines provided are indicative and subject to change based on carrier schedules, weather conditions, and port operations.",
    ],
    included: [
      "Vessel booking and space reservation",
      "Port handling at origin port (U.S.)",
      "Marine transit from origin port to destination port",
      "Bill of Lading issuance",
      "Estimated sailing schedule and transit updates",
      "Coordination with destination port agents (where applicable)",
    ],
    notIncluded: [
      "Customs clearance at destination country",
      "Import duties, taxes, or government fees at destination",
      "Destination port handling and release fees",
      "Inland transport at destination",
      "Marine cargo insurance (available as add-on)",
      "Storage fees at origin or destination ports",
    ],
    ctaLabel: "Request Ocean Freight Quote",
    ctaHref: "/quote/ocean-freight",
  },
  {
    id: "inland-freight",
    icon: Truck,
    color: "orange",
    title: "Inland Freight (Vehicle Towing)",
    subtitle: "Ground transportation from auction yards to ports or designated locations",
    description: [
      "GESOD RIDES arranges ground transportation for vehicles within the United States. This service covers pickup from auction yards, storage facilities, or other locations and delivery to designated ports or customer-specified destinations.",
      "Vehicles are transported using flatbed trucks, enclosed carriers, or tow dollies depending on the vehicle's condition. Drivable vehicles may be transported on multi-car carriers, while non-drivable or damaged vehicles require flatbed transport.",
      "Transport timelines depend on distance, carrier availability, and vehicle condition. We coordinate pickup scheduling with auction yards, which may have specific release windows and documentation requirements.",
    ],
    included: [
      "Vehicle pickup from auction yard or specified location",
      "Ground transport to destination port or designated address",
      "Carrier booking and scheduling",
      "Transport documentation",
      "Delivery confirmation upon arrival",
      "Handling of both drivable and non-drivable vehicles",
    ],
    notIncluded: [
      "Auction gate fees or release fees",
      "Storage fees at auction yards prior to pickup",
      "Vehicle repairs or preparation for transport",
      "Expedited or guaranteed delivery dates",
      "Insurance claims processing for transport damage",
      "International ground transport",
    ],
    ctaLabel: "Request Inland Freight Quote",
    ctaHref: "/quote/inland-freight",
  },
];

export default function Services() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-accent/40 py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Our Services
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Vehicle Sourcing &{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Logistics Services
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl">
              We facilitate vehicle acquisition from U.S. auctions and coordinate 
              transportation to international destinations. Each service below outlines 
              what is included and what falls outside our scope.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all"
              >
                <FeatureIcon icon={service.icon} color={service.color} size="md" />
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title.split(" ").slice(0, 2).join(" ")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.subtitle.split(" ").slice(0, 4).join(" ")}...
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Service Sections */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-16 sm:py-24 ${index % 2 === 1 ? "bg-muted/30" : ""}`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Service Header */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="lg:w-2/3">
                <div className="flex items-start gap-5 mb-6">
                  <FeatureIcon icon={service.icon} color={service.color} size="xl" />
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {service.title}
                    </h2>
                    <p className="mt-2 text-lg text-muted-foreground">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  {service.description.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div className="lg:w-1/3 w-full">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>Quotes typically provided within 24 hours</span>
                    </div>
                    <Button asChild className="w-full" size="lg">
                      <Link to={service.ctaHref}>
                        {service.ctaLabel}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      No commitment required
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="my-10" />

            {/* Included / Not Included */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* What's Included */}
              <Card className="border-2 border-success/20 bg-gradient-to-br from-success/5 via-card to-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success shrink-0 mt-1" />
                        <span className="text-sm text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* What's Not Included */}
              <Card className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 via-card to-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-warning" />
                    </div>
                    What's Not Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.notIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <XCircle className="h-4 w-4 text-warning shrink-0 mt-1" />
                        <span className="text-sm text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      ))}

      {/* Important Notes Section */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground/80">
                <p>
                  <strong>Service Scope:</strong> GESOD RIDES operates as a logistics 
                  facilitation company. We coordinate services between clients and 
                  third-party providers (auction houses, shipping lines, transport carriers). 
                  We do not own vehicles, vessels, or transport equipment.
                </p>
                <p>
                  <strong>Timelines:</strong> All transit times, delivery estimates, and 
                  schedules are indicative and subject to change based on factors outside 
                  our control, including carrier availability, weather, port congestion, 
                  and customs processing.
                </p>
                <p>
                  <strong>Documentation:</strong> Clients are responsible for ensuring 
                  compliance with import regulations at their destination. We provide 
                  standard shipping documentation but do not provide legal, customs, 
                  or regulatory advice.
                </p>
                <p>
                  <strong>Quotes:</strong> All quotes are valid for the period specified 
                  and are subject to rate changes by carriers and service providers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-700" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-white/80 max-w-xl mx-auto text-lg">
                Request a quote for any of our services. Our team will respond 
                with detailed pricing and next steps.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  <Link to="/quote">
                    Request a Quote
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Link to="/auctions">Browse Auctions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
