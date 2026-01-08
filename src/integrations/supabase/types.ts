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
      advertising_promotions: {
        Row: {
          assets_urls: Json | null
          budget: string | null
          channels: Json | null
          created_at: string | null
          created_by: string | null
          end_date: string | null
          id: string
          material_type: string
          objectives: string | null
          promotion_id: string
          promotion_type: string
          start_date: string | null
          status: string | null
          target_audience: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assets_urls?: Json | null
          budget?: string | null
          channels?: Json | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          material_type: string
          objectives?: string | null
          promotion_id: string
          promotion_type: string
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assets_urls?: Json | null
          budget?: string | null
          channels?: Json | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          material_type?: string
          objectives?: string | null
          promotion_id?: string
          promotion_type?: string
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      aging_room_records: {
        Row: {
          aging_duration: number
          cheese_type: string
          created_at: string | null
          humidity: number
          id: string
          notes: string | null
          occupancy: number
          recorded_by: string
          room_id: string
          temperature: number
          updated_at: string | null
        }
        Insert: {
          aging_duration: number
          cheese_type: string
          created_at?: string | null
          humidity: number
          id?: string
          notes?: string | null
          occupancy: number
          recorded_by: string
          room_id: string
          temperature: number
          updated_at?: string | null
        }
        Update: {
          aging_duration?: number
          cheese_type?: string
          created_at?: string | null
          humidity?: number
          id?: string
          notes?: string | null
          occupancy?: number
          recorded_by?: string
          room_id?: string
          temperature?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      association_certifications: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          name: string
          notes: string | null
          progress: number | null
          requirements: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          name: string
          notes?: string | null
          progress?: number | null
          requirements?: Json
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          name?: string
          notes?: string | null
          progress?: number | null
          requirements?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      association_members: {
        Row: {
          association_id: string | null
          coffee_type: string | null
          created_at: string | null
          experience: number | null
          farm_size: number | null
          full_name: string
          id: string
          join_date: string | null
          last_delivery: string | null
          location: string | null
          member_level: string | null
          phone: string | null
          photo_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          association_id?: string | null
          coffee_type?: string | null
          created_at?: string | null
          experience?: number | null
          farm_size?: number | null
          full_name: string
          id?: string
          join_date?: string | null
          last_delivery?: string | null
          location?: string | null
          member_level?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          association_id?: string | null
          coffee_type?: string | null
          created_at?: string | null
          experience?: number | null
          farm_size?: number | null
          full_name?: string
          id?: string
          join_date?: string | null
          last_delivery?: string | null
          location?: string | null
          member_level?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_members_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      association_messages: {
        Row: {
          association_id: string | null
          created_at: string
          delivery_status: string | null
          id: string
          message: string
          read_status: boolean | null
          recipients: string
          response_data: Json | null
          scheduled_date: string | null
          sent_by: string | null
          sent_date: string | null
          status: string
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          association_id?: string | null
          created_at?: string
          delivery_status?: string | null
          id?: string
          message: string
          read_status?: boolean | null
          recipients: string
          response_data?: Json | null
          scheduled_date?: string | null
          sent_by?: string | null
          sent_date?: string | null
          status: string
          subject: string
          type: string
          updated_at?: string
        }
        Update: {
          association_id?: string | null
          created_at?: string
          delivery_status?: string | null
          id?: string
          message?: string
          read_status?: boolean | null
          recipients?: string
          response_data?: Json | null
          scheduled_date?: string | null
          sent_by?: string | null
          sent_date?: string | null
          status?: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "association_messages_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      association_operations: {
        Row: {
          association_id: string | null
          collective_resources: string | null
          created_at: string | null
          id: string
          next_meeting_date: string | null
          shared_equipment: string | null
          status: string | null
          training_schedule: string | null
          updated_at: string | null
        }
        Insert: {
          association_id?: string | null
          collective_resources?: string | null
          created_at?: string | null
          id?: string
          next_meeting_date?: string | null
          shared_equipment?: string | null
          status?: string | null
          training_schedule?: string | null
          updated_at?: string | null
        }
        Update: {
          association_id?: string | null
          collective_resources?: string | null
          created_at?: string | null
          id?: string
          next_meeting_date?: string | null
          shared_equipment?: string | null
          status?: string | null
          training_schedule?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_operations_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      association_trainings: {
        Row: {
          association_id: string | null
          category: string
          created_at: string | null
          date: string
          description: string | null
          enrolled_members: number | null
          id: string
          location: string
          max_members: number
          notes: string | null
          status: string | null
          time: string
          title: string
          trainer: string
          updated_at: string | null
        }
        Insert: {
          association_id?: string | null
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          enrolled_members?: number | null
          id?: string
          location: string
          max_members: number
          notes?: string | null
          status?: string | null
          time: string
          title: string
          trainer: string
          updated_at?: string | null
        }
        Update: {
          association_id?: string | null
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          enrolled_members?: number | null
          id?: string
          location?: string
          max_members?: number
          notes?: string | null
          status?: string | null
          time?: string
          title?: string
          trainer?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_trainings_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      associations: {
        Row: {
          association_name: string
          association_type: string | null
          coffee_types: string | null
          created_at: string | null
          id: string
          member_count: number | null
          registration_number: string | null
          total_farm_area: number | null
          updated_at: string | null
        }
        Insert: {
          association_name: string
          association_type?: string | null
          coffee_types?: string | null
          created_at?: string | null
          id?: string
          member_count?: number | null
          registration_number?: string | null
          total_farm_area?: number | null
          updated_at?: string | null
        }
        Update: {
          association_name?: string
          association_type?: string | null
          coffee_types?: string | null
          created_at?: string | null
          id?: string
          member_count?: number | null
          registration_number?: string | null
          total_farm_area?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bills_expenses: {
        Row: {
          amount: number
          bill_date: string
          bill_number: string
          created_at: string | null
          currency: string
          due_date: string
          expense_details: string | null
          expense_type: string
          id: string
          is_recurring: boolean | null
          notes: string | null
          payment_method: string
          receipt_url: string | null
          recurring_end_date: string | null
          recurring_frequency: string | null
          status: string
          supplier_name: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bill_date: string
          bill_number: string
          created_at?: string | null
          currency?: string
          due_date: string
          expense_details?: string | null
          expense_type: string
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_method: string
          receipt_url?: string | null
          recurring_end_date?: string | null
          recurring_frequency?: string | null
          status: string
          supplier_name: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bill_date?: string
          bill_number?: string
          created_at?: string | null
          currency?: string
          due_date?: string
          expense_details?: string | null
          expense_type?: string
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_method?: string
          receipt_url?: string | null
          recurring_end_date?: string | null
          recurring_frequency?: string | null
          status?: string
          supplier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bull_fattening_program: {
        Row: {
          created_at: string | null
          death_reasons: string | null
          id: string
          manager_name: string
          num_bulls: number
          num_calves: number
          num_heifers: number
          num_mothers: number
          recorded_deaths: number
        }
        Insert: {
          created_at?: string | null
          death_reasons?: string | null
          id?: string
          manager_name: string
          num_bulls: number
          num_calves: number
          num_heifers: number
          num_mothers: number
          recorded_deaths?: number
        }
        Update: {
          created_at?: string | null
          death_reasons?: string | null
          id?: string
          manager_name?: string
          num_bulls?: number
          num_calves?: number
          num_heifers?: number
          num_mothers?: number
          recorded_deaths?: number
        }
        Relationships: []
      }
      cattle_fattening: {
        Row: {
          batch_id: string | null
          breed: string
          cattle_type: string
          created_at: string | null
          current_weight: number
          daily_gain: number | null
          date_of_birth: string | null
          entry_date: string
          entry_weight: number
          expected_completion_date: string | null
          farm_id: string
          feeding_regime: string
          id: string
          name: string | null
          notes: string | null
          status: string
          tag_number: string
          target_weight: number
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          breed: string
          cattle_type: string
          created_at?: string | null
          current_weight: number
          daily_gain?: number | null
          date_of_birth?: string | null
          entry_date: string
          entry_weight: number
          expected_completion_date?: string | null
          farm_id: string
          feeding_regime?: string
          id?: string
          name?: string | null
          notes?: string | null
          status?: string
          tag_number: string
          target_weight: number
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          breed?: string
          cattle_type?: string
          created_at?: string | null
          current_weight?: number
          daily_gain?: number | null
          date_of_birth?: string | null
          entry_date?: string
          entry_weight?: number
          expected_completion_date?: string | null
          farm_id?: string
          feeding_regime?: string
          id?: string
          name?: string | null
          notes?: string | null
          status?: string
          tag_number?: string
          target_weight?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      cattle_health_records: {
        Row: {
          administered_by: string | null
          cattle_id: string | null
          created_at: string | null
          description: string
          id: string
          next_due_date: string | null
          notes: string | null
          record_date: string
          record_type: string
          treatment: string | null
          updated_at: string | null
        }
        Insert: {
          administered_by?: string | null
          cattle_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          record_date: string
          record_type: string
          treatment?: string | null
          updated_at?: string | null
        }
        Update: {
          administered_by?: string | null
          cattle_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          record_date?: string
          record_type?: string
          treatment?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cattle_health_records_cattle_id_fkey"
            columns: ["cattle_id"]
            isOneToOne: false
            referencedRelation: "cattle_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      cattle_inventory: {
        Row: {
          breed: string
          created_at: string | null
          date_of_birth: string | null
          farm_id: string
          health_status: string | null
          id: string
          name: string | null
          notes: string | null
          purchase_date: string | null
          tag_number: string
          type: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          breed: string
          created_at?: string | null
          date_of_birth?: string | null
          farm_id?: string
          health_status?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          purchase_date?: string | null
          tag_number: string
          type: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          breed?: string
          created_at?: string | null
          date_of_birth?: string | null
          farm_id?: string
          health_status?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          purchase_date?: string | null
          tag_number?: string
          type?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      ceo_dashboard_data: {
        Row: {
          company: string
          created_at: string | null
          data: Json | null
          data_type: string
          id: number
          module: string
          source_id: string | null
          source_module: string | null
          source_user: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          data?: Json | null
          data_type: string
          id?: never
          module: string
          source_id?: string | null
          source_module?: string | null
          source_user?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          data?: Json | null
          data_type?: string
          id?: never
          module?: string
          source_id?: string | null
          source_module?: string | null
          source_user?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cheese_production: {
        Row: {
          batch_number: string
          created_at: string | null
          duration: number
          id: string
          ph_level: number
          production_line_id: string | null
          quality_score: number | null
          status: string
          temperature: number
          updated_at: string | null
          yield_amount: number | null
        }
        Insert: {
          batch_number: string
          created_at?: string | null
          duration: number
          id?: string
          ph_level: number
          production_line_id?: string | null
          quality_score?: number | null
          status: string
          temperature: number
          updated_at?: string | null
          yield_amount?: number | null
        }
        Update: {
          batch_number?: string
          created_at?: string | null
          duration?: number
          id?: string
          ph_level?: number
          production_line_id?: string | null
          quality_score?: number | null
          status?: string
          temperature?: number
          updated_at?: string | null
          yield_amount?: number | null
        }
        Relationships: []
      }
      cheese_production_stats: {
        Row: {
          created_at: string | null
          date: string
          id: string
          production_amount: number
          yield_efficiency: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          production_amount: number
          yield_efficiency?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          production_amount?: number
          yield_efficiency?: number | null
        }
        Relationships: []
      }
      cheese_vat_records: {
        Row: {
          created_at: string | null
          curd_size: number | null
          current_phase: string
          id: string
          notes: string | null
          operator_id: string
          ph_level: number | null
          product_type: string
          status: string
          stirring_speed: number | null
          temperature: number
          updated_at: string | null
          vat_id: string
        }
        Insert: {
          created_at?: string | null
          curd_size?: number | null
          current_phase: string
          id?: string
          notes?: string | null
          operator_id: string
          ph_level?: number | null
          product_type: string
          status: string
          stirring_speed?: number | null
          temperature: number
          updated_at?: string | null
          vat_id: string
        }
        Update: {
          created_at?: string | null
          curd_size?: number | null
          current_phase?: string
          id?: string
          notes?: string | null
          operator_id?: string
          ph_level?: number | null
          product_type?: string
          status?: string
          stirring_speed?: number | null
          temperature?: number
          updated_at?: string | null
          vat_id?: string
        }
        Relationships: []
      }
      cleaning_records: {
        Row: {
          cleaned_at: string | null
          cleaner_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          tank_id: string | null
        }
        Insert: {
          cleaned_at?: string | null
          cleaner_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          tank_id?: string | null
        }
        Update: {
          cleaned_at?: string | null
          cleaner_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          tank_id?: string | null
        }
        Relationships: []
      }
      coffee_customers: {
        Row: {
          contact_person: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          last_order_date: string | null
          location: string | null
          name: string
          notes: string | null
          phone: string | null
          preferred_coffee_types: string[] | null
          preferred_grades: string[] | null
          status: string | null
          total_orders: number | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_order_date?: string | null
          location?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          preferred_coffee_types?: string[] | null
          preferred_grades?: string[] | null
          status?: string | null
          total_orders?: number | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_order_date?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_coffee_types?: string[] | null
          preferred_grades?: string[] | null
          status?: string | null
          total_orders?: number | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      coffee_export_contracts: {
        Row: {
          additional_shipping_terms: string | null
          additional_shipping_terms_label: string | null
          buyer_address: string | null
          buyer_name: string
          buyer_registration: string | null
          buyer_signature_date_label: string | null
          buyer_signature_date_value: string | null
          buyer_signature_label: string | null
          buyer_signature_name_label: string | null
          buyer_signature_name_value: string | null
          buyer_signature_title_label: string | null
          buyer_signature_title_value: string | null
          buyer_signature_value: string | null
          company_stamp: string | null
          contract_date: string
          contract_number: string
          created_at: string | null
          for_buyer_label: string | null
          for_seller_label: string | null
          id: string
          payment_terms_items: Json
          products: Json
          seller_address: string | null
          seller_date_label: string | null
          seller_date_value: string | null
          seller_name: string
          seller_name_label: string | null
          seller_name_value: string | null
          seller_registration: string | null
          seller_signature_label: string | null
          seller_signature_value: string | null
          seller_title_label: string | null
          seller_title_value: string | null
          shipping_left_label1: string | null
          shipping_left_label2: string | null
          shipping_left_label3: string | null
          shipping_left_value1: string | null
          shipping_left_value2: string | null
          shipping_left_value3: string | null
          shipping_right_label1: string | null
          shipping_right_label2: string | null
          shipping_right_label3: string | null
          shipping_right_value1: string | null
          shipping_right_value2: string | null
          shipping_right_value3: string | null
          total_contract_value: number | null
          updated_at: string | null
        }
        Insert: {
          additional_shipping_terms?: string | null
          additional_shipping_terms_label?: string | null
          buyer_address?: string | null
          buyer_name: string
          buyer_registration?: string | null
          buyer_signature_date_label?: string | null
          buyer_signature_date_value?: string | null
          buyer_signature_label?: string | null
          buyer_signature_name_label?: string | null
          buyer_signature_name_value?: string | null
          buyer_signature_title_label?: string | null
          buyer_signature_title_value?: string | null
          buyer_signature_value?: string | null
          company_stamp?: string | null
          contract_date: string
          contract_number: string
          created_at?: string | null
          for_buyer_label?: string | null
          for_seller_label?: string | null
          id?: string
          payment_terms_items: Json
          products: Json
          seller_address?: string | null
          seller_date_label?: string | null
          seller_date_value?: string | null
          seller_name: string
          seller_name_label?: string | null
          seller_name_value?: string | null
          seller_registration?: string | null
          seller_signature_label?: string | null
          seller_signature_value?: string | null
          seller_title_label?: string | null
          seller_title_value?: string | null
          shipping_left_label1?: string | null
          shipping_left_label2?: string | null
          shipping_left_label3?: string | null
          shipping_left_value1?: string | null
          shipping_left_value2?: string | null
          shipping_left_value3?: string | null
          shipping_right_label1?: string | null
          shipping_right_label2?: string | null
          shipping_right_label3?: string | null
          shipping_right_value1?: string | null
          shipping_right_value2?: string | null
          shipping_right_value3?: string | null
          total_contract_value?: number | null
          updated_at?: string | null
        }
        Update: {
          additional_shipping_terms?: string | null
          additional_shipping_terms_label?: string | null
          buyer_address?: string | null
          buyer_name?: string
          buyer_registration?: string | null
          buyer_signature_date_label?: string | null
          buyer_signature_date_value?: string | null
          buyer_signature_label?: string | null
          buyer_signature_name_label?: string | null
          buyer_signature_name_value?: string | null
          buyer_signature_title_label?: string | null
          buyer_signature_title_value?: string | null
          buyer_signature_value?: string | null
          company_stamp?: string | null
          contract_date?: string
          contract_number?: string
          created_at?: string | null
          for_buyer_label?: string | null
          for_seller_label?: string | null
          id?: string
          payment_terms_items?: Json
          products?: Json
          seller_address?: string | null
          seller_date_label?: string | null
          seller_date_value?: string | null
          seller_name?: string
          seller_name_label?: string | null
          seller_name_value?: string | null
          seller_registration?: string | null
          seller_signature_label?: string | null
          seller_signature_value?: string | null
          seller_title_label?: string | null
          seller_title_value?: string | null
          shipping_left_label1?: string | null
          shipping_left_label2?: string | null
          shipping_left_label3?: string | null
          shipping_left_value1?: string | null
          shipping_left_value2?: string | null
          shipping_left_value3?: string | null
          shipping_right_label1?: string | null
          shipping_right_label2?: string | null
          shipping_right_label3?: string | null
          shipping_right_value1?: string | null
          shipping_right_value2?: string | null
          shipping_right_value3?: string | null
          total_contract_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coffee_orders: {
        Row: {
          coffee_type: string | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          customer_name: string
          delivery_date: string | null
          fulfillment: string | null
          grade: string | null
          id: string
          notes: string | null
          order_date: string | null
          order_number: string
          payment_status: string | null
          quantity: number | null
          shipping_address: string | null
          status: string | null
          total_amount: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          coffee_type?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          customer_name: string
          delivery_date?: string | null
          fulfillment?: string | null
          grade?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number: string
          payment_status?: string | null
          quantity?: number | null
          shipping_address?: string | null
          status?: string | null
          total_amount?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          coffee_type?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          customer_name?: string
          delivery_date?: string | null
          fulfillment?: string | null
          grade?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number?: string
          payment_status?: string | null
          quantity?: number | null
          shipping_address?: string | null
          status?: string | null
          total_amount?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coffee_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "coffee_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_sales: {
        Row: {
          buyer_contact: string
          buyer_name: string
          coffee_type: string
          created_at: string | null
          currency: string
          id: string
          location: string
          manager: string
          quality_grade: string
          quantity: number
          selling_price: number
          status: string
          total_price: number
          unit: string
          updated_at: string | null
        }
        Insert: {
          buyer_contact: string
          buyer_name: string
          coffee_type: string
          created_at?: string | null
          currency?: string
          id?: string
          location: string
          manager: string
          quality_grade: string
          quantity: number
          selling_price: number
          status?: string
          total_price: number
          unit?: string
          updated_at?: string | null
        }
        Update: {
          buyer_contact?: string
          buyer_name?: string
          coffee_type?: string
          created_at?: string | null
          currency?: string
          id?: string
          location?: string
          manager?: string
          quality_grade?: string
          quantity?: number
          selling_price?: number
          status?: string
          total_price?: number
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coffee_sales_records: {
        Row: {
          created_at: string | null
          date: string
          expenses: number
          id: string
          product_type: string
          quantity: number
          revenue: number
        }
        Insert: {
          created_at?: string | null
          date: string
          expenses: number
          id?: string
          product_type: string
          quantity: number
          revenue: number
        }
        Update: {
          created_at?: string | null
          date?: string
          expenses?: number
          id?: string
          product_type?: string
          quantity?: number
          revenue?: number
        }
        Relationships: []
      }
      coffee_stock: {
        Row: {
          buying_price: number
          coffee_type: string
          created_at: string | null
          currency: string
          humidity: number
          id: string
          location: string
          manager: string
          notes: string | null
          quality_grade: string
          quantity: number
          source: string
          status: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          buying_price: number
          coffee_type: string
          created_at?: string | null
          currency?: string
          humidity: number
          id?: string
          location: string
          manager: string
          notes?: string | null
          quality_grade: string
          quantity: number
          source: string
          status?: string
          unit?: string
          updated_at?: string | null
        }
        Update: {
          buying_price?: number
          coffee_type?: string
          created_at?: string | null
          currency?: string
          humidity?: number
          id?: string
          location?: string
          manager?: string
          notes?: string | null
          quality_grade?: string
          quantity?: number
          source?: string
          status?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coffee_stock_transfers: {
        Row: {
          coffee_type: string
          created_at: string | null
          declined_at: string | null
          destination_location: string
          id: string
          manager: string
          notes: string | null
          quality_grade: string
          quantity: number
          reason: string | null
          received_at: string | null
          recipient_user_id: string | null
          sender_user_id: string | null
          source_location: string
          status: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          coffee_type: string
          created_at?: string | null
          declined_at?: string | null
          destination_location: string
          id?: string
          manager: string
          notes?: string | null
          quality_grade: string
          quantity: number
          reason?: string | null
          received_at?: string | null
          recipient_user_id?: string | null
          sender_user_id?: string | null
          source_location: string
          status?: string
          unit?: string
          updated_at?: string | null
        }
        Update: {
          coffee_type?: string
          created_at?: string | null
          declined_at?: string | null
          destination_location?: string
          id?: string
          manager?: string
          notes?: string | null
          quality_grade?: string
          quantity?: number
          reason?: string | null
          received_at?: string | null
          recipient_user_id?: string | null
          sender_user_id?: string | null
          source_location?: string
          status?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cold_room_environment_logs: {
        Row: {
          cold_room_id: string
          humidity: number
          id: string
          recorded_at: string | null
          temperature: number
        }
        Insert: {
          cold_room_id: string
          humidity: number
          id?: string
          recorded_at?: string | null
          temperature: number
        }
        Update: {
          cold_room_id?: string
          humidity?: number
          id?: string
          recorded_at?: string | null
          temperature?: number
        }
        Relationships: []
      }
      cold_room_inventory: {
        Row: {
          batch_id: string
          cold_room_id: string
          created_at: string | null
          humidity: number
          id: string
          movement_action: string
          operator_id: string
          product_category: string
          product_type: string
          production_batch_id: string | null
          remarks: string | null
          storage_date_time: string
          temperature: number
          unit_quantity: number
          unit_weight: number
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          cold_room_id: string
          created_at?: string | null
          humidity: number
          id?: string
          movement_action: string
          operator_id: string
          product_category: string
          product_type: string
          production_batch_id?: string | null
          remarks?: string | null
          storage_date_time: string
          temperature: number
          unit_quantity: number
          unit_weight: number
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          cold_room_id?: string
          created_at?: string | null
          humidity?: number
          id?: string
          movement_action?: string
          operator_id?: string
          product_category?: string
          product_type?: string
          production_batch_id?: string | null
          remarks?: string | null
          storage_date_time?: string
          temperature?: number
          unit_quantity?: number
          unit_weight?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_name: string
          company_type: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          manager_name: string | null
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          company_name: string
          company_type?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          manager_name?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          company_type?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          manager_name?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contract_documents: {
        Row: {
          client: string | null
          contract_id: string | null
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          file_url: string | null
          filename: string
          id: number
          keywords: string[] | null
          metadata: Json | null
          notes: string | null
          signed_by: string[] | null
          status: string | null
          updated_at: string | null
          upload_date: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          client?: string | null
          contract_id?: string | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          filename: string
          id?: never
          keywords?: string[] | null
          metadata?: Json | null
          notes?: string | null
          signed_by?: string[] | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          client?: string | null
          contract_id?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          filename?: string
          id?: never
          keywords?: string[] | null
          metadata?: Json | null
          notes?: string | null
          signed_by?: string[] | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      crm_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_by_name: string | null
          date_range_end: string | null
          date_range_start: string | null
          department: string
          distribution: string | null
          id: string
          key_findings: string | null
          recommendations: string | null
          report_title: string
          report_type: string
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          department: string
          distribution?: string | null
          id?: string
          key_findings?: string | null
          recommendations?: string | null
          report_title: string
          report_type: string
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          department?: string
          distribution?: string | null
          id?: string
          key_findings?: string | null
          recommendations?: string | null
          report_title?: string
          report_type?: string
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_feedback: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          feedback_date: string | null
          feedback_text: string | null
          follow_up_required: boolean | null
          follow_up_status: string | null
          id: string
          improvement_suggestions: string | null
          product_service: string | null
          satisfaction_rating: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          feedback_date?: string | null
          feedback_text?: string | null
          follow_up_required?: boolean | null
          follow_up_status?: string | null
          id?: string
          improvement_suggestions?: string | null
          product_service?: string | null
          satisfaction_rating: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          feedback_date?: string | null
          feedback_text?: string | null
          follow_up_required?: boolean | null
          follow_up_status?: string | null
          id?: string
          improvement_suggestions?: string | null
          product_service?: string | null
          satisfaction_rating?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_invoices: {
        Row: {
          billing_address: string | null
          created_at: string | null
          customer_contact: string | null
          customer_name: string
          discount: number | null
          due_date: string
          id: string
          invoice_date: string
          items: Json
          payment_proof_url: string | null
          payment_status: string | null
          payment_terms: string | null
          tax: number | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          billing_address?: string | null
          created_at?: string | null
          customer_contact?: string | null
          customer_name: string
          discount?: number | null
          due_date: string
          id: string
          invoice_date: string
          items?: Json
          payment_proof_url?: string | null
          payment_status?: string | null
          payment_terms?: string | null
          tax?: number | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          billing_address?: string | null
          created_at?: string | null
          customer_contact?: string | null
          customer_name?: string
          discount?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          items?: Json
          payment_proof_url?: string | null
          payment_status?: string | null
          payment_terms?: string | null
          tax?: number | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      dairy_cooler_records: {
        Row: {
          cooler_id: string
          created_at: string | null
          humidity: number | null
          id: string
          last_check: string | null
          status: string
          temperature: number
        }
        Insert: {
          cooler_id: string
          created_at?: string | null
          humidity?: number | null
          id?: string
          last_check?: string | null
          status: string
          temperature: number
        }
        Update: {
          cooler_id?: string
          created_at?: string | null
          humidity?: number | null
          id?: string
          last_check?: string | null
          status?: string
          temperature?: number
        }
        Relationships: []
      }
      dairy_customers: {
        Row: {
          contact_person: string | null
          created_at: string | null
          credit_limit: number | null
          email: string | null
          id: string
          last_order_date: string | null
          location: string | null
          name: string
          notes: string | null
          outstanding_balance: number | null
          phone: string | null
          status: string | null
          total_orders: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          last_order_date?: string | null
          location?: string | null
          name: string
          notes?: string | null
          outstanding_balance?: number | null
          phone?: string | null
          status?: string | null
          total_orders?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          last_order_date?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          outstanding_balance?: number | null
          phone?: string | null
          status?: string | null
          total_orders?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dairy_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          section_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          section_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          section_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dairy_production: {
        Row: {
          created_at: string | null
          fat_content: number | null
          id: string
          notes: string | null
          production_date: string
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fat_content?: number | null
          id?: string
          notes?: string | null
          production_date?: string
          quantity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fat_content?: number | null
          id?: string
          notes?: string | null
          production_date?: string
          quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      dairy_production_reports: {
        Row: {
          batch_id: string
          created_at: string
          efficiency: number | null
          finished_product: number
          id: string
          notes: string | null
          operator_id: string | null
          product_type: string
          production_date: string
          quality_score: number | null
          raw_material: number
          updated_at: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          efficiency?: number | null
          finished_product: number
          id?: string
          notes?: string | null
          operator_id?: string | null
          product_type: string
          production_date: string
          quality_score?: number | null
          raw_material: number
          updated_at?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          efficiency?: number | null
          finished_product?: number
          id?: string
          notes?: string | null
          operator_id?: string | null
          product_type?: string
          production_date?: string
          quality_score?: number | null
          raw_material?: number
          updated_at?: string
        }
        Relationships: []
      }
      dairy_section_reports: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          end_date: string | null
          id: string | null
          priority: string | null
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          related_section: string | null
          send_via: string[] | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string | null
          priority?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          related_section?: string | null
          send_via?: string[] | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string | null
          priority?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          related_section?: string | null
          send_via?: string[] | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dairy_sections: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          metrics: Json | null
          priority: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id: string
          metrics?: Json | null
          priority?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          metrics?: Json | null
          priority?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Dashboard: {
        Row: {
          Charts: string | null
          content: string | null
          created_at: string
          "Date & Time": string | null
          id: number
          title: string | null
        }
        Insert: {
          Charts?: string | null
          content?: string | null
          created_at?: string
          "Date & Time"?: string | null
          id?: never
          title?: string | null
        }
        Update: {
          Charts?: string | null
          content?: string | null
          created_at?: string
          "Date & Time"?: string | null
          id?: never
          title?: string | null
        }
        Relationships: []
      }
      delivery_notes: {
        Row: {
          created_at: string | null
          delivered_items: Json
          delivery_date: string
          delivery_location: string
          delivery_person: string | null
          delivery_status: string
          id: string
          order_reference: string
          receiver_contact: string
          receiver_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_items?: Json
          delivery_date: string
          delivery_location: string
          delivery_person?: string | null
          delivery_status?: string
          id?: string
          order_reference: string
          receiver_contact: string
          receiver_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_items?: Json
          delivery_date?: string
          delivery_location?: string
          delivery_person?: string | null
          delivery_status?: string
          id?: string
          order_reference?: string
          receiver_contact?: string
          receiver_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employee_dossiers: {
        Row: {
          comments: string | null
          created_at: string | null
          department: string | null
          employee_id: string
          id: string
          job_title: string | null
          performance_rating: number | null
          review_date_time: string | null
          shift_end: string | null
          shift_start: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          department?: string | null
          employee_id: string
          id?: string
          job_title?: string | null
          performance_rating?: number | null
          review_date_time?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          department?: string | null
          employee_id?: string
          id?: string
          job_title?: string | null
          performance_rating?: number | null
          review_date_time?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          classification: string
          created_at: string | null
          current_condition: string | null
          equipment_name: string
          id: string
          manufacturer: string | null
          model: string | null
          notes: string | null
          purchase_condition: string | null
          purchase_date: string | null
          serial_number: string | null
          type: string | null
          updated_at: string | null
          use_description: string | null
        }
        Insert: {
          classification: string
          created_at?: string | null
          current_condition?: string | null
          equipment_name: string
          id?: string
          manufacturer?: string | null
          model?: string | null
          notes?: string | null
          purchase_condition?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          type?: string | null
          updated_at?: string | null
          use_description?: string | null
        }
        Update: {
          classification?: string
          created_at?: string | null
          current_condition?: string | null
          equipment_name?: string
          id?: string
          manufacturer?: string | null
          model?: string | null
          notes?: string | null
          purchase_condition?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          type?: string | null
          updated_at?: string | null
          use_description?: string | null
        }
        Relationships: []
      }
      equipment_maintenance: {
        Row: {
          company: string
          created_at: string | null
          equipment_name: string
          health_score: number
          id: string
          last_maintenance: string | null
          maintenance_type: string
          next_maintenance: string
          notes: string | null
          project: string
          status: string
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          equipment_name: string
          health_score: number
          id?: string
          last_maintenance?: string | null
          maintenance_type: string
          next_maintenance: string
          notes?: string | null
          project: string
          status: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          equipment_name?: string
          health_score?: number
          id?: string
          last_maintenance?: string | null
          maintenance_type?: string
          next_maintenance?: string
          notes?: string | null
          project?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      farm_information: {
        Row: {
          annual_production: number | null
          coffee_type: string
          created_at: string | null
          daily_production: number | null
          farm_name: string
          farm_size: number
          id: string
          manager_name: string
          monthly_production: number | null
          notes: string | null
          quarterly_production: number | null
          supervisor_name: string
          updated_at: string | null
          weekly_production: number | null
        }
        Insert: {
          annual_production?: number | null
          coffee_type: string
          created_at?: string | null
          daily_production?: number | null
          farm_name: string
          farm_size: number
          id?: string
          manager_name: string
          monthly_production?: number | null
          notes?: string | null
          quarterly_production?: number | null
          supervisor_name: string
          updated_at?: string | null
          weekly_production?: number | null
        }
        Update: {
          annual_production?: number | null
          coffee_type?: string
          created_at?: string | null
          daily_production?: number | null
          farm_name?: string
          farm_size?: number
          id?: string
          manager_name?: string
          monthly_production?: number | null
          notes?: string | null
          quarterly_production?: number | null
          supervisor_name?: string
          updated_at?: string | null
          weekly_production?: number | null
        }
        Relationships: []
      }
      farm_staff: {
        Row: {
          address: string | null
          avatar_url: string | null
          contact_number: string
          created_at: string
          email: string | null
          farm_id: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          role: string
          salary: number | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          contact_number: string
          created_at?: string
          email?: string | null
          farm_id: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          role?: string
          salary?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          contact_number?: string
          created_at?: string
          email?: string | null
          farm_id?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          role?: string
          salary?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_access_log: {
        Row: {
          accessed_at: string | null
          action: string
          company: string | null
          feature_key: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          accessed_at?: string | null
          action: string
          company?: string | null
          feature_key: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          accessed_at?: string | null
          action?: string
          company?: string | null
          feature_key?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      feature_definitions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          feature_key: string
          feature_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          parent_feature_key: string | null
          route_path: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          feature_key: string
          feature_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          parent_feature_key?: string | null
          route_path?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          feature_key?: string
          feature_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          parent_feature_key?: string | null
          route_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      grading_records: {
        Row: {
          batch_id: string
          below_screen_12: number | null
          created_at: string | null
          cupping_score: number | null
          defect_count: number | null
          defect_percentage: number | null
          final_grade: string | null
          grader: string | null
          hulling_operation_id: string | null
          id: string
          notes: string | null
          screen_12: number | null
          screen_15: number | null
          screen_18: number | null
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          below_screen_12?: number | null
          created_at?: string | null
          cupping_score?: number | null
          defect_count?: number | null
          defect_percentage?: number | null
          final_grade?: string | null
          grader?: string | null
          hulling_operation_id?: string | null
          id?: string
          notes?: string | null
          screen_12?: number | null
          screen_15?: number | null
          screen_18?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          below_screen_12?: number | null
          created_at?: string | null
          cupping_score?: number | null
          defect_count?: number | null
          defect_percentage?: number | null
          final_grade?: string | null
          grader?: string | null
          hulling_operation_id?: string | null
          id?: string
          notes?: string | null
          screen_12?: number | null
          screen_15?: number | null
          screen_18?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grading_records_hulling_operation_id_fkey"
            columns: ["hulling_operation_id"]
            isOneToOne: false
            referencedRelation: "hulling_operations"
            referencedColumns: ["id"]
          },
        ]
      }
      "Grand Berna Dairies": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: never
        }
        Update: {
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      harvest_records: {
        Row: {
          created_at: string | null
          crop_type: string
          date: string
          id: string
          notes: string | null
          plot_id: string
          quality: string
          quantity: number
          unit: string
          updated_at: string | null
          variety: string
          workers: string | null
        }
        Insert: {
          created_at?: string | null
          crop_type: string
          date: string
          id?: string
          notes?: string | null
          plot_id: string
          quality: string
          quantity: number
          unit: string
          updated_at?: string | null
          variety: string
          workers?: string | null
        }
        Update: {
          created_at?: string | null
          crop_type?: string
          date?: string
          id?: string
          notes?: string | null
          plot_id?: string
          quality?: string
          quantity?: number
          unit?: string
          updated_at?: string | null
          variety?: string
          workers?: string | null
        }
        Relationships: []
      }
      high_priority_reports: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          end_date: string | null
          id: string | null
          priority: string | null
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          related_section: string | null
          send_via: string[] | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string | null
          priority?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          related_section?: string | null
          send_via?: string[] | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string | null
          priority?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          related_section?: string | null
          send_via?: string[] | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hulling_operations: {
        Row: {
          batch_id: string
          created_at: string | null
          end_time: string | null
          id: string
          input_weight: number
          machine_id: string | null
          notes: string | null
          operator: string | null
          output_weight: number | null
          start_time: string | null
          status: string | null
          updated_at: string | null
          yield_percentage: number | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          input_weight: number
          machine_id?: string | null
          notes?: string | null
          operator?: string | null
          output_weight?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          yield_percentage?: number | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          input_weight?: number
          machine_id?: string | null
          notes?: string | null
          operator?: string | null
          output_weight?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          yield_percentage?: number | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          notes: string | null
          procurement_date: string | null
          quantity: number
          section: string
          status: string | null
          supplier_details: string | null
          total_cost: number
          unit_cost: number
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          notes?: string | null
          procurement_date?: string | null
          quantity: number
          section: string
          status?: string | null
          supplier_details?: string | null
          total_cost: number
          unit_cost: number
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          procurement_date?: string | null
          quantity?: number
          section?: string
          status?: string | null
          supplier_details?: string | null
          total_cost?: number
          unit_cost?: number
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      "KAJON Coffee Limited": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: never
        }
        Update: {
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      kakyinga_coffee_sales: {
        Row: {
          buyer_contact: string | null
          buyer_name: string
          created_at: string | null
          destination: string
          id: string
          money_received_by: string
          notes: string | null
          payment_method: string
          price_per_kg: number
          quality_grade: string
          quantity_kg: number
          sale_date: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          buyer_contact?: string | null
          buyer_name: string
          created_at?: string | null
          destination: string
          id?: string
          money_received_by: string
          notes?: string | null
          payment_method: string
          price_per_kg: number
          quality_grade: string
          quantity_kg: number
          sale_date: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          buyer_contact?: string | null
          buyer_name?: string
          created_at?: string | null
          destination?: string
          id?: string
          money_received_by?: string
          notes?: string | null
          payment_method?: string
          price_per_kg?: number
          quality_grade?: string
          quantity_kg?: number
          sale_date?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      kakyinga_dry_coffee_stock: {
        Row: {
          batch_number: string | null
          created_at: string | null
          entry_date: string
          id: string
          location: string
          moisture_content: number | null
          notes: string | null
          quality_grade: string
          quantity_kg: number
          source: string
          updated_at: string | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          entry_date: string
          id?: string
          location: string
          moisture_content?: number | null
          notes?: string | null
          quality_grade: string
          quantity_kg: number
          source: string
          updated_at?: string | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          entry_date?: string
          id?: string
          location?: string
          moisture_content?: number | null
          notes?: string | null
          quality_grade?: string
          quantity_kg?: number
          source?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kakyinga_employees: {
        Row: {
          created_at: string | null
          department: string
          employee_id: string
          full_name: string
          hire_date: string
          id: string
          notes: string | null
          phone: string | null
          position: string
          salary: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          employee_id: string
          full_name: string
          hire_date: string
          id?: string
          notes?: string | null
          phone?: string | null
          position: string
          salary?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          employee_id?: string
          full_name?: string
          hire_date?: string
          id?: string
          notes?: string | null
          phone?: string | null
          position?: string
          salary?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kakyinga_fresh_harvest: {
        Row: {
          created_at: string | null
          field_section: string
          harvest_date: string
          harvester_name: string
          id: string
          notes: string | null
          quality_grade: string
          quantity_kg: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          field_section: string
          harvest_date: string
          harvester_name: string
          id?: string
          notes?: string | null
          quality_grade: string
          quantity_kg: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          field_section?: string
          harvest_date?: string
          harvester_name?: string
          id?: string
          notes?: string | null
          quality_grade?: string
          quantity_kg?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      kakyinga_requisitions: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          category: string
          created_at: string | null
          estimated_cost: number | null
          id: string
          item_name: string
          justification: string
          notes: string | null
          priority: string
          quantity: string
          request_date: string
          requested_by: string
          requisition_number: string
          status: string
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          category: string
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          item_name: string
          justification: string
          notes?: string | null
          priority?: string
          quantity: string
          request_date: string
          requested_by: string
          requisition_number: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          category?: string
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          item_name?: string
          justification?: string
          notes?: string | null
          priority?: string
          quantity?: string
          request_date?: string
          requested_by?: string
          requisition_number?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kashari_attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kashari_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "kashari_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      kashari_employees: {
        Row: {
          address: string | null
          company: string | null
          contact: string | null
          created_at: string | null
          department: string | null
          email: string | null
          employee_id: string
          id: string
          join_date: string | null
          name: string
          photo_url: string | null
          position: string | null
          salary: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company?: string | null
          contact?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id: string
          id?: string
          join_date?: string | null
          name: string
          photo_url?: string | null
          position?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company?: string | null
          contact?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string
          id?: string
          join_date?: string | null
          name?: string
          photo_url?: string | null
          position?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kashari_leave_records: {
        Row: {
          approved_by: string | null
          created_at: string | null
          duration: number | null
          employee_id: string | null
          end_date: string
          id: string
          reason: string | null
          start_date: string
          status: string | null
          type: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          duration?: number | null
          employee_id?: string | null
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          status?: string | null
          type: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          duration?: number | null
          employee_id?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "kashari_leave_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "kashari_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      kashari_milk_production: {
        Row: {
          created_at: string | null
          date: string
          fat_content: number | null
          id: string
          location: string | null
          milking_cows: number
          notes: string | null
          protein_content: number | null
          session: string
          updated_at: string | null
          volume: number
        }
        Insert: {
          created_at?: string | null
          date: string
          fat_content?: number | null
          id?: string
          location?: string | null
          milking_cows: number
          notes?: string | null
          protein_content?: number | null
          session: string
          updated_at?: string | null
          volume: number
        }
        Update: {
          created_at?: string | null
          date?: string
          fat_content?: number | null
          id?: string
          location?: string | null
          milking_cows?: number
          notes?: string | null
          protein_content?: number | null
          session?: string
          updated_at?: string | null
          volume?: number
        }
        Relationships: []
      }
      kashari_scholarships: {
        Row: {
          amount: number | null
          created_at: string | null
          end_date: string | null
          grade_level: string | null
          guardian_contact: string | null
          guardian_name: string | null
          id: string
          notes: string | null
          scholarship_type: string | null
          school: string | null
          start_date: string | null
          status: string | null
          student_id: string | null
          student_name: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          grade_level?: string | null
          guardian_contact?: string | null
          guardian_name?: string | null
          id?: string
          notes?: string | null
          scholarship_type?: string | null
          school?: string | null
          start_date?: string | null
          status?: string | null
          student_id?: string | null
          student_name: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          grade_level?: string | null
          guardian_contact?: string | null
          guardian_name?: string | null
          id?: string
          notes?: string | null
          scholarship_type?: string | null
          school?: string | null
          start_date?: string | null
          status?: string | null
          student_id?: string | null
          student_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kashari_transactions: {
        Row: {
          amount: number
          bank_account: string
          created_at: string | null
          date: string
          id: number
          payee: string
          reason: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account: string
          created_at?: string | null
          date: string
          id?: never
          payee: string
          reason: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string
          created_at?: string | null
          date?: string
          id?: never
          payee?: string
          reason?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kazo_coffee_reports: {
        Row: {
          content: string
          created_at: string | null
          id: string
          location: string | null
          recipient_email: string
          recipient_name: string
          recipient_phone: string
          report_type: string
          send_via: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          location?: string | null
          recipient_email: string
          recipient_name: string
          recipient_phone: string
          report_type: string
          send_via: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          location?: string | null
          recipient_email?: string
          recipient_name?: string
          recipient_phone?: string
          report_type?: string
          send_via?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      "Kyalima Farmers Limited": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: never
        }
        Update: {
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      loans: {
        Row: {
          amount: number
          collateral: string | null
          contact_person: string | null
          created_at: string
          due_date: string
          id: string
          institution: string
          interest_rate: number
          loan_id: string
          notes: string | null
          payment_frequency: string
          purpose: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          collateral?: string | null
          contact_person?: string | null
          created_at?: string
          due_date: string
          id?: string
          institution: string
          interest_rate: number
          loan_id: string
          notes?: string | null
          payment_frequency: string
          purpose: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          collateral?: string | null
          contact_person?: string | null
          created_at?: string
          due_date?: string
          id?: string
          institution?: string
          interest_rate?: number
          loan_id?: string
          notes?: string | null
          payment_frequency?: string
          purpose?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      local_purchase_agreements: {
        Row: {
          agreement_date: string
          buyer_address: string | null
          buyer_contact: string | null
          buyer_name: string
          contract_number: string
          contract_status: string | null
          created_at: string | null
          created_by: string | null
          delivery_terms: string | null
          id: string
          items: Json | null
          notes: string | null
          payment_terms: string | null
          quality_requirements: string | null
          signature_buyer: string | null
          signature_supplier: string | null
          special_terms: string | null
          supplier_address: string | null
          supplier_contact: string | null
          supplier_name: string
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          agreement_date: string
          buyer_address?: string | null
          buyer_contact?: string | null
          buyer_name: string
          contract_number: string
          contract_status?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_terms?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          payment_terms?: string | null
          quality_requirements?: string | null
          signature_buyer?: string | null
          signature_supplier?: string | null
          special_terms?: string | null
          supplier_address?: string | null
          supplier_contact?: string | null
          supplier_name: string
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          agreement_date?: string
          buyer_address?: string | null
          buyer_contact?: string | null
          buyer_name?: string
          contract_number?: string
          contract_status?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_terms?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          payment_terms?: string | null
          quality_requirements?: string | null
          signature_buyer?: string | null
          signature_supplier?: string | null
          special_terms?: string | null
          supplier_address?: string | null
          supplier_contact?: string | null
          supplier_name?: string
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      logistics_deliveries: {
        Row: {
          actual_delivery_time: string | null
          actual_pickup_time: string | null
          comments: string | null
          created_at: string | null
          customer_name: string
          delivery_id: string
          delivery_location: string
          id: string
          operator_id: string | null
          order_id: string
          pickup_location: string
          scheduled_delivery_time: string
          scheduled_pickup_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          comments?: string | null
          created_at?: string | null
          customer_name: string
          delivery_id: string
          delivery_location: string
          id?: string
          operator_id?: string | null
          order_id: string
          pickup_location: string
          scheduled_delivery_time: string
          scheduled_pickup_time: string
          status: string
          updated_at?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          comments?: string | null
          created_at?: string | null
          customer_name?: string
          delivery_id?: string
          delivery_location?: string
          id?: string
          operator_id?: string | null
          order_id?: string
          pickup_location?: string
          scheduled_delivery_time?: string
          scheduled_pickup_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      logistics_delivery_management: {
        Row: {
          actual_delivery_time: string | null
          actual_pickup_time: string | null
          comments: string | null
          created_at: string | null
          customer_name: string
          delivery_id: string
          delivery_location: string
          id: string
          operator_id: string | null
          order_id: string | null
          pickup_location: string
          scheduled_delivery_time: string
          scheduled_pickup_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          comments?: string | null
          created_at?: string | null
          customer_name: string
          delivery_id: string
          delivery_location: string
          id?: string
          operator_id?: string | null
          order_id?: string | null
          pickup_location: string
          scheduled_delivery_time: string
          scheduled_pickup_time: string
          status: string
          updated_at?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          comments?: string | null
          created_at?: string | null
          customer_name?: string
          delivery_id?: string
          delivery_location?: string
          id?: string
          operator_id?: string | null
          order_id?: string | null
          pickup_location?: string
          scheduled_delivery_time?: string
          scheduled_pickup_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      logistics_delivery_performance: {
        Row: {
          action_details: string | null
          action_required: boolean | null
          comments: string | null
          created_at: string | null
          delay_reason: string | null
          delivery_id: string | null
          delivery_time: number
          deviation_from_average: number | null
          id: string
          operator_id: string | null
          performance_rating: number | null
          updated_at: string | null
        }
        Insert: {
          action_details?: string | null
          action_required?: boolean | null
          comments?: string | null
          created_at?: string | null
          delay_reason?: string | null
          delivery_id?: string | null
          delivery_time: number
          deviation_from_average?: number | null
          id?: string
          operator_id?: string | null
          performance_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          action_details?: string | null
          action_required?: boolean | null
          comments?: string | null
          created_at?: string | null
          delay_reason?: string | null
          delivery_id?: string | null
          delivery_time?: number
          deviation_from_average?: number | null
          id?: string
          operator_id?: string | null
          performance_rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      logistics_order_entries: {
        Row: {
          assigned_delivery_id: string | null
          created_at: string | null
          customer_name: string
          delivery_priority: string
          id: string
          operator_id: string | null
          order_date_time: string
          order_details: Json
          order_id: string
          order_status: string
          updated_at: string | null
        }
        Insert: {
          assigned_delivery_id?: string | null
          created_at?: string | null
          customer_name: string
          delivery_priority: string
          id?: string
          operator_id?: string | null
          order_date_time: string
          order_details: Json
          order_id: string
          order_status: string
          updated_at?: string | null
        }
        Update: {
          assigned_delivery_id?: string | null
          created_at?: string | null
          customer_name?: string
          delivery_priority?: string
          id?: string
          operator_id?: string | null
          order_date_time?: string
          order_details?: Json
          order_id?: string
          order_status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          company: string
          created_at: string | null
          equipment_name: string
          health_score: number
          id: string
          last_maintenance: string | null
          maintenance_type: string
          next_maintenance: string
          notes: string | null
          project: string
          status: string
          updated_at: string | null
        }
        Insert: {
          company?: string
          created_at?: string | null
          equipment_name: string
          health_score: number
          id?: string
          last_maintenance?: string | null
          maintenance_type: string
          next_maintenance: string
          notes?: string | null
          project?: string
          status: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          equipment_name?: string
          health_score?: number
          id?: string
          last_maintenance?: string | null
          maintenance_type?: string
          next_maintenance?: string
          notes?: string | null
          project?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_reports: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          end_date: string
          id: string
          priority: string | null
          recipient_email: string
          recipient_name: string
          recipient_phone: string
          related_section: string | null
          send_via: string[]
          start_date: string
          status: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          end_date: string
          id?: string
          priority?: string | null
          recipient_email: string
          recipient_name: string
          recipient_phone: string
          related_section?: string | null
          send_via: string[]
          start_date: string
          status?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          end_date?: string
          id?: string
          priority?: string | null
          recipient_email?: string
          recipient_name?: string
          recipient_phone?: string
          related_section?: string | null
          send_via?: string[]
          start_date?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_stats: {
        Row: {
          completed_today: number
          equipment_health: number
          id: string
          last_updated: string | null
          pending_maintenance: number
        }
        Insert: {
          completed_today?: number
          equipment_health?: number
          id?: string
          last_updated?: string | null
          pending_maintenance?: number
        }
        Update: {
          completed_today?: number
          equipment_health?: number
          id?: string
          last_updated?: string | null
          pending_maintenance?: number
        }
        Relationships: []
      }
      milk_production: {
        Row: {
          created_at: string | null
          date: string
          farm_id: string
          fat_content: number | null
          id: string
          milking_cows: number
          notes: string | null
          session: string
          updated_at: string | null
          volume: number
        }
        Insert: {
          created_at?: string | null
          date: string
          farm_id: string
          fat_content?: number | null
          id?: string
          milking_cows: number
          notes?: string | null
          session: string
          updated_at?: string | null
          volume: number
        }
        Update: {
          created_at?: string | null
          date?: string
          farm_id?: string
          fat_content?: number | null
          id?: string
          milking_cows?: number
          notes?: string | null
          session?: string
          updated_at?: string | null
          volume?: number
        }
        Relationships: []
      }
      milk_reception: {
        Row: {
          acidity: number
          batch_id: string | null
          created_at: string | null
          destination: string | null
          fat_percentage: number
          id: string
          milk_volume: number
          notes: string | null
          protein_percentage: number
          quality_score: string
          supplier_name: string
          tank_number: string
          temperature: number
          total_plate_count: number
          updated_at: string | null
        }
        Insert: {
          acidity: number
          batch_id?: string | null
          created_at?: string | null
          destination?: string | null
          fat_percentage: number
          id?: string
          milk_volume: number
          notes?: string | null
          protein_percentage: number
          quality_score: string
          supplier_name: string
          tank_number: string
          temperature: number
          total_plate_count: number
          updated_at?: string | null
        }
        Update: {
          acidity?: number
          batch_id?: string | null
          created_at?: string | null
          destination?: string | null
          fat_percentage?: number
          id?: string
          milk_volume?: number
          notes?: string | null
          protein_percentage?: number
          quality_score?: string
          supplier_name?: string
          tank_number?: string
          temperature?: number
          total_plate_count?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      milk_reception_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          milk_reception_id: string | null
          new_data: Json | null
          old_data: Json | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          milk_reception_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          milk_reception_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
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
            foreignKeyName: "fk_reception_id"
            columns: ["reception_id"]
            isOneToOne: false
            referencedRelation: "milk_reception"
            referencedColumns: ["id"]
          },
        ]
      }
      milk_reception_settings: {
        Row: {
          auto_cleaning_enabled: boolean
          capacity_warning_threshold: number
          cleaning_interval: number
          created_at: string
          id: string
          maintenance_interval: number
          temperature_threshold: number
          updated_at: string
        }
        Insert: {
          auto_cleaning_enabled?: boolean
          capacity_warning_threshold?: number
          cleaning_interval?: number
          created_at?: string
          id?: string
          maintenance_interval?: number
          temperature_threshold?: number
          updated_at?: string
        }
        Update: {
          auto_cleaning_enabled?: boolean
          capacity_warning_threshold?: number
          cleaning_interval?: number
          created_at?: string
          id?: string
          maintenance_interval?: number
          temperature_threshold?: number
          updated_at?: string
        }
        Relationships: []
      }
      milk_tank_offloads: {
        Row: {
          acidity: number | null
          batch_id: string | null
          created_at: string | null
          destination: string
          fat_percentage: number | null
          id: string
          notes: string | null
          protein_percentage: number | null
          quality_check: string
          storage_tank: string
          temperature: number
          total_plate_count: number | null
          updated_at: string | null
          volume_offloaded: number
        }
        Insert: {
          acidity?: number | null
          batch_id?: string | null
          created_at?: string | null
          destination: string
          fat_percentage?: number | null
          id?: string
          notes?: string | null
          protein_percentage?: number | null
          quality_check?: string
          storage_tank: string
          temperature: number
          total_plate_count?: number | null
          updated_at?: string | null
          volume_offloaded: number
        }
        Update: {
          acidity?: number | null
          batch_id?: string | null
          created_at?: string | null
          destination?: string
          fat_percentage?: number | null
          id?: string
          notes?: string | null
          protein_percentage?: number | null
          quality_check?: string
          storage_tank?: string
          temperature?: number
          total_plate_count?: number | null
          updated_at?: string | null
          volume_offloaded?: number
        }
        Relationships: []
      }
      milk_transactions: {
        Row: {
          created_at: string | null
          id: string
          liters_added: number
          price_per_liter: number
          tank_id: string | null
          temperature: number
          total_cost: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          liters_added: number
          price_per_liter: number
          tank_id?: string | null
          temperature: number
          total_cost: number
        }
        Update: {
          created_at?: string | null
          id?: string
          liters_added?: number
          price_per_liter?: number
          tank_id?: string | null
          temperature?: number
          total_cost?: number
        }
        Relationships: []
      }
      operations_form: {
        Row: {
          association_id: string | null
          collective_resources: string | null
          created_at: string | null
          id: string
          next_meeting_date: string | null
          shared_equipment: string | null
          status: string | null
          training_schedule: string | null
          updated_at: string | null
        }
        Insert: {
          association_id?: string | null
          collective_resources?: string | null
          created_at?: string | null
          id?: string
          next_meeting_date?: string | null
          shared_equipment?: string | null
          status?: string | null
          training_schedule?: string | null
          updated_at?: string | null
        }
        Update: {
          association_id?: string | null
          collective_resources?: string | null
          created_at?: string | null
          id?: string
          next_meeting_date?: string | null
          shared_equipment?: string | null
          status?: string | null
          training_schedule?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pasteurizer_records: {
        Row: {
          batch_volume: number
          cleaning_status: string | null
          created_at: string | null
          current_temperature: number
          flow_rate: number | null
          holding_time: number | null
          id: string
          notes: string | null
          operator_id: string
          status: string
          target_temperature: number
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          batch_volume: number
          cleaning_status?: string | null
          created_at?: string | null
          current_temperature: number
          flow_rate?: number | null
          holding_time?: number | null
          id?: string
          notes?: string | null
          operator_id: string
          status: string
          target_temperature: number
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          batch_volume?: number
          cleaning_status?: string | null
          created_at?: string | null
          current_temperature?: number
          flow_rate?: number | null
          holding_time?: number | null
          id?: string
          notes?: string | null
          operator_id?: string
          status?: string
          target_temperature?: number
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments_receipts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          notes: string | null
          party_name: string
          payment_date: string
          payment_method: string
          payment_number: string
          payment_type: string
          reference_number: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          notes?: string | null
          party_name: string
          payment_date: string
          payment_method: string
          payment_number: string
          payment_type: string
          reference_number?: string | null
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          notes?: string | null
          party_name?: string
          payment_date?: string
          payment_method?: string
          payment_number?: string
          payment_type?: string
          reference_number?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payroll_payslips: {
        Row: {
          basic_salary: number
          created_at: string | null
          currency: string
          department: string | null
          employee_id: string
          employee_name: string
          id: string
          loan_deduction: number
          net_salary: number
          notes: string | null
          nssf_amount: number
          other_deductions: number
          payment_date: string
          payment_method: string
          payment_status: string
          payslip_number: string
          salary_period: string
          tax_amount: number
          updated_at: string | null
        }
        Insert: {
          basic_salary: number
          created_at?: string | null
          currency: string
          department?: string | null
          employee_id: string
          employee_name: string
          id?: string
          loan_deduction?: number
          net_salary: number
          notes?: string | null
          nssf_amount?: number
          other_deductions?: number
          payment_date: string
          payment_method: string
          payment_status: string
          payslip_number: string
          salary_period: string
          tax_amount?: number
          updated_at?: string | null
        }
        Update: {
          basic_salary?: number
          created_at?: string | null
          currency?: string
          department?: string | null
          employee_id?: string
          employee_name?: string
          id?: string
          loan_deduction?: number
          net_salary?: number
          notes?: string | null
          nssf_amount?: number
          other_deductions?: number
          payment_date?: string
          payment_method?: string
          payment_status?: string
          payslip_number?: string
          salary_period?: string
          tax_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      permission_definitions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_system_critical: boolean | null
          permission_key: string
          permission_name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_critical?: boolean | null
          permission_key: string
          permission_name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_critical?: boolean | null
          permission_key?: string
          permission_name?: string
        }
        Relationships: []
      }
      personnel_documents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          employee_id: string
          file_path: string
          file_size: string
          file_type: string
          filename: string
          id: string
          updated_at: string | null
          upload_date: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          employee_id: string
          file_path: string
          file_size: string
          file_type: string
          filename: string
          id?: string
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string
          file_path?: string
          file_size?: string
          file_type?: string
          filename?: string
          id?: string
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      personnel_employee_records: {
        Row: {
          comments: string | null
          created_at: string | null
          department: string | null
          employee_id: string
          id: string
          job_title: string | null
          operator_id: string | null
          performance_rating: number | null
          review_date_time: string | null
          shift_end: string | null
          shift_start: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          department?: string | null
          employee_id: string
          id?: string
          job_title?: string | null
          operator_id?: string | null
          performance_rating?: number | null
          review_date_time?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          department?: string | null
          employee_id?: string
          id?: string
          job_title?: string | null
          operator_id?: string | null
          performance_rating?: number | null
          review_date_time?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      personnel_recruitment_records: {
        Row: {
          candidate_name: string
          created_at: string | null
          feedback: string | null
          hiring_manager_id: string | null
          id: string
          interview_date_time: string | null
          job_title: string
          operator_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_name: string
          created_at?: string | null
          feedback?: string | null
          hiring_manager_id?: string | null
          id?: string
          interview_date_time?: string | null
          job_title: string
          operator_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_name?: string
          created_at?: string | null
          feedback?: string | null
          hiring_manager_id?: string | null
          id?: string
          interview_date_time?: string | null
          job_title?: string
          operator_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      personnel_scheduled_tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean | null
          created_at: string | null
          created_by: string | null
          employee_id: string
          id: string
          location: string | null
          notes: string | null
          scheduled_date: string
          scheduled_time: string | null
          task_type: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          task_type: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          task_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      personnel_training_evaluations: {
        Row: {
          created_at: string | null
          employee_id: string
          feedback: string | null
          id: string
          operator_id: string | null
          performance_rating: number | null
          training_date: string | null
          training_module: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          feedback?: string | null
          id?: string
          operator_id?: string | null
          performance_rating?: number | null
          training_date?: string | null
          training_module: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          feedback?: string | null
          id?: string
          operator_id?: string | null
          performance_rating?: number | null
          training_date?: string | null
          training_module?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      planting_harvesting_schedule: {
        Row: {
          activity_type: string
          created_at: string | null
          expected_completion_date: string | null
          farm_id: string | null
          farm_name: string
          id: string
          notes: string | null
          scheduled_date: string
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          expected_completion_date?: string | null
          farm_id?: string | null
          farm_name: string
          id?: string
          notes?: string | null
          scheduled_date: string
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          expected_completion_date?: string | null
          farm_id?: string | null
          farm_name?: string
          id?: string
          notes?: string | null
          scheduled_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      planting_records: {
        Row: {
          area: number
          created_at: string | null
          crop_type: string
          date: string
          fertilizer: string | null
          id: string
          notes: string | null
          plot_id: string
          seeds_quantity: string | null
          variety: string
          workers: string | null
        }
        Insert: {
          area: number
          created_at?: string | null
          crop_type: string
          date: string
          fertilizer?: string | null
          id?: string
          notes?: string | null
          plot_id: string
          seeds_quantity?: string | null
          variety: string
          workers?: string | null
        }
        Update: {
          area?: number
          created_at?: string | null
          crop_type?: string
          date?: string
          fertilizer?: string | null
          id?: string
          notes?: string | null
          plot_id?: string
          seeds_quantity?: string | null
          variety?: string
          workers?: string | null
        }
        Relationships: []
      }
      pricing_sheets: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          effective_date: string
          expiry_date: string | null
          id: string
          products: Json
          sheet_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_date: string
          expiry_date?: string | null
          id?: string
          products: Json
          sheet_id: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_date?: string
          expiry_date?: string | null
          id?: string
          products?: Json
          sheet_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_catalogs: {
        Row: {
          catalog_description: string | null
          catalog_id: string
          catalog_name: string
          created_at: string | null
          created_by: string | null
          effective_date: string
          expiry_date: string | null
          id: string
          products: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          catalog_description?: string | null
          catalog_id: string
          catalog_name: string
          created_at?: string | null
          created_by?: string | null
          effective_date: string
          expiry_date?: string | null
          id?: string
          products: Json
          status: string
          updated_at?: string | null
        }
        Update: {
          catalog_description?: string | null
          catalog_id?: string
          catalog_name?: string
          created_at?: string | null
          created_by?: string | null
          effective_date?: string
          expiry_date?: string | null
          id?: string
          products?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      production_batches: {
        Row: {
          actual_yield: number | null
          batch_number: string
          created_at: string | null
          end_time: string | null
          expected_yield: number
          id: string
          notes: string | null
          product_type: Database["public"]["Enums"]["product_type"]
          quality_status: Database["public"]["Enums"]["quality_status"] | null
          raw_milk_used: number
          start_time: string
          updated_at: string | null
        }
        Insert: {
          actual_yield?: number | null
          batch_number: string
          created_at?: string | null
          end_time?: string | null
          expected_yield: number
          id?: string
          notes?: string | null
          product_type: Database["public"]["Enums"]["product_type"]
          quality_status?: Database["public"]["Enums"]["quality_status"] | null
          raw_milk_used: number
          start_time: string
          updated_at?: string | null
        }
        Update: {
          actual_yield?: number | null
          batch_number?: string
          created_at?: string | null
          end_time?: string | null
          expected_yield?: number
          id?: string
          notes?: string | null
          product_type?: Database["public"]["Enums"]["product_type"]
          quality_status?: Database["public"]["Enums"]["quality_status"] | null
          raw_milk_used?: number
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      production_line_international: {
        Row: {
          batch_id: string
          cheese_type: string
          coagulant_quantity: number
          coagulant_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_duration: number
          expected_yield: number
          fromager_identifier: string
          id: string
          manager: string | null
          milk_volume: number
          name: string | null
          notes: string | null
          offload_batch_id: string | null
          processing_temperature: number
          processing_time: number
          start_time: string
          starter_culture: string
          starter_quantity: number
          status: string | null
          unit_quantity: number | null
          unit_weight: number | null
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          cheese_type: string
          coagulant_quantity: number
          coagulant_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration: number
          expected_yield: number
          fromager_identifier: string
          id?: string
          manager?: string | null
          milk_volume: number
          name?: string | null
          notes?: string | null
          offload_batch_id?: string | null
          processing_temperature: number
          processing_time: number
          start_time: string
          starter_culture: string
          starter_quantity: number
          status?: string | null
          unit_quantity?: number | null
          unit_weight?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          cheese_type?: string
          coagulant_quantity?: number
          coagulant_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration?: number
          expected_yield?: number
          fromager_identifier?: string
          id?: string
          manager?: string | null
          milk_volume?: number
          name?: string | null
          notes?: string | null
          offload_batch_id?: string | null
          processing_temperature?: number
          processing_time?: number
          start_time?: string
          starter_culture?: string
          starter_quantity?: number
          status?: string | null
          unit_quantity?: number | null
          unit_weight?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      production_line_local: {
        Row: {
          batch_id: string
          cheese_type: string
          coagulant_quantity: number
          coagulant_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_duration: number
          expected_yield: number
          fromager_identifier: string
          id: string
          manager: string | null
          milk_volume: number
          name: string | null
          notes: string | null
          offload_batch_id: string | null
          processing_temperature: number
          processing_time: number
          start_time: string
          starter_culture: string
          starter_quantity: number
          status: string | null
          unit_quantity: number | null
          unit_weight: number | null
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          cheese_type: string
          coagulant_quantity: number
          coagulant_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration: number
          expected_yield: number
          fromager_identifier: string
          id?: string
          manager?: string | null
          milk_volume: number
          name?: string | null
          notes?: string | null
          offload_batch_id?: string | null
          processing_temperature: number
          processing_time: number
          start_time: string
          starter_culture: string
          starter_quantity: number
          status?: string | null
          unit_quantity?: number | null
          unit_weight?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          cheese_type?: string
          coagulant_quantity?: number
          coagulant_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration?: number
          expected_yield?: number
          fromager_identifier?: string
          id?: string
          manager?: string | null
          milk_volume?: number
          name?: string | null
          notes?: string | null
          offload_batch_id?: string | null
          processing_temperature?: number
          processing_time?: number
          start_time?: string
          starter_culture?: string
          starter_quantity?: number
          status?: string | null
          unit_quantity?: number | null
          unit_weight?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      production_lines: {
        Row: {
          created_at: string | null
          id: string
          manager: string | null
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          manager?: string | null
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          manager?: string | null
          name?: string
          status?: string | null
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
      quality_checks: {
        Row: {
          batch_id: string
          checked_by: string | null
          created_at: string | null
          fat_actual: number
          fat_standard: number
          fat_status: string
          id: string
          moisture_actual: number
          moisture_standard: number
          moisture_status: string
          notes: string | null
          ph_level_actual: number
          ph_level_standard: number
          ph_level_status: string
          protein_actual: number
          protein_standard: number
          protein_status: string
          salt_actual: number
          salt_standard: number
          salt_status: string
          temperature_actual: number
          temperature_standard: number
          temperature_status: string
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          checked_by?: string | null
          created_at?: string | null
          fat_actual: number
          fat_standard: number
          fat_status: string
          id?: string
          moisture_actual: number
          moisture_standard: number
          moisture_status: string
          notes?: string | null
          ph_level_actual: number
          ph_level_standard: number
          ph_level_status: string
          protein_actual: number
          protein_standard: number
          protein_status: string
          salt_actual: number
          salt_standard: number
          salt_status: string
          temperature_actual: number
          temperature_standard: number
          temperature_status: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          checked_by?: string | null
          created_at?: string | null
          fat_actual?: number
          fat_standard?: number
          fat_status?: string
          id?: string
          moisture_actual?: number
          moisture_standard?: number
          moisture_status?: string
          notes?: string | null
          ph_level_actual?: number
          ph_level_standard?: number
          ph_level_status?: string
          protein_actual?: number
          protein_standard?: number
          protein_status?: string
          salt_actual?: number
          salt_standard?: number
          salt_status?: string
          temperature_actual?: number
          temperature_standard?: number
          temperature_status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quality_control: {
        Row: {
          batch_id: string
          checked_by: string
          created_at: string | null
          id: string
          parameter: string
          standard_value: string
          status: string
          value: string
        }
        Insert: {
          batch_id: string
          checked_by: string
          created_at?: string | null
          id?: string
          parameter: string
          standard_value: string
          status: string
          value: string
        }
        Update: {
          batch_id?: string
          checked_by?: string
          created_at?: string | null
          id?: string
          parameter?: string
          standard_value?: string
          status?: string
          value?: string
        }
        Relationships: []
      }
      quality_control_checks: {
        Row: {
          actual_value: string
          batch_id: string | null
          checked_at: string | null
          checked_by: string
          expected_value: string
          id: string
          parameter: string
          passed: boolean
        }
        Insert: {
          actual_value: string
          batch_id?: string | null
          checked_at?: string | null
          checked_by: string
          expected_value: string
          id?: string
          parameter: string
          passed: boolean
        }
        Update: {
          actual_value?: string
          batch_id?: string | null
          checked_at?: string | null
          checked_by?: string
          expected_value?: string
          id?: string
          parameter?: string
          passed?: boolean
        }
        Relationships: []
      }
      quality_score_settings: {
        Row: {
          created_at: string | null
          grade: string
          id: string
          max_acidity: number | null
          max_fat_percentage: number | null
          max_plate_count: number | null
          max_protein_percentage: number | null
          max_temperature: number | null
          min_acidity: number | null
          min_fat_percentage: number | null
          min_protein_percentage: number | null
          min_temperature: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          grade: string
          id?: string
          max_acidity?: number | null
          max_fat_percentage?: number | null
          max_plate_count?: number | null
          max_protein_percentage?: number | null
          max_temperature?: number | null
          min_acidity?: number | null
          min_fat_percentage?: number | null
          min_protein_percentage?: number | null
          min_temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          grade?: string
          id?: string
          max_acidity?: number | null
          max_fat_percentage?: number | null
          max_plate_count?: number | null
          max_protein_percentage?: number | null
          max_temperature?: number | null
          min_acidity?: number | null
          min_fat_percentage?: number | null
          min_protein_percentage?: number | null
          min_temperature?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quality_trends: {
        Row: {
          average_score: number | null
          created_at: string | null
          date: string
          id: string
          pass_rate: number
        }
        Insert: {
          average_score?: number | null
          created_at?: string | null
          date: string
          id?: string
          pass_rate: number
        }
        Update: {
          average_score?: number | null
          created_at?: string | null
          date?: string
          id?: string
          pass_rate?: number
        }
        Relationships: []
      }
      quotations: {
        Row: {
          coffee_grade: string
          created_at: string | null
          customer_name: string
          delivery_terms: string
          destination: string
          id: string
          incoterm: string
          low_grades_percent: number
          net_profit: number
          notes: string | null
          num_containers: number
          ocean_freight: number
          payment_terms: string
          port_charges: number
          quantity: number
          quote_number: string
          screen_12_percent: number
          screen_15_percent: number
          screen_18_percent: number
          sourcing_costs: Json
          total_amount: number
          total_costs: number
          total_revenue: number
          transport_cost: number
          unit_price: number
          updated_at: string | null
          validity: string
        }
        Insert: {
          coffee_grade: string
          created_at?: string | null
          customer_name: string
          delivery_terms: string
          destination: string
          id?: string
          incoterm: string
          low_grades_percent?: number
          net_profit?: number
          notes?: string | null
          num_containers: number
          ocean_freight?: number
          payment_terms: string
          port_charges?: number
          quantity: number
          quote_number: string
          screen_12_percent?: number
          screen_15_percent?: number
          screen_18_percent?: number
          sourcing_costs?: Json
          total_amount: number
          total_costs?: number
          total_revenue?: number
          transport_cost?: number
          unit_price: number
          updated_at?: string | null
          validity: string
        }
        Update: {
          coffee_grade?: string
          created_at?: string | null
          customer_name?: string
          delivery_terms?: string
          destination?: string
          id?: string
          incoterm?: string
          low_grades_percent?: number
          net_profit?: number
          notes?: string | null
          num_containers?: number
          ocean_freight?: number
          payment_terms?: string
          port_charges?: number
          quantity?: number
          quote_number?: string
          screen_12_percent?: number
          screen_15_percent?: number
          screen_18_percent?: number
          sourcing_costs?: Json
          total_amount?: number
          total_costs?: number
          total_revenue?: number
          transport_cost?: number
          unit_price?: number
          updated_at?: string | null
          validity?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          product_code: string
          quantity: number
          quote_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          product_code: string
          quantity: number
          quote_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          product_code?: string
          quantity?: number
          quote_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: []
      }
      quotes: {
        Row: {
          coffee_grade: string
          created_at: string | null
          customer_address: string | null
          customer_email: string | null
          customer_name: string
          delivery_terms: string
          id: string
          payment_terms: string
          quantity: number
          quote_number: string
          status: string | null
          terms: string | null
          total_amount: number
          unit_price: number
          updated_at: string | null
          validity: string
        }
        Insert: {
          coffee_grade: string
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name: string
          delivery_terms: string
          id?: string
          payment_terms: string
          quantity: number
          quote_number: string
          status?: string | null
          terms?: string | null
          total_amount: number
          unit_price: number
          updated_at?: string | null
          validity: string
        }
        Update: {
          coffee_grade?: string
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          delivery_terms?: string
          id?: string
          payment_terms?: string
          quantity?: number
          quote_number?: string
          status?: string | null
          terms?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string | null
          validity?: string
        }
        Relationships: []
      }
      raw_materials_inventory: {
        Row: {
          batch_number: string | null
          created_at: string | null
          expiration_date: string
          id: string
          material_name: string
          quantity: number
          supplier: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          expiration_date: string
          id?: string
          material_name: string
          quantity: number
          supplier?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          expiration_date?: string
          id?: string
          material_name?: string
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      report_configurations: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          report_type: string
          start_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          report_type: string
          start_date: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          report_type?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      report_downloads: {
        Row: {
          created_at: string | null
          id: string
          report_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          report_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          report_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      report_exports: {
        Row: {
          date_range: string
          export_format: string
          exported_at: string | null
          id: string
          report_type: string
          user_id: string | null
        }
        Insert: {
          date_range: string
          export_format: string
          exported_at?: string | null
          id?: string
          report_type: string
          user_id?: string | null
        }
        Update: {
          date_range?: string
          export_format?: string
          exported_at?: string | null
          id?: string
          report_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      report_read_status: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          read_at: string | null
          report_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          report_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          report_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      report_shares: {
        Row: {
          id: string
          message: string | null
          recipient_ids: string[] | null
          recipients: string[]
          report_type: string
          share_method: string
          shared_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message?: string | null
          recipient_ids?: string[] | null
          recipients: string[]
          report_type: string
          share_method: string
          shared_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message?: string | null
          recipient_ids?: string[] | null
          recipients?: string[]
          report_type?: string
          share_method?: string
          shared_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      requisitions: {
        Row: {
          created_at: string | null
          department: string
          id: string
          justification: string
          repairs: string | null
          requester_name: string
          requisition_type: string
          status: string | null
          tools_machinery: string | null
          updated_at: string | null
          urgency_level: string
        }
        Insert: {
          created_at?: string | null
          department: string
          id?: string
          justification: string
          repairs?: string | null
          requester_name: string
          requisition_type: string
          status?: string | null
          tools_machinery?: string | null
          updated_at?: string | null
          urgency_level: string
        }
        Update: {
          created_at?: string | null
          department?: string
          id?: string
          justification?: string
          repairs?: string | null
          requester_name?: string
          requisition_type?: string
          status?: string | null
          tools_machinery?: string | null
          updated_at?: string | null
          urgency_level?: string
        }
        Relationships: []
      }
      rice_imports: {
        Row: {
          created_at: string | null
          id: string
          logistics_costs: number
          procurement_costs: number
          product_type: string
          quality: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          logistics_costs: number
          procurement_costs: number
          product_type: string
          quality: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          logistics_costs?: number
          procurement_costs?: number
          product_type?: string
          quality?: string
          quantity?: number
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
      role_feature_access: {
        Row: {
          access_level: string | null
          company: string | null
          created_at: string | null
          feature_key: string
          id: string
          is_enabled: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          company?: string | null
          created_at?: string | null
          feature_key: string
          id?: string
          is_enabled?: boolean | null
          role: string
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          company?: string | null
          created_at?: string | null
          feature_key?: string
          id?: string
          is_enabled?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_feature_access_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "feature_definitions"
            referencedColumns: ["feature_key"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          permission_key: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          permission_key: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          permission_key?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permission_definitions"
            referencedColumns: ["permission_key"]
          },
        ]
      }
      role_templates: {
        Row: {
          created_at: string
          created_by: string | null
          default_company: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          default_company: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          default_company?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_system_role: boolean | null
          role_key: string
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          role_key: string
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          role_key?: string
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_contracts: {
        Row: {
          client_address: string | null
          client_contact: string | null
          client_email: string | null
          client_name: string
          contract_id: string
          contract_title: string
          contract_type: string
          created_at: string | null
          created_by: string | null
          delivery_terms: string | null
          end_date: string | null
          id: string
          notes: string | null
          payment_terms: string | null
          products: Json | null
          special_clauses: string | null
          start_date: string | null
          status: string | null
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          client_address?: string | null
          client_contact?: string | null
          client_email?: string | null
          client_name: string
          contract_id: string
          contract_title: string
          contract_type: string
          created_at?: string | null
          created_by?: string | null
          delivery_terms?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          products?: Json | null
          special_clauses?: string | null
          start_date?: string | null
          status?: string | null
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          client_address?: string | null
          client_contact?: string | null
          client_email?: string | null
          client_name?: string
          contract_id?: string
          contract_title?: string
          contract_type?: string
          created_at?: string | null
          created_by?: string | null
          delivery_terms?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          products?: Json | null
          special_clauses?: string | null
          start_date?: string | null
          status?: string | null
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_orders: {
        Row: {
          created_at: string | null
          customer_name: string
          delivery_required: string
          discount: number | null
          id: string
          notes: string | null
          order_date: string
          payment_status: string
          product: string
          product_type: string | null
          quantity: number
          sales_rep: string | null
          total_amount: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          delivery_required: string
          discount?: number | null
          id?: string
          notes?: string | null
          order_date: string
          payment_status: string
          product: string
          product_type?: string | null
          quantity: number
          sales_rep?: string | null
          total_amount?: number | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          delivery_required?: string
          discount?: number | null
          id?: string
          notes?: string | null
          order_date?: string
          payment_status?: string
          product?: string
          product_type?: string | null
          quantity?: number
          sales_rep?: string | null
          total_amount?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_proposals: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          grand_total: number
          id: string
          products: Json
          proposal_date: string
          proposal_id: string | null
          status: string
          terms_conditions: string | null
          updated_at: string | null
          validity_period: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          grand_total: number
          id?: string
          products: Json
          proposal_date: string
          proposal_id?: string | null
          status?: string
          terms_conditions?: string | null
          updated_at?: string | null
          validity_period: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          grand_total?: number
          id?: string
          products?: Json
          proposal_date?: string
          proposal_id?: string | null
          status?: string
          terms_conditions?: string | null
          updated_at?: string | null
          validity_period?: number
        }
        Relationships: []
      }
      sales_records: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_name: string
          date_time: string
          destination: string | null
          driver_id: string | null
          id: string
          invoice_number: string
          price_per_unit: number
          product_type: string
          quantity: number
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_name: string
          date_time: string
          destination?: string | null
          driver_id?: string | null
          id?: string
          invoice_number: string
          price_per_unit: number
          product_type: string
          quantity: number
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_name?: string
          date_time?: string
          destination?: string | null
          driver_id?: string | null
          id?: string
          invoice_number?: string
          price_per_unit?: number
          product_type?: string
          quantity?: number
          vehicle_id?: string | null
        }
        Relationships: []
      }
      shipments: {
        Row: {
          client: string | null
          container: string
          created_at: string
          departure_date: string
          destination: string | null
          eta: string
          id: string
          last_update: string
          route: string | null
          shipment_id: string
          special_instructions: string | null
          status: string
          vessel: string | null
          volume: string | null
        }
        Insert: {
          client?: string | null
          container: string
          created_at?: string
          departure_date: string
          destination?: string | null
          eta: string
          id?: string
          last_update: string
          route?: string | null
          shipment_id: string
          special_instructions?: string | null
          status: string
          vessel?: string | null
          volume?: string | null
        }
        Update: {
          client?: string | null
          container?: string
          created_at?: string
          departure_date?: string
          destination?: string | null
          eta?: string
          id?: string
          last_update?: string
          route?: string | null
          shipment_id?: string
          special_instructions?: string | null
          status?: string
          vessel?: string | null
          volume?: string | null
        }
        Relationships: []
      }
      silage_inventory: {
        Row: {
          amount: number
          created_at: string | null
          expenses_incurred: number | null
          expiry_date: string | null
          farm_id: string
          id: string
          ingredients: string[] | null
          notes: string | null
          person_in_charge: string | null
          production_date: string
          quality: string
          storage_location: string | null
          type: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          expenses_incurred?: number | null
          expiry_date?: string | null
          farm_id: string
          id?: string
          ingredients?: string[] | null
          notes?: string | null
          person_in_charge?: string | null
          production_date: string
          quality: string
          storage_location?: string | null
          type: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          expenses_incurred?: number | null
          expiry_date?: string | null
          farm_id?: string
          id?: string
          ingredients?: string[] | null
          notes?: string | null
          person_in_charge?: string | null
          production_date?: string
          quality?: string
          storage_location?: string | null
          type?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sourcing_records: {
        Row: {
          coffee_type: string
          created_at: string | null
          currency: string | null
          id: string
          location: string
          manager: string | null
          moisture_content: number | null
          notes: string | null
          procurement_cost: number | null
          quality_rating: string | null
          screen_grade: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          coffee_type: string
          created_at?: string | null
          currency?: string | null
          id?: string
          location: string
          manager?: string | null
          moisture_content?: number | null
          notes?: string | null
          procurement_cost?: number | null
          quality_rating?: string | null
          screen_grade?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          coffee_type?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          location?: string
          manager?: string | null
          moisture_content?: number | null
          notes?: string | null
          procurement_cost?: number | null
          quality_rating?: string | null
          screen_grade?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      specialty_coffee_contracts: {
        Row: {
          additional_shipping_terms: string | null
          additional_shipping_terms_label: string | null
          buyer_address: string | null
          buyer_name: string
          buyer_registration: string | null
          buyer_signature_date_label: string | null
          buyer_signature_date_value: string | null
          buyer_signature_label: string | null
          buyer_signature_name_label: string | null
          buyer_signature_name_value: string | null
          buyer_signature_title_label: string | null
          buyer_signature_title_value: string | null
          buyer_signature_value: string | null
          client_reference_id: string | null
          coffee_certification: string | null
          coffee_grade: string | null
          coffee_origin: string | null
          coffee_process: string | null
          coffee_variety: string | null
          company_stamp: string | null
          contract_date: string
          contract_number: string
          created_at: string | null
          cupping_score: number | null
          currency: string | null
          for_buyer_label: string | null
          for_seller_label: string | null
          id: string
          payment_terms_items: Json | null
          products: Json | null
          seller_address: string | null
          seller_date_label: string | null
          seller_date_value: string | null
          seller_name: string
          seller_name_label: string | null
          seller_name_value: string | null
          seller_registration: string | null
          seller_signature_label: string | null
          seller_signature_value: string | null
          seller_title_label: string | null
          seller_title_value: string | null
          shipping_left_label1: string | null
          shipping_left_label2: string | null
          shipping_left_label3: string | null
          shipping_left_value1: string | null
          shipping_left_value2: string | null
          shipping_left_value3: string | null
          shipping_right_label1: string | null
          shipping_right_label2: string | null
          shipping_right_label3: string | null
          shipping_right_value1: string | null
          shipping_right_value2: string | null
          shipping_right_value3: string | null
          status: string | null
          total_contract_value: number | null
          updated_at: string | null
        }
        Insert: {
          additional_shipping_terms?: string | null
          additional_shipping_terms_label?: string | null
          buyer_address?: string | null
          buyer_name: string
          buyer_registration?: string | null
          buyer_signature_date_label?: string | null
          buyer_signature_date_value?: string | null
          buyer_signature_label?: string | null
          buyer_signature_name_label?: string | null
          buyer_signature_name_value?: string | null
          buyer_signature_title_label?: string | null
          buyer_signature_title_value?: string | null
          buyer_signature_value?: string | null
          client_reference_id?: string | null
          coffee_certification?: string | null
          coffee_grade?: string | null
          coffee_origin?: string | null
          coffee_process?: string | null
          coffee_variety?: string | null
          company_stamp?: string | null
          contract_date: string
          contract_number: string
          created_at?: string | null
          cupping_score?: number | null
          currency?: string | null
          for_buyer_label?: string | null
          for_seller_label?: string | null
          id?: string
          payment_terms_items?: Json | null
          products?: Json | null
          seller_address?: string | null
          seller_date_label?: string | null
          seller_date_value?: string | null
          seller_name: string
          seller_name_label?: string | null
          seller_name_value?: string | null
          seller_registration?: string | null
          seller_signature_label?: string | null
          seller_signature_value?: string | null
          seller_title_label?: string | null
          seller_title_value?: string | null
          shipping_left_label1?: string | null
          shipping_left_label2?: string | null
          shipping_left_label3?: string | null
          shipping_left_value1?: string | null
          shipping_left_value2?: string | null
          shipping_left_value3?: string | null
          shipping_right_label1?: string | null
          shipping_right_label2?: string | null
          shipping_right_label3?: string | null
          shipping_right_value1?: string | null
          shipping_right_value2?: string | null
          shipping_right_value3?: string | null
          status?: string | null
          total_contract_value?: number | null
          updated_at?: string | null
        }
        Update: {
          additional_shipping_terms?: string | null
          additional_shipping_terms_label?: string | null
          buyer_address?: string | null
          buyer_name?: string
          buyer_registration?: string | null
          buyer_signature_date_label?: string | null
          buyer_signature_date_value?: string | null
          buyer_signature_label?: string | null
          buyer_signature_name_label?: string | null
          buyer_signature_name_value?: string | null
          buyer_signature_title_label?: string | null
          buyer_signature_title_value?: string | null
          buyer_signature_value?: string | null
          client_reference_id?: string | null
          coffee_certification?: string | null
          coffee_grade?: string | null
          coffee_origin?: string | null
          coffee_process?: string | null
          coffee_variety?: string | null
          company_stamp?: string | null
          contract_date?: string
          contract_number?: string
          created_at?: string | null
          cupping_score?: number | null
          currency?: string | null
          for_buyer_label?: string | null
          for_seller_label?: string | null
          id?: string
          payment_terms_items?: Json | null
          products?: Json | null
          seller_address?: string | null
          seller_date_label?: string | null
          seller_date_value?: string | null
          seller_name?: string
          seller_name_label?: string | null
          seller_name_value?: string | null
          seller_registration?: string | null
          seller_signature_label?: string | null
          seller_signature_value?: string | null
          seller_title_label?: string | null
          seller_title_value?: string | null
          shipping_left_label1?: string | null
          shipping_left_label2?: string | null
          shipping_left_label3?: string | null
          shipping_left_value1?: string | null
          shipping_left_value2?: string | null
          shipping_left_value3?: string | null
          shipping_right_label1?: string | null
          shipping_right_label2?: string | null
          shipping_right_label3?: string | null
          shipping_right_value1?: string | null
          shipping_right_value2?: string | null
          shipping_right_value3?: string | null
          status?: string | null
          total_contract_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      storage_tanks: {
        Row: {
          added_volume: number | null
          capacity: number
          cleaner_id: string | null
          created_at: string | null
          current_volume: number
          id: string
          initial_volume: number | null
          last_cleaned: string | null
          last_cleaned_at: string | null
          service_end_date: string | null
          status: string | null
          tank_name: string
          temperature: number | null
          updated_at: string | null
        }
        Insert: {
          added_volume?: number | null
          capacity: number
          cleaner_id?: string | null
          created_at?: string | null
          current_volume?: number
          id?: string
          initial_volume?: number | null
          last_cleaned?: string | null
          last_cleaned_at?: string | null
          service_end_date?: string | null
          status?: string | null
          tank_name: string
          temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          added_volume?: number | null
          capacity?: number
          cleaner_id?: string | null
          created_at?: string | null
          current_volume?: number
          id?: string
          initial_volume?: number | null
          last_cleaned?: string | null
          last_cleaned_at?: string | null
          service_end_date?: string | null
          status?: string | null
          tank_name?: string
          temperature?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tank_cleaning_records: {
        Row: {
          cleaner_id: string
          cleaning_date: string
          cleaning_time: string
          created_at: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["cleaning_status"] | null
          tank_id: string | null
          updated_at: string | null
        }
        Insert: {
          cleaner_id: string
          cleaning_date: string
          cleaning_time: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["cleaning_status"] | null
          tank_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cleaner_id?: string
          cleaning_date?: string
          cleaning_time?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["cleaning_status"] | null
          tank_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tank_volume_records: {
        Row: {
          added_volume: number | null
          created_by: string | null
          id: string
          initial_volume: number
          notes: string | null
          recorded_at: string | null
          tank_id: string | null
          temperature: number
          total_volume: number
        }
        Insert: {
          added_volume?: number | null
          created_by?: string | null
          id?: string
          initial_volume: number
          notes?: string | null
          recorded_at?: string | null
          tank_id?: string | null
          temperature: number
          total_volume: number
        }
        Update: {
          added_volume?: number | null
          created_by?: string | null
          id?: string
          initial_volume?: number
          notes?: string | null
          recorded_at?: string | null
          tank_id?: string | null
          temperature?: number
          total_volume?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          priority: string
          reminder_time: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority: string
          reminder_time?: string | null
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          reminder_time?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          bank_account: string
          created_at: string | null
          date: string
          id: string
          payee: string
          reason: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account: string
          created_at?: string | null
          date: string
          id?: string
          payee: string
          reason: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string
          created_at?: string | null
          date?: string
          id?: string
          payee?: string
          reason?: string
          type?: string
          updated_at?: string | null
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
      yogurt_cleaning_sanitation: {
        Row: {
          cleaning_agent: string
          created_at: string | null
          date_time: string
          equipment_id: string
          id: string
          operator_id: string
          remarks: string | null
          sanitation_check: boolean
          updated_at: string | null
        }
        Insert: {
          cleaning_agent: string
          created_at?: string | null
          date_time: string
          equipment_id: string
          id?: string
          operator_id: string
          remarks?: string | null
          sanitation_check: boolean
          updated_at?: string | null
        }
        Update: {
          cleaning_agent?: string
          created_at?: string | null
          date_time?: string
          equipment_id?: string
          id?: string
          operator_id?: string
          remarks?: string | null
          sanitation_check?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      yogurt_cooling_setting: {
        Row: {
          batch_id: string
          cooling_duration: number
          created_at: string | null
          date_time: string
          id: string
          operator_id: string
          setting_time: number
          target_temp: number
          texture_observations: string | null
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          cooling_duration: number
          created_at?: string | null
          date_time: string
          id?: string
          operator_id: string
          setting_time: number
          target_temp: number
          texture_observations?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          cooling_duration?: number
          created_at?: string | null
          date_time?: string
          id?: string
          operator_id?: string
          setting_time?: number
          target_temp?: number
          texture_observations?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      yogurt_culture_addition: {
        Row: {
          additives: string[] | null
          batch_id: string
          created_at: string | null
          culture_quantity: number
          culture_type: string
          date_time: string
          expected_duration: number
          id: string
          operator_id: string
          pre_fermentation_temp: number
          updated_at: string | null
          yogurt_type: string
        }
        Insert: {
          additives?: string[] | null
          batch_id: string
          created_at?: string | null
          culture_quantity: number
          culture_type: string
          date_time: string
          expected_duration: number
          id?: string
          operator_id: string
          pre_fermentation_temp: number
          updated_at?: string | null
          yogurt_type: string
        }
        Update: {
          additives?: string[] | null
          batch_id?: string
          created_at?: string | null
          culture_quantity?: number
          culture_type?: string
          date_time?: string
          expected_duration?: number
          id?: string
          operator_id?: string
          pre_fermentation_temp?: number
          updated_at?: string | null
          yogurt_type?: string
        }
        Relationships: []
      }
      yogurt_fermentation: {
        Row: {
          batch_id: string
          created_at: string | null
          id: string
          observations: string | null
          operator_id: string
          ph_readings: Json
          start_date_time: string
          target_temp: number
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          id?: string
          observations?: string | null
          operator_id: string
          ph_readings?: Json
          start_date_time: string
          target_temp: number
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          id?: string
          observations?: string | null
          operator_id?: string
          ph_readings?: Json
          start_date_time?: string
          target_temp?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      yogurt_inventory: {
        Row: {
          batch_id: string
          created_at: string | null
          expiry_date: string
          id: string
          package_size: string
          product_name: string
          production_date: string
          quantity: number
          status: string
          storage_location: string
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          expiry_date: string
          id?: string
          package_size: string
          product_name: string
          production_date: string
          quantity: number
          status?: string
          storage_location: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          package_size?: string
          product_name?: string
          production_date?: string
          quantity?: number
          status?: string
          storage_location?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      yogurt_milk_preparation: {
        Row: {
          batch_id: string
          created_at: string | null
          date_time: string
          homogenization_duration: number
          id: string
          milk_volume: number
          notes: string | null
          operator_id: string
          pre_standardization_fat: number
          target_fat: number
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          date_time: string
          homogenization_duration: number
          id?: string
          milk_volume: number
          notes?: string | null
          operator_id: string
          pre_standardization_fat: number
          target_fat: number
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          date_time?: string
          homogenization_duration?: number
          id?: string
          milk_volume?: number
          notes?: string | null
          operator_id?: string
          pre_standardization_fat?: number
          target_fat?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      yogurt_packaging: {
        Row: {
          batch_id: string
          created_at: string | null
          expiry_date: string
          id: string
          lot_number: string
          notes: string | null
          operator_id: string
          package_size: string
          packaging_date_time: string
          units_packaged: number
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          expiry_date: string
          id?: string
          lot_number: string
          notes?: string | null
          operator_id: string
          package_size: string
          packaging_date_time: string
          units_packaged: number
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          lot_number?: string
          notes?: string | null
          operator_id?: string
          package_size?: string
          packaging_date_time?: string
          units_packaged?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      yogurt_pasteurization: {
        Row: {
          batch_id: string
          cooling_temp: number
          created_at: string | null
          date_time: string
          holding_time: number
          id: string
          notes: string | null
          operator_id: string
          pasteurization_temp: number
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          cooling_temp: number
          created_at?: string | null
          date_time: string
          holding_time: number
          id?: string
          notes?: string | null
          operator_id: string
          pasteurization_temp: number
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          cooling_temp?: number
          created_at?: string | null
          date_time?: string
          holding_time?: number
          id?: string
          notes?: string | null
          operator_id?: string
          pasteurization_temp?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      yogurt_quality_testing: {
        Row: {
          appearance_score: number
          batch_id: string
          created_at: string | null
          id: string
          overall_rating: string
          ph_level: number
          remarks: string | null
          taste_score: number
          test_date_time: string
          tested_by: string
          texture_score: number
          titratable_acidity: number
          updated_at: string | null
        }
        Insert: {
          appearance_score: number
          batch_id: string
          created_at?: string | null
          id?: string
          overall_rating: string
          ph_level: number
          remarks?: string | null
          taste_score: number
          test_date_time: string
          tested_by: string
          texture_score: number
          titratable_acidity: number
          updated_at?: string | null
        }
        Update: {
          appearance_score?: number
          batch_id?: string
          created_at?: string | null
          id?: string
          overall_rating?: string
          ph_level?: number
          remarks?: string | null
          taste_score?: number
          test_date_time?: string
          tested_by?: string
          texture_score?: number
          titratable_acidity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_feature: {
        Args: {
          _feature_key: string
          _required_level?: string
          _user_id: string
        }
        Returns: {
          access_level: string
          can_access: boolean
          company: string
        }[]
      }
      get_roles_with_user_count: {
        Args: never
        Returns: {
          description: string
          display_name: string
          id: string
          is_active: boolean
          is_system_role: boolean
          role_key: string
          tier: string
          user_count: number
        }[]
      }
      get_user_accessible_features: {
        Args: { _user_id: string }
        Returns: {
          access_level: string
          category: string
          feature_key: string
          feature_name: string
          icon: string
          route_path: string
        }[]
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
        | "manager"
        | "staff"
      cleaning_status: "pending" | "in_progress" | "completed"
      product_type: "cheese" | "yogurt" | "milk" | "butter" | "cream" | "other"
      quality_status: "pending" | "approved" | "rejected"
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
        "manager",
        "staff",
      ],
      cleaning_status: ["pending", "in_progress", "completed"],
      product_type: ["cheese", "yogurt", "milk", "butter", "cream", "other"],
      quality_status: ["pending", "approved", "rejected"],
    },
  },
} as const
