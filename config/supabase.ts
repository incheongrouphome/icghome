import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  console.error('Supabase configuration missing. Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
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
  supabaseServiceKey,
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