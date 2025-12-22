export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          related_type: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      bid_requests: {
        Row: {
          admin_notes: string | null
          auction_vehicle_reference: string
          created_at: string
          customer_id: string
          destination_country: string
          destination_port: string
          id: string
          max_bid_amount: number
          request_status: Database["public"]["Enums"]["bid_request_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          auction_vehicle_reference: string
          created_at?: string
          customer_id: string
          destination_country: string
          destination_port: string
          id?: string
          max_bid_amount: number
          request_status?: Database["public"]["Enums"]["bid_request_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          auction_vehicle_reference?: string
          created_at?: string
          customer_id?: string
          destination_country?: string
          destination_port?: string
          id?: string
          max_bid_amount?: number
          request_status?: Database["public"]["Enums"]["bid_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bid_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          uploaded_by: string
          vin_record_id: string
        }
        Insert: {
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_by: string
          vin_record_id: string
        }
        Update: {
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_by?: string
          vin_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_vin_record_id_fkey"
            columns: ["vin_record_id"]
            isOneToOne: false
            referencedRelation: "vin_records"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          related_type: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      public_quote_requests: {
        Row: {
          admin_notes: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          currency: string | null
          customer_id: string | null
          destination_location: string
          id: string
          origin_location: string
          quote_amount: number | null
          quote_status: Database["public"]["Enums"]["quote_status"]
          quote_type: Database["public"]["Enums"]["quote_type"]
          updated_at: string
          valid_until: string | null
          vehicle_details: string
        }
        Insert: {
          admin_notes?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          destination_location: string
          id?: string
          origin_location: string
          quote_amount?: number | null
          quote_status?: Database["public"]["Enums"]["quote_status"]
          quote_type: Database["public"]["Enums"]["quote_type"]
          updated_at?: string
          valid_until?: string | null
          vehicle_details: string
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          destination_location?: string
          id?: string
          origin_location?: string
          quote_amount?: number | null
          quote_status?: Database["public"]["Enums"]["quote_status"]
          quote_type?: Database["public"]["Enums"]["quote_type"]
          updated_at?: string
          valid_until?: string | null
          vehicle_details?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_quote_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          created_at: string
          customer_id: string
          destination_location: string
          id: string
          origin_location: string
          quote_amount: number | null
          quote_status: Database["public"]["Enums"]["quote_status"]
          quote_type: Database["public"]["Enums"]["quote_type"]
          updated_at: string
          valid_until: string | null
          vehicle_details: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          destination_location: string
          id?: string
          origin_location: string
          quote_amount?: number | null
          quote_status?: Database["public"]["Enums"]["quote_status"]
          quote_type: Database["public"]["Enums"]["quote_type"]
          updated_at?: string
          valid_until?: string | null
          vehicle_details: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          destination_location?: string
          id?: string
          origin_location?: string
          quote_amount?: number | null
          quote_status?: Database["public"]["Enums"]["quote_status"]
          quote_type?: Database["public"]["Enums"]["quote_type"]
          updated_at?: string
          valid_until?: string | null
          vehicle_details?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          auction_source: Database["public"]["Enums"]["auction_source"] | null
          created_at: string
          customer_id: string
          id: string
          lot_number: string | null
          make: string
          model: string
          source: Database["public"]["Enums"]["vehicle_source"]
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number
        }
        Insert: {
          auction_source?: Database["public"]["Enums"]["auction_source"] | null
          created_at?: string
          customer_id: string
          id?: string
          lot_number?: string | null
          make: string
          model: string
          source: Database["public"]["Enums"]["vehicle_source"]
          updated_at?: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number
        }
        Update: {
          auction_source?: Database["public"]["Enums"]["auction_source"] | null
          created_at?: string
          customer_id?: string
          id?: string
          lot_number?: string | null
          make?: string
          model?: string
          source?: Database["public"]["Enums"]["vehicle_source"]
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      vin_records: {
        Row: {
          created_at: string
          current_status: Database["public"]["Enums"]["vin_status"]
          customer_id: string
          id: string
          is_active: boolean
          updated_at: string
          vehicle_id: string
          vin: string
        }
        Insert: {
          created_at?: string
          current_status?: Database["public"]["Enums"]["vin_status"]
          customer_id: string
          id?: string
          is_active?: boolean
          updated_at?: string
          vehicle_id: string
          vin: string
        }
        Update: {
          created_at?: string
          current_status?: Database["public"]["Enums"]["vin_status"]
          customer_id?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          vehicle_id?: string
          vin?: string
        }
        Relationships: [
          {
            foreignKeyName: "vin_records_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vin_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vin_status_updates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["vin_status"]
          updated_by: string
          vin_record_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status: Database["public"]["Enums"]["vin_status"]
          updated_by: string
          vin_record_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["vin_status"]
          updated_by?: string
          vin_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vin_status_updates_vin_record_id_fkey"
            columns: ["vin_record_id"]
            isOneToOne: false
            referencedRelation: "vin_records"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access: { Args: { _user_id: string }; Returns: boolean }
      create_public_quote_request:
        | {
            Args: {
              p_contact_email: string
              p_contact_name: string
              p_contact_phone: string
              p_destination_location: string
              p_origin_location: string
              p_quote_type: Database["public"]["Enums"]["quote_type"]
              p_vehicle_details: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_contact_email: string
              p_contact_name: string
              p_contact_phone: string
              p_customer_id?: string
              p_destination_location: string
              p_origin_location: string
              p_quote_type: Database["public"]["Enums"]["quote_type"]
              p_vehicle_details: string
            }
            Returns: Json
          }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_owner: { Args: { _user_id: string }; Returns: boolean }
      track_vin_public: { Args: { p_vin: string }; Returns: Json }
    }
    Enums: {
      account_status: "active" | "suspended"
      app_role: "admin" | "customer"
      auction_source: "copart" | "iaai" | "other"
      bid_request_status: "pending" | "approved" | "rejected" | "won" | "lost"
      document_type: "invoice" | "bill_of_lading" | "photo" | "other"
      quote_status: "pending" | "issued" | "expired" | "accepted"
      quote_type: "ocean_freight" | "inland_freight"
      vehicle_source: "auction" | "direct"
      vehicle_type: "car" | "suv" | "truck"
      vin_status:
        | "pending"
        | "active"
        | "awaiting_action"
        | "in_progress"
        | "delayed"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "suspended"],
      app_role: ["admin", "customer"],
      auction_source: ["copart", "iaai", "other"],
      bid_request_status: ["pending", "approved", "rejected", "won", "lost"],
      document_type: ["invoice", "bill_of_lading", "photo", "other"],
      quote_status: ["pending", "issued", "expired", "accepted"],
      quote_type: ["ocean_freight", "inland_freight"],
      vehicle_source: ["auction", "direct"],
      vehicle_type: ["car", "suv", "truck"],
      vin_status: [
        "pending",
        "active",
        "awaiting_action",
        "in_progress",
        "delayed",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
