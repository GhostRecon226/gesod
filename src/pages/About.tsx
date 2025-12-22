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
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About GESOD RIDES
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              GESOD RIDES is a vehicle sourcing and logistics facilitation company. 
              We connect customers with auction opportunities and coordinate the movement 
              of vehicles from U.S. auctions to destinations worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Who We Are
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
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
            <div className="bg-muted/50 rounded-2xl p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
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
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What We Do
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our services are designed to support each phase of the vehicle importation 
              process, from sourcing to delivery.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Gavel className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Auction Sourcing Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  We help you identify vehicles from major U.S. auction platforms like 
                  Copart and IAAI. We provide information on available listings to help 
                  you make informed decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Bid-on-Behalf Services
                </h3>
                <p className="text-sm text-muted-foreground">
                  For customers who prefer assistance, we can place bids on your behalf 
                  at auctions. You set the maximum bid amount; we handle the bidding 
                  process according to your instructions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Ship className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ocean Freight Coordination
                </h3>
                <p className="text-sm text-muted-foreground">
                  We coordinate RORO (Roll-on/Roll-off) and container shipping for vehicles 
                  heading to international destinations. Quotes are provided based on your 
                  specific route and vehicle specifications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Inland Vehicle Towing
                </h3>
                <p className="text-sm text-muted-foreground">
                  We arrange ground transportation from auction yards to ports or 
                  designated pickup locations within the United States. Pricing depends 
                  on distance and vehicle condition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do NOT Do */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What We Do Not Do
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              To maintain transparency, it is important to clarify the boundaries of 
              our services and responsibilities.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-warning/30 bg-warning-muted">
              <CardContent className="pt-6">
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                      <XCircle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        We do not own auction vehicles
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        All vehicles listed on our platform are sourced from third-party 
                        auction houses. We facilitate access to these listings but do not 
                        hold title or ownership of any vehicle until a transaction is completed 
                        on your behalf.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                      <XCircle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        We do not guarantee auction outcomes
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Auction results depend on market conditions, competing bidders, and 
                        reserve prices set by sellers. While we execute bids according to your 
                        instructions, winning a specific vehicle is never guaranteed.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                      <XCircle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        We do not control customs authorities
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Import regulations, duties, and clearance timelines are determined by 
                        government authorities at your destination. We provide documentation 
                        support, but final clearance decisions rest with customs officials.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                      <XCircle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        We do not guarantee vehicle condition
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Auction vehicles are sold as-is. We encourage customers to review 
                        available auction reports and photos before making bidding decisions. 
                        We do not inspect vehicles prior to purchase.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose GESOD RIDES */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Work With Us
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our systems and processes are designed to keep you informed and 
              reduce uncertainty throughout the importation process.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Structured Process
              </h3>
              <p className="text-sm text-muted-foreground">
                Clear, defined steps from vehicle selection through delivery. 
                No guesswork about what happens next.
              </p>
            </div>

            <div className="text-center">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Status-Based VIN Tracking
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitor your vehicle's progress through our tracking system. 
                Status updates are provided as milestones are reached.
              </p>
            </div>

            <div className="text-center">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Centralized Documentation
              </h3>
              <p className="text-sm text-muted-foreground">
                Access invoices, bills of lading, and other documents through 
                your customer dashboard. All paperwork in one place.
              </p>
            </div>

            <div className="text-center">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Clear Communication
              </h3>
              <p className="text-sm text-muted-foreground">
                We communicate updates proactively. If there are delays or issues, 
                you will hear from us directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Browse our auction listings, request a freight quote, or track an 
              existing shipment. Our team is here to assist you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/auctions">
                  View Auction Listings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/quote">
                  Request a Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}