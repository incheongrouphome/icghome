import { supabase, supabaseAdmin } from "../config/supabase";
import type { Database } from "../config/supabase";
import bcrypt from "bcryptjs";

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
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Password hashing failed');
    }
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
    const { error } = await supabaseAdmin
      .from('posts')
      .update({ view_count: supabaseAdmin.raw('view_count + 1') })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing view count:', error);
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
  static async signUp(email: string, password: string, firstName: string, lastName: string, organization?: string): Promise<{ user: User | null; error?: string }> {
    try {
      // 이메일 중복 확인
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser) {
        return { user: null, error: '이미 등록된 이메일입니다.' };
      }

      // 비밀번호 해싱
      const hashedPassword = await UserService.hashPassword(password);

      // 사용자 생성
      const userData: UserInsert = {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
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
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return { user: null, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }

      const isPasswordValid = await UserService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return { user: null, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }

      return { user };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { user: null, error: '로그인에 실패했습니다.' };
    }
  }
} 