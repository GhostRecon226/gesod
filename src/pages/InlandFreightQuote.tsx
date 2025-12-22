import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { InlandFreightQuoteForm } from "@/components/forms/InlandFreightQuoteForm";

export default function InlandFreightQuote() {
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
            <InlandFreightQuoteForm
              onCancel={() => navigate("/quote")}
            />
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
