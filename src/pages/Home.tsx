import { Link } from "react-router-dom";
import {
  Gavel,
  Ship,
  Truck,
  MapPin,
  FileText,
  Shield,
  CheckCircle,
  ArrowRight,
  Search,
  ClipboardList,
  Users,
  Package,
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
    title: "Auction Bidding Assistance",
    description: "We place bids on your behalf at U.S. auction platforms like Copart and IAAI.",
    href: "/services#auction-bidding",
  },
  {
    icon: Ship,
    color: "violet" as const,
    title: "Ocean Freight",
    description: "RORO shipping coordination from U.S. ports to international destinations.",
    href: "/services#ocean-freight",
  },
  {
    icon: Truck,
    color: "orange" as const,
    title: "Inland Transport",
    description: "Vehicle pickup from auction yards and transport to designated ports.",
    href: "/services#inland-freight",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Browse & Select",
    description: "Review auction vehicle listings and identify vehicles of interest.",
  },
  {
    step: "02",
    title: "Request a Quote",
    description: "Submit details and receive cost estimates for our services.",
  },
  {
    step: "03",
    title: "We Handle Logistics",
    description: "From bidding to shipping, we coordinate the entire process.",
  },
  {
    step: "04",
    title: "Track Progress",
    description: "Monitor status updates through our VIN tracking system.",
  },
];

const features = [
  {
    icon: MapPin,
    color: "blue" as const,
    title: "VIN Status Tracking",
    description: "Track shipment milestones through our customer portal. Status updates at each stage of the process.",
  },
  {
    icon: FileText,
    color: "emerald" as const,
    title: "Centralized Documentation",
    description: "Access invoices, bills of lading, and shipping documents in one place.",
  },
  {
    icon: Shield,
    color: "violet" as const,
    title: "Transparent Process",
    description: "Clear communication, defined steps, and realistic expectations throughout.",
  },
  {
    icon: Users,
    color: "orange" as const,
    title: "Dedicated Support",
    description: "Our team is available to answer questions and provide updates on your shipments.",
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Package className="h-4 w-4" />
              Vehicle Sourcing & Logistics Facilitation
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Simplifying Vehicle Imports{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                from the U.S.
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl max-w-3xl mx-auto">
              GESOD RIDES coordinates auction bidding, inland transport, and ocean freight 
              for clients importing vehicles from United States auctions. We handle the 
              logistics so you can focus on your business.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8">
                <Link to="/services">
                  Explore Our Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-base px-8">
                <Link to="/quote">Request a Quote</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Status-based VIN tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Transparent pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Centralized documentation</span>
              </div>
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

      {/* How It Works Summary */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              A straightforward process from vehicle selection to delivery.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card border border-border rounded-xl p-6 h-full">
                  <span className="text-4xl font-bold text-primary/20">
                    {step.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {/* Connector line */}
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link to="/how-it-works">
                View Detailed Process
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Platform Features */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Work With Us
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Our systems and processes are designed to keep you informed 
              throughout the importation process.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-5">
                  <Icon3D 
                    icon={feature.icon} 
                    color={feature.color} 
                    variant="floating" 
                    size="lg"
                    animate
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
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

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-700" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Ready to Import Your Next Vehicle?
              </h2>
              <p className="mt-4 text-white/80 max-w-xl mx-auto text-lg">
                Request a quote to get started. Our team will provide detailed 
                cost estimates and answer any questions about the process.
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
                  <Link to="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
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
