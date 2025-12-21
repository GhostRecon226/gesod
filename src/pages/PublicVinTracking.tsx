import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { z } from "zod";
import {
  Search,
  Truck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowLeft,
  Car,
  Info,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import {
  trackVinPublic,
  vinSchema,
  TrackVinResponse,
  PublicVinTrackingResult,
  maskVin,
} from "@/services/publicVinTrackingService";
import { useRateLimiter } from "@/hooks/useRateLimiter";

// Rate limiter config: 10 searches per 5 minutes, max 30 unique VINs per session
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxUniqueItems: 30,
  storageKey: "vin-tracking-rate-limit",
};

// Map database status to StatusBadge status type
function mapStatus(dbStatus: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    pending: "pending",
    active: "active",
    awaiting_action: "awaiting",
    in_progress: "in-progress",
    delayed: "delayed",
    completed: "completed",
    cancelled: "cancelled",
  };
  return statusMap[dbStatus] || "pending";
}

export default function PublicVinTracking() {
  const [vinInput, setVinInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicVinTrackingResult | null>(null);
  
  const rateLimiter = useRateLimiter(RATE_LIMIT_CONFIG);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    setVinInput(value.slice(0, 17));
    setValidationError(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);
    setResult(null);

    // Client-side validation
    const validation = vinSchema.safeParse(vinInput);
    if (!validation.success) {
      setValidationError(validation.error.errors[0]?.message || "Invalid VIN");
      return;
    }

    // Check rate limit before making request
    if (!rateLimiter.checkAndRecord(vinInput)) {
      setError(
        "Too many search requests. Please wait a few minutes before trying again."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await trackVinPublic(vinInput);

      if (!response.success) {
        if (response.error === "not_found") {
          setError("VIN not found. Please check and try again.");
        } else if (response.error === "invalid_format") {
          setValidationError(response.message || "Invalid VIN format.");
        } else {
          setError(response.message || "An error occurred. Please try again.");
        }
      } else if (response.data) {
        setResult(response.data);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              GESOD RIDES
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Track Your Vehicle
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your 17-character VIN to view the current shipment status as recorded by GESOD RIDES
          </p>
        </div>

        {/* Disclaimer Notice */}
        <Card className="mb-6 border-border bg-accent/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium text-foreground">Status-Based Tracking:</span>{" "}
                  This service displays milestone updates as recorded by our operations team. 
                  It does not provide GPS-based location tracking.
                </p>
                <p>
                  Updates are provided by GESOD RIDES based on information received from our 
                  logistics partners. Timelines shown are indicative and may be affected by 
                  customs, weather, port congestion, or other external factors beyond our control.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter VIN (e.g., 1HGBH41JXMN109186)"
                    value={vinInput}
                    onChange={handleInputChange}
                    className="pl-10 font-mono text-lg h-12 uppercase"
                    maxLength={17}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-8"
                  disabled={isLoading || vinInput.length !== 17 || rateLimiter.isRateLimited}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track Vehicle
                    </>
                  )}
                </Button>
              </div>

              {/* Character count */}
              <p className="text-sm text-muted-foreground text-right">
                {vinInput.length}/17 characters
              </p>

              {/* Rate Limit Warning */}
              {rateLimiter.isRateLimited && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    Search temporarily limited. Please wait a few minutes before trying again.
                  </AlertDescription>
                </Alert>
              )}

              {/* Validation Error */}
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Vehicle Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">VIN</p>
                    <p className="font-mono font-medium tracking-wider">
                      {maskVin(result.vin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-medium">
                      {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{result.vehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="capitalize">
                        {result.vehicle.source}
                      </Badge>
                      {result.vehicle.source === "auction" && result.vehicle.auction_source && (
                        <Badge variant="outline" className="uppercase text-xs">
                          {result.vehicle.auction_source}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2">
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={mapStatus(result.current_status)}
                        showIcon
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login CTA */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                Is this your vehicle? Log in to view full details and documents.
              </p>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  Log In
                </Button>
              </Link>
            </div>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.status_history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">
                    No status updates yet.
                  </p>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

                    <div className="space-y-6">
                      {result.status_history.map((update, index) => (
                        <div key={index} className="relative flex gap-4 pl-7">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 top-1 h-[22px] w-[22px] rounded-full border-2 flex items-center justify-center ${
                              index === 0
                                ? "bg-primary border-primary"
                                : "bg-card border-border"
                            }`}
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                index === 0
                                  ? "bg-primary-foreground"
                                  : "bg-muted-foreground"
                              }`}
                            />
                          </div>

                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <StatusBadge
                                status={mapStatus(update.status)}
                                showIcon
                              />
                              <span className="text-sm text-muted-foreground">
                                {format(
                                  new Date(update.date),
                                  "MMM d, yyyy 'at' h:mm a"
                                )}
                              </span>
                            </div>
                            {update.description && (
                              <p className="mt-2 text-sm text-foreground">
                                {update.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Need Help?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you have questions about your shipment, please contact our
                      support team or log in to your customer portal for more details.
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Link to="/auth">
                        <Button variant="outline" size="sm">
                          Customer Login
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="ghost" size="sm">
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initial State Helper */}
        {!result && !error && !isLoading && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Enter a valid 17-character VIN above to view your shipment status
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Your VIN can be found on your vehicle documents or dashboard
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer Disclaimer */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            Status information is provided by GESOD RIDES for informational purposes only. 
            Shipment timelines are estimates and subject to change due to external factors 
            including but not limited to customs processing, weather conditions, and port operations. 
            For detailed inquiries, please contact our support team.
          </p>
        </div>
      </main>
    </div>
  );
}
