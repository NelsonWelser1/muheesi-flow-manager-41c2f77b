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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      milk_reception: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          payment_status: string | null
          price_per_liter: number | null
          quality_grade: string | null
          session: string
          supplier_name: string | null
          temperature: number | null
          total_amount: number | null
          updated_at: string | null
          volume: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          price_per_liter?: number | null
          quality_grade?: string | null
          session: string
          supplier_name?: string | null
          temperature?: number | null
          total_amount?: number | null
          updated_at?: string | null
          volume: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          price_per_liter?: number | null
          quality_grade?: string | null
          session?: string
          supplier_name?: string | null
          temperature?: number | null
          total_amount?: number | null
          updated_at?: string | null
          volume?: number
        }
        Relationships: []
      }
      milk_reception_quality_metrics: {
        Row: {
          bacteria_count: number | null
          created_at: string | null
          date: string
          fat_content: number | null
          id: string
          lactose_content: number | null
          notes: string | null
          ph_level: number | null
          protein_content: number | null
          quality_score: number | null
          reception_id: string | null
          temperature: number | null
          total_solids: number | null
          updated_at: string | null
          volume: number | null
        }
        Insert: {
          bacteria_count?: number | null
          created_at?: string | null
          date: string
          fat_content?: number | null
          id?: string
          lactose_content?: number | null
          notes?: string | null
          ph_level?: number | null
          protein_content?: number | null
          quality_score?: number | null
          reception_id?: string | null
          temperature?: number | null
          total_solids?: number | null
          updated_at?: string | null
          volume?: number | null
        }
        Update: {
          bacteria_count?: number | null
          created_at?: string | null
          date?: string
          fat_content?: number | null
          id?: string
          lactose_content?: number | null
          notes?: string | null
          ph_level?: number | null
          protein_content?: number | null
          quality_score?: number | null
          reception_id?: string | null
          temperature?: number | null
          total_solids?: number | null
          updated_at?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "milk_reception_quality_metrics_reception_id_fkey"
            columns: ["reception_id"]
            isOneToOne: false
            referencedRelation: "milk_reception"
            referencedColumns: ["id"]
          },
        ]
      }
      milk_tank_offloads: {
        Row: {
          created_at: string | null
          date: string
          destination: string | null
          driver_name: string | null
          id: string
          notes: string | null
          tank_id: string
          temperature: number | null
          updated_at: string | null
          vehicle_number: string | null
          volume: number
        }
        Insert: {
          created_at?: string | null
          date: string
          destination?: string | null
          driver_name?: string | null
          id?: string
          notes?: string | null
          tank_id: string
          temperature?: number | null
          updated_at?: string | null
          vehicle_number?: string | null
          volume: number
        }
        Update: {
          created_at?: string | null
          date?: string
          destination?: string | null
          driver_name?: string | null
          id?: string
          notes?: string | null
          tank_id?: string
          temperature?: number | null
          updated_at?: string | null
          vehicle_number?: string | null
          volume?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_change_audit_log: {
        Row: {
          action_type: string
          affected_user: string
          changed_at: string
          changed_by: string | null
          id: string
          new_company: string
          new_role: string
          notes: string | null
          old_company: string | null
          old_role: string | null
        }
        Insert: {
          action_type: string
          affected_user: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_company: string
          new_role: string
          notes?: string | null
          old_company?: string | null
          old_role?: string | null
        }
        Update: {
          action_type?: string
          affected_user?: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_company?: string
          new_role?: string
          notes?: string | null
          old_company?: string | null
          old_role?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          company: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          company?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          company?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    }
    Enums: {
      app_role:
        | "board_member"
        | "ceo"
        | "ceo_assistant"
        | "sysadmin"
        | "compliance_officer"
        | "risk_manager"
        | "hr_manager"
        | "operations_manager"
        | "procurement_manager"
        | "factory_manager"
        | "finance_manager"
        | "sales_manager"
        | "logistics_manager"
        | "inventory_manager"
        | "marketing_manager"
        | "it_manager"
        | "product_manager"
        | "warehouse_supervisor"
        | "association_manager"
        | "farm_manager"
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
      app_role: [
        "board_member",
        "ceo",
        "ceo_assistant",
        "sysadmin",
        "compliance_officer",
        "risk_manager",
        "hr_manager",
        "operations_manager",
        "procurement_manager",
        "factory_manager",
        "finance_manager",
        "sales_manager",
        "logistics_manager",
        "inventory_manager",
        "marketing_manager",
        "it_manager",
        "product_manager",
        "warehouse_supervisor",
        "association_manager",
        "farm_manager",
      ],
    },
  },
} as const
