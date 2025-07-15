import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-role-key';

// 환경 변수 검증
if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  console.error('Supabase configuration missing. Please set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_KEY in your environment variables.');
  process.exit(1);
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 서버 사이드용 클라이언트 (관리자 권한)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          profile_image_url: string | null
          role: string
          is_approved: boolean
          organization: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          password: string
          name: string
          profile_image_url?: string | null
          role?: string
          is_approved?: boolean
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          profile_image_url?: string | null
          role?: string
          is_approved?: boolean
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      board_categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          requires_auth: boolean
          requires_approval: boolean
          allowed_roles: string[] | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          requires_auth?: boolean
          requires_approval?: boolean
          allowed_roles?: string[] | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          requires_auth?: boolean
          requires_approval?: boolean
          allowed_roles?: string[] | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          title: string
          content: string
          author_id: string | null
          category_id: number | null
          is_notice: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          author_id?: string | null
          category_id?: number | null
          is_notice?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          author_id?: string | null
          category_id?: number | null
          is_notice?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: number
          content: string
          author_id: string | null
          post_id: number | null
          parent_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          content: string
          author_id?: string | null
          post_id?: number | null
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          content?: string
          author_id?: string | null
          post_id?: number | null
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      slider_images: {
        Row: {
          id: number
          title: string
          image_url: string
          alt_text: string | null
          is_active: boolean
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          image_url: string
          alt_text?: string | null
          is_active?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          image_url?: string
          alt_text?: string | null
          is_active?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
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
  }
} 