import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsAndConditions() {
  return (
    <PublicLayout>
      <div className="page-container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6 md:p-8 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Welcome to GESOD RIDES</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions govern your use of the GESOD RIDES platform and services. 
                  By using our platform, you agree to these terms. Please read them carefully before 
                  using our services.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  GESOD RIDES provides logistics facilitation services for vehicle imports. We help 
                  coordinate auction bidding, inland transportation, and ocean freight shipping from 
                  the United States to your destination.
                </p>
              </section>

              <Separator />

              {/* Nature of Services */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Our Services</h2>
                
                <h3 className="text-lg font-medium mb-2">What We Do</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Coordinate bid placement at US vehicle auctions on your behalf</li>
                  <li>Arrange inland transport from auction yards to shipping ports</li>
                  <li>Facilitate ocean freight booking to international destinations</li>
                  <li>Provide status-based tracking updates for your shipments</li>
                  <li>Assist with documentation for shipping and customs</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">What We Do Not Do</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We do not own, sell, or warehouse vehicles</li>
                  <li>We do not operate transport trucks or shipping vessels</li>
                  <li>We do not guarantee auction outcomes or winning bids</li>
                  <li>We do not provide customs clearance services at destination</li>
                  <li>We do not provide vehicle warranties or guarantees</li>
                </ul>
              </section>

              <Separator />

              {/* Auction Vehicles */}
              <section>
                <h2 className="text-xl font-semibold mb-4">About Auction Vehicles</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Important:</strong> GESOD RIDES does not own any vehicles listed on our platform 
                  or available through auction services. All vehicles shown are third-party listings from 
                  auction houses such as Copart, IAAI, and others.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  When you request bidding assistance, we act as your agent to place bids at auctions. 
                  Auction outcomes are determined by the auction house and depend on competing bidders, 
                  reserve prices, and other factors beyond our control.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Vehicle conditions, damage assessments, and specifications are provided by auction 
                  houses. We do not inspect vehicles ourselves and cannot verify the accuracy of 
                  auction-provided information.
                </p>
              </section>

              <Separator />

              {/* VIN Tracking */}
              <section>
                <h2 className="text-xl font-semibold mb-4">VIN Tracking Explained</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our VIN tracking feature provides <strong>status-based milestone updates</strong>, 
                  not real-time GPS tracking. When you track a vehicle using its VIN (Vehicle 
                  Identification Number), you will see updates at key stages:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li><strong>Pending:</strong> Your vehicle is registered and awaiting processing</li>
                  <li><strong>Active:</strong> Vehicle is being processed or in transit</li>
                  <li><strong>In Progress:</strong> Vehicle is currently being transported</li>
                  <li><strong>Awaiting Action:</strong> Requires your attention or additional information</li>
                  <li><strong>Delayed:</strong> Unexpected delays due to external factors</li>
                  <li><strong>Completed:</strong> Vehicle has arrived at destination port</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Status updates are entered by our operations team based on information from carriers 
                  and shipping lines. Updates may not be instantaneous and typically reflect completed 
                  milestones rather than live location.
                </p>
              </section>

              <Separator />

              {/* Quotes and Payments */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Quotes and Payments</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All quotes provided through our platform are estimates based on current market 
                  conditions, vehicle specifications, and route information.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Quotes are valid for the period specified (typically 7-14 days)</li>
                  <li>Final costs may vary based on actual vehicle dimensions, weight, and carrier rates</li>
                  <li>Additional fees may apply for storage, documentation, or special handling</li>
                  <li>Currency conversions are based on rates at the time of transaction</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Payment terms, methods, and schedules will be communicated separately for each 
                  transaction. Failure to make timely payments may result in storage fees or 
                  service delays.
                </p>
              </section>

              <Separator />

              {/* Limitations */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Limitations and Disclaimers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to provide reliable coordination services, please understand:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Delivery Timelines:</strong> All timelines are estimates. Delays may 
                    occur due to weather, customs, carrier schedules, or other factors.
                  </li>
                  <li>
                    <strong>Vehicle Condition:</strong> We do not guarantee vehicle condition. 
                    Additional damage may occur during transport despite standard precautions.
                  </li>
                  <li>
                    <strong>Third-Party Services:</strong> Actual transport is performed by 
                    independent carriers and shipping lines with their own terms and conditions.
                  </li>
                  <li>
                    <strong>Customs and Import:</strong> We do not control customs processes 
                    at destination countries. Import duties and clearance are your responsibility.
                  </li>
                </ul>
              </section>

              <Separator />

              {/* User Responsibilities */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Your Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By using GESOD RIDES, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Provide accurate information about yourself and your shipping requirements</li>
                  <li>Respond promptly to requests for information or documentation</li>
                  <li>Make payments according to agreed terms</li>
                  <li>Arrange customs clearance and local pickup at destination</li>
                  <li>Use our platform for lawful purposes only</li>
                  <li>Keep your account credentials secure</li>
                </ul>
              </section>

              <Separator />

              {/* Changes to Terms */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Changes to These Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms and Conditions from time to time. When we make 
                  significant changes, we will notify you through the platform or via email. 
                  Continued use of our services after changes take effect constitutes acceptance 
                  of the updated terms.
                </p>
              </section>

              <Separator />

              {/* Contact */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about these Terms and Conditions, please contact us:
                </p>
                <ul className="list-none space-y-1 text-muted-foreground mt-4">
                  <li><strong>Email:</strong> contact@gesodrides.com</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                  <li><strong>Hours:</strong> Monday–Friday, 9:00 AM – 6:00 PM EST</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
