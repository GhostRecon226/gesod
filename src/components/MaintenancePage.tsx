import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export function MaintenancePage() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center">
          <Construction className="h-10 w-10 text-warning" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Under Maintenance
          </h1>
          <p className="text-muted-foreground">
            We're currently performing scheduled maintenance to improve our services. 
            We'll be back shortly. Thank you for your patience.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Expected downtime: Less than 1 hour
          </p>
          
          {isAdmin && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                You're logged in as an admin. You can bypass maintenance mode.
              </p>
              <Button asChild variant="default">
                <Link to="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to Admin Dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
