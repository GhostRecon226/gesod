import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  Gavel,
  Truck,
  Ship,
  CheckCircle,
  ArrowRight,
  ClipboardList,
  MapPin,
  Package,
  Info,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/marketing/FeatureIcon";
import { Disclaimer } from "@/components/ui/disclaimer";

const processSteps = [
  {
    step: 1,
    icon: Search,
    color: "blue" as const,
    title: "Browse & Select",
    description: "Review available auction vehicle listings from third-party platforms like Copart and IAAI. Identify vehicles that meet your requirements.",
    details: [
      "View vehicle photos and auction details",
      "Check lot numbers and auction dates",
      "Research vehicle history independently",
    ],
    cta: { label: "View Auction Listings", href: "/auctions" },
  },
  {
    step: 2,
    icon: ClipboardList,
    color: "emerald" as const,
    title: "Request a Quote",
    description: "Submit a quote request for the services you need. We provide estimates for bidding assistance, inland transport, and ocean freight.",
    details: [
      "Specify vehicle and destination details",
      "Receive itemized cost estimates",
      "No commitment required at this stage",
    ],
    cta: { label: "Request a Quote", href: "/quote" },
  },
  {
    step: 3,
    icon: Gavel,
    color: "violet" as const,
    title: "Bidding Assistance",
    description: "If you proceed, we place bids on your behalf according to your maximum bid instructions. Auction outcomes depend on competing bidders and reserve prices.",
    details: [
      "Set your maximum bid amount",
      "We bid according to your instructions",
      "Receive notification of auction outcome",
    ],
    note: "Winning a specific vehicle is not guaranteed.",
  },
  {
    step: 4,
    icon: Truck,
    color: "orange" as const,
    title: "Inland Transport",
    description: "Once a vehicle is won, we coordinate pickup from the auction yard and transport to the designated port or location within the United States.",
    details: [
      "Vehicle pickup from auction yard",
      "Transport to origin port",
      "Handling of drivable and non-drivable vehicles",
    ],
  },
  {
    step: 5,
    icon: Ship,
    color: "blue" as const,
    title: "Ocean Freight",
    description: "We arrange RORO (Roll-on/Roll-off) shipping from U.S. ports to your destination port. Transit times vary based on route and carrier schedules.",
    details: [
      "Vessel booking and documentation",
      "Port-to-port shipping",
      "Bill of Lading issuance",
    ],
    note: "Transit times are indicative and subject to change.",
  },
  {
    step: 6,
    icon: MapPin,
    color: "emerald" as const,
    title: "Status Updates",
    description: "Track your vehicle through our VIN tracking system. We provide status updates at key milestones throughout the shipping process.",
    details: [
      "Status-based milestone tracking",
      "Updates via customer portal",
      "Document access through dashboard",
    ],
    cta: { label: "Learn About VIN Tracking", href: "/track" },
  },
];

export default function HowItWorks() {
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
              <Package className="h-4 w-4" />
              Our Process
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              How It{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl">
              From vehicle selection to delivery, here is an overview of the steps 
              involved when working with GESOD RIDES. Each stage has defined responsibilities 
              and clear communication points.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  {/* Step content */}
                  <div className="sm:pl-20">
                    {/* Step number badge - positioned on timeline */}
                    <div className="hidden sm:flex absolute left-0 top-0 h-16 w-16 items-center justify-center">
                      <div className="relative z-10">
                        <FeatureIcon icon={step.icon} color={step.color} size="md" />
                      </div>
                    </div>

                    <Card className="border bg-card">
                      <CardContent className="p-6 sm:p-8">
                        {/* Mobile icon */}
                        <div className="sm:hidden mb-4">
                          <FeatureIcon icon={step.icon} color={step.color} size="md" />
                        </div>

                        {/* Step header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Step {step.step}
                            </span>
                            <h3 className="text-xl font-semibold text-foreground mt-1">
                              {step.title}
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-foreground/80 leading-relaxed mb-4">
                          {step.description}
                        </p>

                        {/* Details list */}
                        <ul className="space-y-2 mb-4">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                              {detail}
                            </li>
                          ))}
                        </ul>

                        {/* Note if exists */}
                        {step.note && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{step.note}</span>
                          </div>
                        )}

                        {/* CTA if exists */}
                        {step.cta && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={step.cta.href}>
                                {step.cta.label}
                                <ArrowRight className="h-3 w-3 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Important Information
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Disclaimer variant="info" title="Service Scope">
              <p>
                GESOD RIDES facilitates logistics coordination. We work with 
                third-party auction houses, carriers, and shipping lines. We do 
                not own vehicles or transport equipment.
              </p>
            </Disclaimer>

            <Disclaimer variant="info" title="Timelines">
              <p>
                All transit times and delivery estimates are indicative. Actual 
                timelines depend on carrier schedules, weather, port operations, 
                and customs processing.
              </p>
            </Disclaimer>

            <Disclaimer variant="info" title="Auction Outcomes">
              <p>
                Winning a specific auction vehicle is not guaranteed. Results 
                depend on competing bidders, reserve prices, and auction conditions.
              </p>
            </Disclaimer>

            <Disclaimer variant="info" title="Destination Responsibilities">
              <p>
                Customs clearance, import duties, and destination port fees are 
                the responsibility of the client. We provide documentation support 
                but do not handle customs at destination.
              </p>
            </Disclaimer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to Learn More?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Explore our services in detail or browse current auction listings. 
              Our team is available to answer questions about the process.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/services">
                  View Our Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/auctions">Browse Auction Listings</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
