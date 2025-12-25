import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileCheck } from "lucide-react";

export default function ConsentPolicy() {
  return (
    <PublicLayout>
      <div className="page-container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <FileCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">Consent & Use of Information</h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6 md:p-8 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-xl font-semibold mb-4">About This Document</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This Consent & Use of Information policy explains how GESOD RIDES obtains your 
                  consent, what you are agreeing to when you use our services, and how we handle 
                  your information. We believe in being transparent about our practices.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By creating an account, requesting a quote, or using any of our services, you 
                  acknowledge that you have read and understood this document and consent to 
                  the practices described herein.
                </p>
              </section>

              <Separator />

              {/* Types of Consent */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Types of Consent We Obtain</h2>
                
                <h3 className="text-lg font-medium mb-2">Account Registration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you create an account, you consent to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Storage of your account information (name, email, phone, country)</li>
                  <li>Receipt of service-related communications (status updates, notifications)</li>
                  <li>Use of your information to provide logistics coordination services</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Quote Requests</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you request a quote, you consent to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Collection of vehicle and shipping details for quote preparation</li>
                  <li>Contact via email or phone to discuss your request</li>
                  <li>Retention of your request for service improvement purposes</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Bidding and Shipping Services</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you use our bidding or shipping services, you consent to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Sharing necessary information with auction houses and carriers</li>
                  <li>Receipt of status updates about your vehicles and shipments</li>
                  <li>Storage of transaction and shipping records</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Support Requests</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you contact support or create a support ticket, you consent to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Collection of information related to your inquiry</li>
                  <li>Storage of conversation history for quality and training purposes</li>
                  <li>Follow-up communications to resolve your issue</li>
                </ul>
              </section>

              <Separator />

              {/* Information Sharing */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Information Sharing with Service Partners</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide our services, we must share certain information with third parties. 
                  By using our services, you consent to this sharing as described below:
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">Auction Houses</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When we bid on your behalf at auctions (such as Copart or IAAI), we share:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Your bidding instructions and maximum bid amounts</li>
                  <li>Contact information for auction account purposes</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Transport Carriers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  For inland transport from auction yards to ports, we share:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Vehicle details (VIN, make, model, year)</li>
                  <li>Pickup and delivery locations</li>
                  <li>Contact information for coordination</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Shipping Lines</h3>
                <p className="text-muted-foreground leading-relaxed">
                  For ocean freight, we share:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Vehicle and cargo details for booking</li>
                  <li>Consignee information for shipping documentation</li>
                  <li>Destination port and contact details</li>
                </ul>

                <p className="text-muted-foreground leading-relaxed mt-4 p-4 bg-muted rounded-lg">
                  <strong>Note:</strong> These partners receive only the information necessary 
                  to perform their specific services. We require partners to handle your 
                  information securely, but their use of your data is subject to their own 
                  privacy policies.
                </p>
              </section>

              <Separator />

              {/* Communication Preferences */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Communication Preferences</h2>
                
                <h3 className="text-lg font-medium mb-2">Service Communications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You will receive communications essential to our services, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Quote responses and pricing information</li>
                  <li>Shipment status updates and milestone notifications</li>
                  <li>Important account alerts and security notices</li>
                  <li>Responses to your support requests</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  These communications are necessary for service delivery and cannot be opted out 
                  while you are an active customer.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-2">Marketing Communications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  With your separate consent, we may send:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Updates about new services or features</li>
                  <li>Special offers or promotions</li>
                  <li>Industry news or tips</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  You can opt out of marketing communications at any time by clicking "unsubscribe" 
                  in any marketing email or by updating your preferences in your account settings.
                </p>
              </section>

              <Separator />

              {/* Data Protection Rights */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Your Data Protection Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In accordance with NDPR and GDPR principles, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Be Informed:</strong> Know how your data is being used (this document 
                    serves that purpose)
                  </li>
                  <li>
                    <strong>Access:</strong> Request a copy of the personal data we hold about you
                  </li>
                  <li>
                    <strong>Rectification:</strong> Request correction of inaccurate data
                  </li>
                  <li>
                    <strong>Erasure:</strong> Request deletion of your data in certain circumstances
                  </li>
                  <li>
                    <strong>Restrict Processing:</strong> Ask us to limit how we use your data
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Receive your data in a standard format
                  </li>
                  <li>
                    <strong>Object:</strong> Object to certain types of processing
                  </li>
                  <li>
                    <strong>Withdraw Consent:</strong> Change your mind about consent previously given
                  </li>
                </ul>
              </section>

              <Separator />

              {/* Withdrawing Consent */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Withdrawing Your Consent</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You may withdraw consent at any time. However, please note:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    Withdrawing consent does not affect the lawfulness of processing before 
                    withdrawal
                  </li>
                  <li>
                    Some services cannot be provided without certain data processing (e.g., we 
                    cannot ship a vehicle without sharing details with carriers)
                  </li>
                  <li>
                    Legal obligations may require us to retain certain information even after 
                    consent is withdrawn
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To withdraw consent or request account closure, please contact us at 
                  privacy@gesodrides.com. We will process your request within 30 days.
                </p>
              </section>

              <Separator />

              {/* Legal Basis */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Legal Basis for Processing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We process your personal data based on:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Consent:</strong> When you actively agree to specific processing 
                    (e.g., marketing emails)
                  </li>
                  <li>
                    <strong>Contract:</strong> When processing is necessary to provide services 
                    you have requested
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> When we must comply with laws or regulations
                  </li>
                  <li>
                    <strong>Legitimate Interest:</strong> When we have a reasonable business 
                    purpose that does not override your rights
                  </li>
                </ul>
              </section>

              <Separator />

              {/* Updates */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Consent & Use of Information policy from time to time. 
                  When we make material changes that require your renewed consent, we will 
                  notify you and seek your agreement before continuing to process your data 
                  under the new terms.
                </p>
              </section>

              <Separator />

              {/* Contact */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Questions About Consent</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this policy or your consent:
                </p>
                <ul className="list-none space-y-1 text-muted-foreground mt-4">
                  <li><strong>Data Protection Officer:</strong> privacy@gesodrides.com</li>
                  <li><strong>General Inquiries:</strong> contact@gesodrides.com</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We are committed to addressing your concerns and ensuring your rights are 
                  respected.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
