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
          slug: string | null
          email: string | null
          avatar_url: string | null
          design_bg_color: string | null
          design_title_text: string | null
          design_subtitle_text: string | null
          design_title_color: string | null
          design_font: string | null
          design_card_style: string | null
        }
        Insert: {
          id?: string
          updated_at?: string | null
          shop_name?: string | null
          username?: string | null
          whatsapp?: string | null
          is_pro?: boolean | null
          slug?: string | null
          email?: string | null
          avatar_url?: string | null
          design_bg_color?: string | null
          design_title_text?: string | null
          design_subtitle_text?: string | null
          design_title_color?: string | null
          design_font?: string | null
          design_card_style?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          shop_name?: string | null
          username?: string | null
          whatsapp?: string | null
          is_pro?: boolean | null
          slug?: string | null
          email?: string | null
          avatar_url?: string | null
          design_bg_color?: string | null
          design_title_text?: string | null
          design_subtitle_text?: string | null
          design_title_color?: string | null
          design_font?: string | null
          design_card_style?: string | null
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
