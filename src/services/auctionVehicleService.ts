import { supabase } from "@/integrations/supabase/client";

export type VehicleType = "car" | "suv" | "truck";
export type AuctionSource = "copart" | "iaai" | "other";
export type AuctionVehicleStatus = "active" | "expired";

export interface AuctionVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  auction_source: AuctionSource;
  lot_number: string;
  auction_date: string | null;
  yard_location: string | null;
  vehicle_images: string[] | null;
  remarks: string | null;
  status: AuctionVehicleStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateAuctionVehicleData {
  make: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  auction_source: AuctionSource;
  lot_number: string;
  auction_date?: string | null;
  yard_location?: string | null;
  vehicle_images?: string[] | null;
  remarks?: string | null;
}

export interface UpdateAuctionVehicleData {
  make?: string;
  model?: string;
  year?: number;
  vehicle_type?: VehicleType;
  auction_source?: AuctionSource;
  lot_number?: string;
  auction_date?: string | null;
  yard_location?: string | null;
  vehicle_images?: string[] | null;
  remarks?: string | null;
  status?: AuctionVehicleStatus;
}

// Upload auction vehicle images to storage
export async function uploadAuctionImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('auction-images')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('auction-images')
      .getPublicUrl(filePath);
    
    urls.push(publicUrl);
  }
  
  return urls;
}

// Delete auction vehicle images from storage
export async function deleteAuctionImages(urls: string[]): Promise<void> {
  const paths = urls.map(url => {
    const parts = url.split('/auction-images/');
    return parts[1] || '';
  }).filter(Boolean);
  
  if (paths.length > 0) {
    const { error } = await supabase.storage
      .from('auction-images')
      .remove(paths);
    
    if (error) throw error;
  }
}

// Fetch all auction vehicles (admin only)
export async function fetchAuctionVehicles() {
  const { data, error } = await supabase
    .from("auction_vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as AuctionVehicle[];
}

// Fetch active auction vehicles (public access)
export async function fetchActiveAuctionVehicles() {
  const { data, error } = await supabase
    .from("auction_vehicles")
    .select("*")
    .eq("status", "active")
    .order("auction_date", { ascending: true });

  if (error) throw error;
  return data as AuctionVehicle[];
}

// Fetch single auction vehicle by ID
export async function fetchAuctionVehicleById(id: string) {
  const { data, error } = await supabase
    .from("auction_vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as AuctionVehicle;
}

// Create a new auction vehicle (admin only)
export async function createAuctionVehicle(data: CreateAuctionVehicleData) {
  const { data: vehicle, error } = await supabase
    .from("auction_vehicles")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return vehicle as AuctionVehicle;
}

// Update an auction vehicle (admin only)
export async function updateAuctionVehicle(id: string, updates: UpdateAuctionVehicleData) {
  const { data, error } = await supabase
    .from("auction_vehicles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as AuctionVehicle;
}

// Delete an auction vehicle (admin only)
export async function deleteAuctionVehicle(id: string) {
  const { error } = await supabase
    .from("auction_vehicles")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Helper constants for dropdowns
export const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: "car", label: "Car" },
  { value: "suv", label: "SUV" },
  { value: "truck", label: "Truck" },
];

export const auctionSources: { value: AuctionSource; label: string }[] = [
  { value: "copart", label: "Copart" },
  { value: "iaai", label: "IAAI" },
  { value: "other", label: "Other" },
];

export const auctionVehicleStatuses: { value: AuctionVehicleStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];
