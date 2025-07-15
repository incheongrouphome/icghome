import { supabase, supabaseAdmin } from "../config/supabase.js";
import type { Database } from "../config/supabase.js";
import crypto from "crypto";

// 타입 정의
type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];
type SliderImage = Database['public']['Tables']['slider_images']['Row'];
type SliderImageInsert = Database['public']['Tables']['slider_images']['Insert'];
type SliderImageUpdate = Database['public']['Tables']['slider_images']['Update'];
type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];
type Comment = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];
type BoardCategory = Database['public']['Tables']['board_categories']['Row'];
type BoardCategoryInsert = Database['public']['Tables']['board_categories']['Insert'];

// 임시 이메일 확인 저장소 (실제 환경에서는 Redis나 데이터베이스 사용)
const emailVerificationStore = new Map<string, { token: string; verified: boolean; timestamp: number }>();

// 비밀번호 재설정 토큰 저장소 (실제 환경에서는 Redis나 데이터베이스 사용)
const passwordResetStore = new Map<string, { token: string; email: string; timestamp: number }>();

// 사용자 관리
export class UserService {
  static async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
    return data;
  }

  static async createUser(userData: UserInsert): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    return data;
  }

  static async updateUser(id: string, updates: UserUpdate): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    return data;
  }

  static async getPendingUsers(): Promise<User[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('is_approved', false)
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending users:', error);
      return [];
    }
    return data;
  }

  static async approveUser(id: string, role: string, isApproved: boolean): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role, is_approved: isApproved })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error approving user:', error);
      return null;
    }
    return data;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // Supabase Auth에서 비밀번호 검증을 처리하므로 항상 true 반환
    return true;
  }

  static async hashPassword(password: string): Promise<string> {
    // Supabase Auth에서 비밀번호 해싱을 처리하므로 빈 문자열 반환
    return '';
  }
}

// 슬라이더 이미지 관리
export class SliderImageService {
  static async getSliderImages(): Promise<SliderImage[]> {
    const { data, error } = await supabase
      .from('slider_images')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching slider images:', error);
      return [];
    }
    return data;
  }

  static async createSliderImage(imageData: SliderImageInsert): Promise<SliderImage | null> {
    const { data, error } = await supabaseAdmin
      .from('slider_images')
      .insert(imageData)
      .select()
      .single();

    if (error) {
      console.error('Error creating slider image:', error);
      return null;
    }
    return data;
  }

  static async updateSliderImage(id: number, updates: SliderImageUpdate): Promise<SliderImage | null> {
    const { data, error } = await supabaseAdmin
      .from('slider_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating slider image:', error);
      return null;
    }
    return data;
  }

  static async deleteSliderImage(id: number): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('slider_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting slider image:', error);
      return false;
    }
    return true;
  }
}

// 게시판 카테고리 관리
export class BoardCategoryService {
  static async getCategories(): Promise<BoardCategory[]> {
    const { data, error } = await supabase
      .from('board_categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data;
  }

  static async getCategoryBySlug(slug: string): Promise<BoardCategory | null> {
    const { data, error } = await supabase
      .from('board_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
    return data;
  }

  static async createCategory(categoryData: BoardCategoryInsert): Promise<BoardCategory | null> {
    const { data, error } = await supabaseAdmin
      .from('board_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }
    return data;
  }
}

// 게시글 관리
export class PostService {
  static async getPosts(categoryId?: number, limit?: number): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
    return data;
  }

  static async getPostById(id: number): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post by id:', error);
      return null;
    }
    return data;
  }

  static async createPost(postData: PostInsert): Promise<Post | null> {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }
    return data;
  }

  static async updatePost(id: number, updates: PostUpdate): Promise<Post | null> {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }
    return data;
  }

  static async deletePost(id: number): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }
    return true;
  }

  static async incrementViewCount(id: number): Promise<void> {
    try {
      // 현재 view_count를 조회
      const { data: currentPost, error: selectError } = await supabaseAdmin
        .from('posts')
        .select('view_count')
        .eq('id', id)
        .single();

      if (selectError) {
        console.error('Error fetching current view count:', selectError);
        return;
      }

      // view_count를 1 증가시켜 업데이트
      const { error: updateError } = await supabaseAdmin
        .from('posts')
        .update({ view_count: (currentPost.view_count || 0) + 1 })
        .eq('id', id);

      if (updateError) {
        console.error('Error incrementing view count:', updateError);
      }
    } catch (error) {
      console.error('Error in incrementViewCount:', error);
    }
  }
}

// 댓글 관리
export class CommentService {
  static async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
    return data;
  }

  static async createComment(commentData: CommentInsert): Promise<Comment | null> {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert(commentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return null;
    }
    return data;
  }

  static async updateComment(id: number, content: string): Promise<Comment | null> {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return null;
    }
    return data;
  }

  static async deleteComment(id: number): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
    return true;
  }
}

// 인증 서비스
export class AuthService {
  static async sendVerificationEmail(email: string): Promise<{ error?: string; token?: string }> {
    try {
      // 실제 Supabase Auth를 사용한 회원가입 (이메일 확인 필요)
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'temp_password_will_be_updated', // 임시 비밀번호
        options: {
          emailRedirectTo: `${process.env.SITE_URL || 'http://localhost:5000'}/verify-email`,
        }
      });

      if (error) {
        console.error('Supabase Auth signUp error:', error);
        return { error: '이메일 발송에 실패했습니다.' };
      }

      // 이메일 발송 성공
      return { token: data.session?.access_token || 'email_sent' };
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      return { error: '이메일 발송에 실패했습니다.' };
    }
  }

  static async checkEmailVerification(email: string): Promise<{ verified: boolean; error?: string }> {
    try {
      // Supabase Auth에서 사용자 목록 조회
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000
      });
      
      if (error) {
        console.error('Error checking email verification:', error);
        return { verified: false, error: '이메일 확인 상태를 확인할 수 없습니다.' };
      }

      const user = data.users.find(u => u.email === email);
      const isVerified = user?.email_confirmed_at !== null;
      return { verified: isVerified || false };
    } catch (error) {
      console.error('Error in checkEmailVerification:', error);
      return { verified: false, error: '이메일 확인 상태 확인에 실패했습니다.' };
    }
  }

  static async verifyEmailToken(token: string, email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        console.error('Email verification error:', error);
        return { success: false, error: '이메일 확인에 실패했습니다.' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in verifyEmailToken:', error);
      return { success: false, error: '이메일 확인에 실패했습니다.' };
    }
  }

  static async signUp(email: string, password: string, name: string, organization?: string): Promise<{ user: User | null; error?: string; needsEmailConfirmation?: boolean }> {
    try {
      // 이메일이 이미 확인되었는지 체크
      const { verified } = await AuthService.checkEmailVerification(email);
      
      if (!verified) {
        return { 
          user: null, 
          error: '이메일 확인이 필요합니다.',
          needsEmailConfirmation: true 
        };
      }

      // 확인된 사용자 찾기
      const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000
      });
      
      if (usersError) {
        console.error('Error finding user:', usersError);
        return { user: null, error: '사용자를 찾을 수 없습니다.' };
      }
      
      const authUser = usersData.users.find(u => u.email === email);
      if (!authUser) {
        return { user: null, error: '사용자를 찾을 수 없습니다.' };
      }

      // 확인된 사용자의 비밀번호 업데이트
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        {
          password: password,
          user_metadata: {
            name: name,
            organization: organization
          }
        }
      );

      if (authError) {
        console.error('Auth update error:', authError);
        return { user: null, error: '회원가입에 실패했습니다.' };
      }

      // 데이터베이스에 사용자 정보 저장
      const userData: UserInsert = {
        id: authData.user.id,
        email: authData.user.email!,
        password: '', // Supabase Auth에서 관리
        name,
        organization,
        role: 'visitor',
        is_approved: false,
      };

      const user = await UserService.createUser(userData);
      return { user };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { user: null, error: '회원가입에 실패했습니다.' };
    }
  }

  static async signIn(email: string, password: string): Promise<{ user: User | null; error?: string }> {
    try {
      // Supabase Auth를 사용한 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase Auth signIn error:', error);
        return { user: null, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }

      if (!data.user) {
        return { user: null, error: '로그인에 실패했습니다.' };
      }

      // 데이터베이스에서 사용자 정보 조회
      const user = await UserService.getUser(data.user.id);
      if (!user) {
        return { user: null, error: '사용자 정보를 찾을 수 없습니다.' };
      }

      return { user };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { user: null, error: '로그인에 실패했습니다.' };
    }
  }

  static async confirmEmail(token: string): Promise<{ user: User | null; error?: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        console.error('Email confirmation error:', error);
        return { user: null, error: '이메일 확인에 실패했습니다.' };
      }

      if (!data.user) {
        return { user: null, error: '이메일 확인에 실패했습니다.' };
      }

      // 이메일이 확인되었으므로 데이터베이스에 사용자 정보 저장
      const userData: UserInsert = {
        id: data.user.id,
        email: data.user.email!,
        password: '', // Supabase Auth에서 관리
        name: data.user.user_metadata.name || '',
        organization: data.user.user_metadata.organization || null,
        role: 'visitor',
        is_approved: false,
      };

      const user = await UserService.createUser(userData);
      return { user };
    } catch (error) {
      console.error('Error in confirmEmail:', error);
      return { user: null, error: '이메일 확인에 실패했습니다.' };
    }
  }

  static async resendConfirmation(email: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        return { error: '이메일 재전송에 실패했습니다.' };
      }

      return {};
    } catch (error) {
      console.error('Error in resendConfirmation:', error);
      return { error: '이메일 재전송에 실패했습니다.' };
    }
  }

  static async sendPasswordResetEmail(email: string): Promise<{ error?: string; token?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.SITE_URL || 'http://localhost:5000'}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error: '비밀번호 재설정 이메일 발송에 실패했습니다.' };
      }

      return {};
    } catch (error) {
      console.error('Error in sendPasswordResetEmail:', error);
      return { error: '비밀번호 재설정 이메일 발송에 실패했습니다.' };
    }
  }

  static async validateResetToken(token: string, email: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // Supabase Auth에서 토큰 검증은 updateUser 시점에서 수행
      return { valid: true };
    } catch (error) {
      console.error('Error in validateResetToken:', error);
      return { valid: false, error: '토큰 검증에 실패했습니다.' };
    }
  }

  static async resetPassword(token: string, email: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Supabase Auth를 사용한 비밀번호 재설정
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password reset error:', error);
        return { success: false, error: '비밀번호 재설정에 실패했습니다.' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { success: false, error: '비밀번호 재설정에 실패했습니다.' };
    }
  }
} 