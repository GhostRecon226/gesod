import { useEffect, useState, useRef } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import {
  AuctionVehicle,
  VehicleType,
  AuctionSource,
  vehicleTypes,
  auctionSources,
  uploadAuctionImages,
} from "@/services/auctionVehicleService";

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 2),
  vehicle_type: z.enum(["car", "suv", "truck"] as const),
  auction_source: z.enum(["copart", "iaai", "other"] as const),
  lot_number: z.string().min(1, "Lot number is required"),
  auction_date: z.string().optional().nullable(),
  yard_location: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

export interface AuctionVehicleFormData extends FormData {
  vehicle_images?: string[] | null;
}

interface AuctionVehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: AuctionVehicle | null;
  onSubmit: (data: AuctionVehicleFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AuctionVehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
  onSubmit,
  isLoading,
}: AuctionVehicleFormDialogProps) {
  const isEditing = !!vehicle;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      vehicle_type: "car" as VehicleType,
      auction_source: "copart" as AuctionSource,
      lot_number: "",
      auction_date: null,
      yard_location: null,
      remarks: null,
    },
  });

  useEffect(() => {
    if (vehicle) {
      form.reset({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vehicle_type: vehicle.vehicle_type,
        auction_source: vehicle.auction_source,
        lot_number: vehicle.lot_number,
        auction_date: vehicle.auction_date || null,
        yard_location: vehicle.yard_location || null,
        remarks: vehicle.remarks || null,
      });
      setExistingImages(vehicle.vehicle_images || []);
    } else {
      form.reset({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vehicle_type: "car",
        auction_source: "copart",
        lot_number: "",
        auction_date: null,
        yard_location: null,
        remarks: null,
      });
      setExistingImages([]);
    }
    setNewFiles([]);
    setPreviewUrls([]);
  }, [vehicle, form, open]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setNewFiles(prev => [...prev, ...files]);
    
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: FormData) => {
    try {
      setIsUploading(true);
      
      // Upload new files if any
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        uploadedUrls = await uploadAuctionImages(newFiles);
      }
      
      // Combine existing and new image URLs
      const allImages = [...existingImages, ...uploadedUrls];
      
      await onSubmit({
        ...data,
        vehicle_images: allImages.length > 0 ? allImages : null,
      });
      
      onOpenChange(false);
    } finally {
      setIsUploading(false);
    }
  };

  const totalImages = existingImages.length + newFiles.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Auction Listing" : "New Auction Listing"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the auction vehicle listing details."
              : "Add a new auction vehicle listing."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Camry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="auction_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auction Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {auctionSources.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
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
                name="lot_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Number</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="auction_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auction Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yard_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yard Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Los Angeles, CA"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Remarks Field */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this vehicle..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <div className="space-y-3">
              <FormLabel>Vehicle Photos</FormLabel>
              
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload photos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB each
                </p>
              </div>

              {/* Image Previews */}
              {totalImages > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {/* Existing Images */}
                  {existingImages.map((url, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative aspect-square rounded-md overflow-hidden bg-muted group"
                    >
                      <img
                        src={url}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* New Image Previews */}
                  {previewUrls.map((url, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative aspect-square rounded-md overflow-hidden bg-muted group"
                    >
                      <img
                        src={url}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalImages === 0 && (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">No photos added yet</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isUploading}>
                {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
