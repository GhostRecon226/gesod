import { Link } from "react-router-dom";
import {
  Truck,
  Gavel,
  Ship,
  MapPin,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/marketing/FeatureIcon";
import { Icon3D } from "@/components/ui/icon-3d";

const services = [
  {
    icon: Gavel,
    title: "Auction Sourcing Support",
    description: "We help you identify vehicles from major U.S. auction platforms like Copart and IAAI. We provide information on available listings to help you make informed decisions.",
    color: "blue" as const,
  },
  {
    icon: Truck,
    title: "Bid-on-Behalf Services",
    description: "For customers who prefer assistance, we can place bids on your behalf at auctions. You set the maximum bid amount; we handle the bidding process according to your instructions.",
    color: "emerald" as const,
  },
  {
    icon: Ship,
    title: "Ocean Freight Coordination",
    description: "We coordinate RORO (Roll-on/Roll-off) and container shipping for vehicles heading to international destinations. Quotes are provided based on your specific route and vehicle specifications.",
    color: "violet" as const,
  },
  {
    icon: MapPin,
    title: "Inland Vehicle Towing",
    description: "We arrange ground transportation from auction yards to ports or designated pickup locations within the United States. Pricing depends on distance and vehicle condition.",
    color: "orange" as const,
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "Structured Process",
    description: "Clear, defined steps from vehicle selection through delivery. No guesswork about what happens next.",
    color: "blue" as const,
  },
  {
    icon: MapPin,
    title: "Status-Based VIN Tracking",
    description: "Monitor your vehicle's progress through our tracking system. Status updates are provided as milestones are reached.",
    color: "emerald" as const,
  },
  {
    icon: FileText,
    title: "Centralized Documentation",
    description: "Access invoices, bills of lading, and other documents through your customer dashboard. All paperwork in one place.",
    color: "violet" as const,
  },
  {
    icon: MessageCircle,
    title: "Clear Communication",
    description: "We communicate updates proactively. If there are delays or issues, you will hear from us directly.",
    color: "orange" as const,
  },
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-accent py-20 sm:py-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Vehicle Sourcing & Logistics
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                GESOD RIDES
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl">
              GESOD RIDES is a vehicle sourcing and logistics facilitation company. 
              We connect customers with auction opportunities and coordinate the movement 
              of vehicles from U.S. auctions to destinations worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Who We Are
              </h2>
              <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  GESOD RIDES operates as a facilitation and logistics coordination company. 
                  We do not manufacture or sell vehicles directly. Instead, we assist customers 
                  in navigating the vehicle importation process — from auction sourcing to 
                  final delivery.
                </p>
                <p>
                  Our approach is built on transparency and structured processes. Every step of 
                  your vehicle's journey is documented, tracked, and communicated clearly. 
                  We believe informed customers make better decisions, and we prioritize 
                  providing accurate information over making promises we cannot control.
                </p>
                <p>
                  Whether you are purchasing your first auction vehicle or managing a fleet 
                  of imports, our goal is to provide consistent, reliable support throughout 
                  the process.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <Card className="relative border-0 bg-gradient-to-br from-card via-card to-accent/20 shadow-xl">
                <CardContent className="p-8 sm:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <Icon3D icon={Shield} color="blue" variant="raised" size="lg" />
                    <h3 className="text-xl font-semibold text-foreground">Our Approach</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Process-driven operations with clear milestones",
                      "Transparent communication at every stage",
                      "Documented workflows and status tracking",
                      "No hidden fees or surprise charges",
                      "Realistic expectations, not exaggerated promises",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-success" />
                        </div>
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What We Do
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Our services are designed to support each phase of the vehicle importation 
              process, from sourcing to delivery.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <Card 
                key={idx} 
                className="group relative border-0 bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <CardContent className="relative pt-8 pb-6">
                  <div className="mb-6">
                    <FeatureIcon icon={service.icon} color={service.color} size="lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do NOT Do */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What We Do Not Do
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              To maintain transparency, it is important to clarify the boundaries of 
              our services and responsibilities.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/5 via-card to-warning/5 shadow-lg">
              <CardContent className="pt-6 pb-2">
                <ul className="space-y-5">
                  {[
                    {
                      title: "We do not own auction vehicles",
                      description: "All vehicles listed on our platform are sourced from third-party auction houses. We facilitate access to these listings but do not hold title or ownership of any vehicle until a transaction is completed on your behalf."
                    },
                    {
                      title: "We do not guarantee auction outcomes",
                      description: "Auction results depend on market conditions, competing bidders, and reserve prices set by sellers. While we execute bids according to your instructions, winning a specific vehicle is never guaranteed."
                    },
                    {
                      title: "We do not control customs authorities",
                      description: "Import regulations, duties, and clearance timelines are determined by government authorities at your destination. We provide documentation support, but final clearance decisions rest with customs officials."
                    },
                    {
                      title: "We do not guarantee vehicle condition",
                      description: "Auction vehicles are sold as-is. We encourage customers to review available auction reports and photos before making bidding decisions. We do not inspect vehicles prior to purchase."
                    }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 pb-5 border-b border-warning/20 last:border-0 last:pb-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-warning/30 to-warning/10 flex items-center justify-center shrink-0">
                        <XCircle className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose GESOD RIDES */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Work With Us
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Our systems and processes are designed to keep you informed and 
              reduce uncertainty throughout the importation process.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, idx) => (
              <Card 
                key={idx} 
                className="group border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="flex justify-center mb-5">
                    <Icon3D 
                      icon={item.icon} 
                      color={item.color} 
                      variant="floating" 
                      size="lg"
                      animate
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
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
                Browse our auction listings, request a freight quote, or track an 
                existing shipment. Our team is here to assist you.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  <Link to="/auctions">
                    View Auction Listings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Link to="/quote">
                    Request a Quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
