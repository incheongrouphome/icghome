import {
  users,
  boardCategories,
  posts,
  comments,
  type User,
  type UpsertUser,
  type BoardCategory,
  type InsertBoardCategory,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type PostWithAuthor,
  type CommentWithAuthor,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, inArray, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: string, isApproved: boolean): Promise<User>;
  getPendingUsers(): Promise<User[]>;
  
  // Board category operations
  getBoardCategories(): Promise<BoardCategory[]>;
  getBoardCategory(slug: string): Promise<BoardCategory | undefined>;
  createBoardCategory(category: InsertBoardCategory): Promise<BoardCategory>;
  
  // Post operations
  getPosts(categoryId?: number, limit?: number): Promise<PostWithAuthor[]>;
  getPost(id: number): Promise<PostWithAuthor | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;
  incrementViewCount(postId: number): Promise<void>;
  
  // Comment operations
  getCommentsByPost(postId: number): Promise<CommentWithAuthor[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(userId: string, role: string, isApproved: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, isApproved, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getPendingUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(and(eq(users.role, "member"), eq(users.isApproved, false)))
      .orderBy(desc(users.createdAt));
  }

  // Board category operations
  async getBoardCategories(): Promise<BoardCategory[]> {
    return await db.select().from(boardCategories).orderBy(boardCategories.id);
  }

  async getBoardCategory(slug: string): Promise<BoardCategory | undefined> {
    const [category] = await db
      .select()
      .from(boardCategories)
      .where(eq(boardCategories.slug, slug));
    return category;
  }

  async createBoardCategory(category: InsertBoardCategory): Promise<BoardCategory> {
    const [newCategory] = await db
      .insert(boardCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Post operations
  async getPosts(categoryId?: number, limit: number = 10): Promise<PostWithAuthor[]> {
    const query = db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        isNotice: posts.isNotice,
        viewCount: posts.viewCount,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
          isApproved: users.isApproved,
          organization: users.organization,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        category: {
          id: boardCategories.id,
          name: boardCategories.name,
          slug: boardCategories.slug,
          description: boardCategories.description,
          requiresAuth: boardCategories.requiresAuth,
          requiresApproval: boardCategories.requiresApproval,
          allowedRoles: boardCategories.allowedRoles,
          createdAt: boardCategories.createdAt,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(boardCategories, eq(posts.categoryId, boardCategories.id))
      .orderBy(desc(posts.isNotice), desc(posts.createdAt))
      .limit(limit);

    if (categoryId) {
      query.where(eq(posts.categoryId, categoryId));
    }

    return await query;
  }

  async getPost(id: number): Promise<PostWithAuthor | undefined> {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        isNotice: posts.isNotice,
        viewCount: posts.viewCount,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
          isApproved: users.isApproved,
          organization: users.organization,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        category: {
          id: boardCategories.id,
          name: boardCategories.name,
          slug: boardCategories.slug,
          description: boardCategories.description,
          requiresAuth: boardCategories.requiresAuth,
          requiresApproval: boardCategories.requiresApproval,
          allowedRoles: boardCategories.allowedRoles,
          createdAt: boardCategories.createdAt,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(boardCategories, eq(posts.categoryId, boardCategories.id))
      .where(eq(posts.id, id));

    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async incrementViewCount(postId: number): Promise<void> {
    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, postId));
  }

  // Comment operations
  async getCommentsByPost(postId: number): Promise<CommentWithAuthor[]> {
    return await db
      .select({
        id: comments.id,
        content: comments.content,
        authorId: comments.authorId,
        postId: comments.postId,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
          isApproved: users.isApproved,
          organization: users.organization,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }
}

export const storage = new DatabaseStorage();
