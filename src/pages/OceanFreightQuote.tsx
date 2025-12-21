import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { OceanFreightQuoteForm } from "@/components/forms/OceanFreightQuoteForm";

export default function OceanFreightQuote() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="container max-w-3xl py-8 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/quote")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quote Options
        </Button>

        {/* Form Card */}
        <Card>
          <CardContent className="pt-6">
            <OceanFreightQuoteForm
              onCancel={() => navigate("/quote")}
            />
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
