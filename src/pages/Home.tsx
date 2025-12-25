import { Link } from "react-router-dom";
import {
  Gavel,
  Ship,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  Search,
  ClipboardList,
  Users,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/marketing/FeatureIcon";
import { Icon3D } from "@/components/ui/icon-3d";

const services = [
  {
    icon: Gavel,
    color: "blue" as const,
    title: "Auction Vehicle Bidding Support",
    description: "We place bids on your behalf at U.S. vehicle auctions including Copart and IAAI. You provide your maximum bid amount, and we handle the bidding process.",
    href: "/services#auction-bidding",
    action: "Learn More",
  },
  {
    icon: Ship,
    color: "violet" as const,
    title: "Ocean Freight (RORO)",
    description: "Roll-on/Roll-off shipping from U.S. ports to international destinations. We coordinate with shipping lines to transport your vehicle overseas.",
    href: "/services#ocean-freight",
    action: "Learn More",
  },
  {
    icon: Truck,
    color: "orange" as const,
    title: "Inland Vehicle Towing",
    description: "Vehicle transport from auction yards to U.S. ports. We arrange pickup and delivery to ensure your vehicle reaches the departure port.",
    href: "/services#inland-freight",
    action: "Learn More",
  },
];


const platformHighlights = [
  {
    icon: MapPin,
    color: "blue" as const,
    title: "VIN-Based Tracking",
    description: "Each vehicle is tracked by its unique VIN. Check status at any time through our tracking portal.",
  },
  {
    icon: CheckCircle,
    color: "emerald" as const,
    title: "Transparent Status Updates",
    description: "Receive clear status updates as your vehicle moves through each stage of the process.",
  },
  {
    icon: FileText,
    color: "violet" as const,
    title: "Centralized Documents",
    description: "Access invoices, bills of lading, and other documentation from your customer dashboard.",
  },
  {
    icon: Users,
    color: "orange" as const,
    title: "Admin-Managed Process",
    description: "Our team handles coordination with auction houses, carriers, and shipping lines on your behalf.",
  },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/40 py-20 sm:py-28 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/50 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
              Vehicle Auction Support, Shipping & VIN Tracking{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                — All in One Platform
              </span>
            </h1>
            
            {/* Service explanations */}
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                GESOD RIDES coordinates vehicle imports from U.S. auctions:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex items-center justify-center gap-2">
                  <Gavel className="h-4 w-4 text-primary shrink-0" />
                  <span>Auction bidding support — we bid on your behalf at Copart, IAAI, and other platforms</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Ship className="h-4 w-4 text-primary shrink-0" />
                  <span>RORO shipping — ocean freight from U.S. ports to international destinations</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span>Inland towing — vehicle transport from auction yards to ports</span>
                </li>
              </ul>
            </div>

            {/* Primary CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8">
                <Link to="/auctions">
                  View Auction Vehicles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-base px-8">
                <Link to="/quote">Get a Quote</Link>
              </Button>
            </div>

            {/* Secondary CTA */}
            <div className="mt-6">
              <Link 
                to="/track" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Track a Vehicle by VIN</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What We Do
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              We facilitate vehicle acquisition and logistics from U.S. auctions 
              to international destinations.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, idx) => (
              <Card 
                key={idx} 
                className="group border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <FeatureIcon icon={service.icon} color={service.color} size="lg" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
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


      {/* Platform Highlights */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Platform Highlights
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Tools and processes designed to keep you informed throughout the vehicle import journey.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {platformHighlights.map((highlight, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-5">
                  <Icon3D 
                    icon={highlight.icon} 
                    color={highlight.color} 
                    variant="floating" 
                    size="lg"
                    animate
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Quote Request */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Request a Quote</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get cost estimates for auction bidding, inland transport, 
                  or ocean freight services.
                </p>
                <Button asChild className="w-full">
                  <Link to="/quote">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* VIN Tracking */}
            <Card className="border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Search className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">VIN Tracking</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Check the status of your vehicle shipment using your 
                  17-character VIN.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/track">
                    Track Status
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Auction Listings */}
            <Card className="border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Gavel className="h-5 w-5 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Auction Vehicles</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse available auction vehicle listings from third-party 
                  platforms.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auctions">
                    View Listings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Get Started
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Choose an option below to begin working with us.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/quote">
                <ClipboardList className="h-4 w-4 mr-2" />
                Request a Quote
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
              <Link to="/track">
                <Search className="h-4 w-4 mr-2" />
                Track a Vehicle by VIN
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
              <Link to="/auctions">
                <Gavel className="h-4 w-4 mr-2" />
                View Auction Listings
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t border-border bg-muted/20">
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
