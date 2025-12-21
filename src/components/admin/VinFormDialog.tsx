import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VinRecord, VinStatus, vinStatuses, isValidVin } from "@/services/vinService";
import { VehicleWithCustomer } from "@/services/vehicleService";

const vinSchema = z.object({
  vin: z
    .string()
    .trim()
    .min(17, "VIN must be exactly 17 characters")
    .max(17, "VIN must be exactly 17 characters")
    .refine((val) => isValidVin(val), {
      message: "Invalid VIN format. VIN must be 17 alphanumeric characters (no I, O, Q)",
    }),
  vehicle_id: z.string().min(1, "Please select a vehicle"),
  current_status: z.enum([
    "pending",
    "active",
    "awaiting_action",
    "in_progress",
    "delayed",
    "completed",
    "cancelled",
  ]),
  is_active: z.boolean(),
});

type VinFormData = z.infer<typeof vinSchema>;

interface VinFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vinRecord?: VinRecord | null;
  vehicles: VehicleWithCustomer[];
  onSubmit: (data: VinFormData & { customer_id: string }) => Promise<void>;
  isLoading?: boolean;
}

export function VinFormDialog({
  open,
  onOpenChange,
  vinRecord,
  vehicles,
  onSubmit,
  isLoading,
}: VinFormDialogProps) {
  const isEditing = !!vinRecord;

  const form = useForm<VinFormData>({
    resolver: zodResolver(vinSchema),
    defaultValues: {
      vin: vinRecord?.vin || "",
      vehicle_id: vinRecord?.vehicle_id || "",
      current_status: vinRecord?.current_status || "pending",
      is_active: vinRecord?.is_active ?? true,
    },
  });

  const selectedVehicleId = form.watch("vehicle_id");
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Reset form when vinRecord changes
  useEffect(() => {
    if (vinRecord) {
      form.reset({
        vin: vinRecord.vin,
        vehicle_id: vinRecord.vehicle_id,
        current_status: vinRecord.current_status,
        is_active: vinRecord.is_active,
      });
    } else {
      form.reset({
        vin: "",
        vehicle_id: "",
        current_status: "pending",
        is_active: true,
      });
    }
  }, [vinRecord, form]);

  const handleSubmit = async (data: VinFormData) => {
    // Get customer_id from selected vehicle
    const vehicle = vehicles.find((v) => v.id === data.vehicle_id);
    if (!vehicle) return;

    await onSubmit({
      ...data,
      vin: data.vin.toUpperCase(),
      customer_id: vehicle.customer_id,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit VIN Record" : "Add VIN Record"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the VIN record information below."
              : "Enter the VIN details to create a new tracking record."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    VIN <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1HGBH41JXMN109186"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={17}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    17-character Vehicle Identification Number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vehicle <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.customers?.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVehicle && (
                    <FormDescription>
                      Customer: {selectedVehicle.customers?.full_name} ({selectedVehicle.customers?.email})
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vinStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Tracking</FormLabel>
                    <FormDescription>
                      Enable or disable tracking for this VIN
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update VIN" : "Create VIN"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
