import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  ArrowLeft,
  Ship,
  Car,
  ArrowRight,
  Info,
  FileQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type QuoteType = "ocean_freight" | "inland_freight" | null;

export default function PublicQuote() {
  const [selectedType, setSelectedType] = useState<QuoteType>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedType === "ocean_freight") {
      navigate("/quote/ocean-freight");
    } else if (selectedType === "inland_freight") {
      navigate("/quote/inland-freight");
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
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
            <FileQuestion className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Get a Quote
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the type of service you need and we will provide you with an estimated quote for your vehicle shipping needs.
          </p>
        </div>

        {/* Quote Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Service Type</CardTitle>
            <CardDescription>
              Choose the type of freight service you require
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedType || ""}
              onValueChange={(value) => setSelectedType(value as QuoteType)}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Ocean Freight Option */}
              <div>
                <RadioGroupItem
                  value="ocean_freight"
                  id="ocean_freight"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="ocean_freight"
                  className="flex flex-col h-full cursor-pointer rounded-lg border-2 border-border bg-card p-6 hover:bg-accent/50 hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Ship className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-semibold text-foreground">Ocean Freight (RORO)</div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Roll-on/Roll-off shipping for vehicles from international ports. 
                    Ideal for importing vehicles from the USA, Europe, Japan, and other regions 
                    to destinations in Africa.
                  </p>
                  <ul className="mt-4 text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      Port-to-port vehicle shipping
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      Suitable for cars, SUVs, and trucks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      Typical transit: 4-8 weeks
                    </li>
                  </ul>
                </Label>
              </div>

              {/* Inland Freight Option */}
              <div>
                <RadioGroupItem
                  value="inland_freight"
                  id="inland_freight"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="inland_freight"
                  className="flex flex-col h-full cursor-pointer rounded-lg border-2 border-border bg-card p-6 hover:bg-accent/50 hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-semibold text-foreground">Inland Freight (Vehicle Towing)</div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Domestic vehicle transport and towing services. 
                    Move your vehicle from auction yards, ports, or any location 
                    to your desired destination.
                  </p>
                  <ul className="mt-4 text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      Door-to-door vehicle transport
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      Auction pickup and delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      Typical transit: 1-7 days
                    </li>
                  </ul>
                </Label>
              </div>
            </RadioGroup>

            {/* Continue Button */}
            <div className="mt-6 flex justify-end">
              <Button
                size="lg"
                disabled={!selectedType}
                onClick={handleContinue}
              >
                Continue to Quote Form
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-border bg-accent/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium text-foreground">Important Notice:</span>{" "}
                  Quotes provided through this service are estimates and subject to final confirmation 
                  based on vehicle specifications, current shipping schedules, and market conditions.
                </p>
                <p>
                  Final pricing will be confirmed by our team after reviewing your request details. 
                  Additional charges may apply for oversized vehicles or special handling requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Already a customer? */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth" className="text-primary hover:underline font-medium">
              Log in
            </Link>{" "}
            to access your quotes and track requests.
          </p>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            GESOD RIDES provides vehicle logistics services including international shipping and domestic transport. 
            All quotes are estimates and subject to change. For urgent inquiries, please contact our support team.
          </p>
        </div>
      </main>
    </div>
  );
}
