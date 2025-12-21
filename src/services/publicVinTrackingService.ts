import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// VIN validation schema
export const vinSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(17, { message: "VIN must be exactly 17 characters" })
  .regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: "VIN contains invalid characters. Letters I, O, and Q are not allowed.",
  });

export type VinStatus =
  | "pending"
  | "active"
  | "awaiting_action"
  | "in_progress"
  | "delayed"
  | "completed"
  | "cancelled";

export interface PublicVinStatusUpdate {
  status: VinStatus;
  description: string | null;
  date: string;
}

export interface PublicVinTrackingResult {
  vin: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    type: string;
  };
  current_status: VinStatus;
  is_active: boolean;
  status_history: PublicVinStatusUpdate[];
}

export interface TrackVinResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: PublicVinTrackingResult;
}

// Track a VIN publicly (no authentication required)
export async function trackVinPublic(vin: string): Promise<TrackVinResponse> {
  // Validate VIN format first
  const validation = vinSchema.safeParse(vin);
  if (!validation.success) {
    return {
      success: false,
      error: "invalid_format",
      message: validation.error.errors[0]?.message || "Invalid VIN format.",
    };
  }

  // Call the secure database function
  const { data, error } = await supabase.rpc("track_vin_public", {
    p_vin: validation.data,
  });

  if (error) {
    console.error("VIN tracking error:", error);
    return {
      success: false,
      error: "server_error",
      message: "An error occurred. Please try again later.",
    };
  }

  return data as unknown as TrackVinResponse;
}
