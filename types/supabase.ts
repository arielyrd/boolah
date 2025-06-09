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
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      fields: {
        Row: {
          id: string
          name: string
          sport_type: string
          location: string
          description: string | null
          price_per_hour: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sport_type: string
          location: string
          description?: string | null
          price_per_hour: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sport_type?: string
          location?: string
          description?: string | null
          price_per_hour?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      field_amenities: {
        Row: {
          id: string
          field_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          field_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          field_id?: string
          name?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          field_id: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          status: string
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          field_id: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          status?: string
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          field_id?: string
          user_id?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: string
          total_price?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}