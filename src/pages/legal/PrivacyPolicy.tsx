import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      <div className="page-container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6 md:p-8 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Our Commitment to Your Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At GESOD RIDES, we take your privacy seriously. This Privacy Policy explains how we 
                  collect, use, store, and protect your personal information when you use our vehicle 
                  logistics platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to handling your data responsibly and in compliance with data 
                  protection principles, including those outlined in the Nigeria Data Protection 
                  Regulation (NDPR) and the General Data Protection Regulation (GDPR) where applicable.
                </p>
              </section>

              <Separator />

              {/* Information We Collect */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
                
                <h3 className="text-lg font-medium mb-2">Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Account Information:</strong> Name, email address, phone number, and 
                    country when you create an account
                  </li>
                  <li>
                    <strong>Shipping Details:</strong> Destination addresses, port preferences, 
                    and delivery instructions
                  </li>
                  <li>
                    <strong>Vehicle Information:</strong> VIN numbers, make, model, year, and 
                    specifications for vehicles you are shipping
                  </li>
                  <li>
                    <strong>Communication Records:</strong> Messages, support tickets, and 
                    correspondence with our team
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Billing details processed securely 
                    through our payment partners
                  </li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-2">Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Usage Data:</strong> Pages visited, features used, and time spent 
                    on our platform
                  </li>
                  <li>
                    <strong>Device Information:</strong> Browser type, operating system, and 
                    device identifiers
                  </li>
                  <li>
                    <strong>Log Data:</strong> IP addresses, access times, and error logs for 
                    security and troubleshooting
                  </li>
                </ul>
              </section>

              <Separator />

              {/* How We Use Information */}
              <section>
                <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use your information only for legitimate business purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Service Delivery:</strong> To coordinate vehicle auctions, transport, 
                    and shipping on your behalf
                  </li>
                  <li>
                    <strong>Communication:</strong> To send you status updates, notifications, 
                    and respond to your inquiries
                  </li>
                  <li>
                    <strong>Account Management:</strong> To maintain your account and provide 
                    customer support
                  </li>
                  <li>
                    <strong>Billing:</strong> To process payments and send invoices
                  </li>
                  <li>
                    <strong>Improvement:</strong> To analyze usage patterns and improve our 
                    platform and services
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> To meet regulatory requirements and 
                    respond to legal requests
                  </li>
                </ul>
              </section>

              <Separator />

              {/* Data Sharing */}
              <section>
                <h2 className="text-xl font-semibold mb-4">When We Share Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell your personal information. We may share your data only in these 
                  situations:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Service Partners:</strong> With auction houses, transport carriers, 
                    and shipping lines to complete your shipments. These partners receive only 
                    the information necessary for their services.
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> With secure payment service providers 
                    to process transactions
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law, court order, or 
                    government regulation
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, 
                    or sale of assets, with appropriate confidentiality protections
                  </li>
                </ul>
              </section>

              <Separator />

              {/* Data Security */}
              <section>
                <h2 className="text-xl font-semibold mb-4">How We Protect Your Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your 
                  personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Encrypted data transmission using industry-standard protocols (HTTPS/TLS)</li>
                  <li>Secure database storage with access controls</li>
                  <li>Regular security assessments and updates</li>
                  <li>Staff training on data protection practices</li>
                  <li>Incident response procedures for potential breaches</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  While we take reasonable precautions, no internet transmission is completely 
                  secure. We encourage you to protect your account credentials and notify us 
                  of any suspicious activity.
                </p>
              </section>

              <Separator />

              {/* Data Retention */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to provide our 
                  services and comply with legal obligations:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Active Accounts:</strong> Information is retained while your account 
                    is active
                  </li>
                  <li>
                    <strong>Transaction Records:</strong> Kept for 7 years for accounting and 
                    legal compliance
                  </li>
                  <li>
                    <strong>Communication Logs:</strong> Retained for 3 years for service 
                    quality and dispute resolution
                  </li>
                  <li>
                    <strong>Closed Accounts:</strong> Most data is deleted within 90 days, 
                    except where retention is legally required
                  </li>
                </ul>
              </section>

              <Separator />

              {/* Your Rights */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal data we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Ask us to update or correct inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your data, subject to legal 
                    retention requirements
                  </li>
                  <li>
                    <strong>Restriction:</strong> Ask us to limit how we use your data in 
                    certain circumstances
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a commonly used format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain types of processing, including 
                    direct marketing
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us using the details below. We will 
                  respond to your request within 30 days.
                </p>
              </section>

              <Separator />

              {/* Cookies */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to improve your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the platform to function 
                    (login, security, preferences)
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how visitors use 
                    our platform
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You can control cookies through your browser settings. Disabling essential 
                  cookies may affect platform functionality.
                </p>
              </section>

              <Separator />

              {/* Children */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for individuals under 18 years of age. We do 
                  not knowingly collect personal information from children. If you believe a 
                  child has provided us with personal data, please contact us so we can remove it.
                </p>
              </section>

              <Separator />

              {/* Updates */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy periodically. When we make significant 
                  changes, we will notify you via email or through a notice on our platform. 
                  The "Last updated" date at the top indicates when this policy was last revised.
                </p>
              </section>

              <Separator />

              {/* Contact */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Contact Our Privacy Team</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions, concerns, or requests regarding your privacy:
                </p>
                <ul className="list-none space-y-1 text-muted-foreground mt-4">
                  <li><strong>Email:</strong> privacy@gesodrides.com</li>
                  <li><strong>General Contact:</strong> contact@gesodrides.com</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We aim to resolve any concerns directly. If you are not satisfied with our 
                  response, you may have the right to lodge a complaint with your local data 
                  protection authority.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
