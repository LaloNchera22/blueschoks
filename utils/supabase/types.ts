import { DesignConfig, ProductStyle } from '@/lib/types/design-system'
import { ThemeConfig } from '@/lib/types/theme-config'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          shop_name: string | null
          username: string | null
          whatsapp: string | null
          is_pro: boolean | null
          subscription_end_date: string | null
          slug: string | null
          email: string | null
          avatar_url: string | null
          design_bg_color: string | null
          design_title_text: string | null
          design_subtitle_text: string | null
          design_title_color: string | null
          design_font: string | null
          design_card_style: string | null
          design_config: DesignConfig | null
          theme_config: ThemeConfig | null
        }
        Insert: {
          id?: string
          updated_at?: string | null
          shop_name?: string | null
          username?: string | null
          whatsapp?: string | null
          is_pro?: boolean | null
          subscription_end_date?: string | null
          slug?: string | null
          email?: string | null
          avatar_url?: string | null
          design_bg_color?: string | null
          design_title_text?: string | null
          design_subtitle_text?: string | null
          design_title_color?: string | null
          design_font?: string | null
          design_card_style?: string | null
          design_config?: DesignConfig | null
          theme_config?: ThemeConfig | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          shop_name?: string | null
          username?: string | null
          whatsapp?: string | null
          is_pro?: boolean | null
          subscription_end_date?: string | null
          slug?: string | null
          email?: string | null
          avatar_url?: string | null
          design_bg_color?: string | null
          design_title_text?: string | null
          design_subtitle_text?: string | null
          design_title_color?: string | null
          design_font?: string | null
          design_card_style?: string | null
          design_config?: DesignConfig | null
          theme_config?: ThemeConfig | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          price: number
          description: string | null
          image_url: string | null
          images: string[] | null
          stock: number
          style_config: ProductStyle | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          price: number
          description?: string | null
          image_url?: string | null
          images?: string[] | null
          stock?: number
          style_config?: ProductStyle | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          price?: number
          description?: string | null
          image_url?: string | null
          images?: string[] | null
          stock?: number
          style_config?: ProductStyle | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          shop_name: string | null
          slug: string | null
          whatsapp: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          shop_name?: string | null
          slug?: string | null
          whatsapp?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          owner_id?: string
          shop_name?: string | null
          slug?: string | null
          whatsapp?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
