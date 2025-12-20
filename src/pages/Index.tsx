import { Truck, Package, Users, DollarSign, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const recentShipments = [
  {
    id: "SHP-001",
    vehicle: "2024 Toyota Land Cruiser",
    origin: "Tokyo, Japan",
    destination: "Lagos, Nigeria",
    status: "in-transit" as const,
    eta: "Dec 28, 2025",
  },
  {
    id: "SHP-002",
    vehicle: "2023 Mercedes-Benz G63",
    origin: "Stuttgart, Germany",
    destination: "Accra, Ghana",
    status: "pending" as const,
    eta: "Jan 05, 2026",
  },
  {
    id: "SHP-003",
    vehicle: "2024 Range Rover Sport",
    origin: "Birmingham, UK",
    destination: "Nairobi, Kenya",
    status: "delivered" as const,
    eta: "Dec 15, 2025",
  },
  {
    id: "SHP-004",
    vehicle: "2023 BMW X7",
    origin: "Munich, Germany",
    destination: "Johannesburg, SA",
    status: "delayed" as const,
    eta: "Dec 30, 2025",
  },
  {
    id: "SHP-005",
    vehicle: "2024 Lexus LX 600",
    origin: "Nagoya, Japan",
    destination: "Abuja, Nigeria",
    status: "completed" as const,
    eta: "Dec 10, 2025",
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock },
  "in-transit": { label: "In Transit", icon: Truck },
  delivered: { label: "Delivered", icon: CheckCircle2 },
  delayed: { label: "Delayed", icon: AlertCircle },
  completed: { label: "Completed", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", icon: XCircle },
};

export default function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back. Here's an overview of your logistics operations.
          </p>
        </div>

        {/* Alert */}
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            2 shipments are experiencing delays due to port congestion. Review affected shipments.
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Vehicles"
            value="1,284"
            change="+12% from last month"
            changeType="positive"
            icon={Truck}
          />
          <StatCard
            title="Active Shipments"
            value="47"
            change="8 arriving this week"
            changeType="neutral"
            icon={Package}
          />
          <StatCard
            title="Total Customers"
            value="892"
            change="+5% from last month"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Monthly Revenue"
            value="$2.4M"
            change="-3% from last month"
            changeType="negative"
            icon={DollarSign}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Shipments Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>
                  Track your latest vehicle imports and exports
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentShipments.map((shipment) => {
                    const status = statusConfig[shipment.status];
                    return (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">
                          {shipment.id}
                        </TableCell>
                        <TableCell>{shipment.vehicle}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {shipment.origin} → {shipment.destination}
                        </TableCell>
                        <TableCell>
                          <Badge variant={shipment.status}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {shipment.eta}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Add New Vehicle
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Create Shipment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Design System Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Design System Components</CardTitle>
            <CardDescription>
              A preview of the GESOD RIDES design system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Danger</Button>
                <Button variant="success">Success</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            {/* Status Badges */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Status Badges</h4>
              <div className="flex flex-wrap gap-3">
                <Badge variant="pending">Pending</Badge>
                <Badge variant="active">Active</Badge>
                <Badge variant="in-transit">In Transit</Badge>
                <Badge variant="completed">Completed</Badge>
                <Badge variant="delivered">Delivered</Badge>
                <Badge variant="delayed">Delayed</Badge>
                <Badge variant="cancelled">Cancelled</Badge>
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Alerts</h4>
              <div className="space-y-3">
                <Alert variant="info">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is an informational alert message.
                  </AlertDescription>
                </Alert>
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Operation completed successfully.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
