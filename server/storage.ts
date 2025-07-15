import {
  users,
  boardCategories,
  posts,
  comments,
  sliderImages,
  attachments,
  type User,
  type UpsertUser,
  type BoardCategory,
  type InsertBoardCategory,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type SliderImage,
  type InsertSliderImage,
  type Attachment,
  type InsertAttachment,
  type PostWithAuthor,
  type CommentWithAuthor,
  type PublicUser,
  type SignupData,
} from "@shared/schema";
import { db } from "./db.js";
import { eq, desc, and, or, inArray, sql } from "drizzle-orm";
import { generateUserId, hashPassword } from "./auth.js";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  findUserByNameAndOrganization(name: string, organization?: string): Promise<User | undefined>;
  createUser(userData: SignupData): Promise<PublicUser>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
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
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, updates: Partial<InsertComment>): Promise<Comment>;
  deleteComment(id: number): Promise<void>;
  
  // Slider image operations
  getSliderImages(): Promise<SliderImage[]>;
  createSliderImage(image: InsertSliderImage): Promise<SliderImage>;
  updateSliderImage(id: number, updates: Partial<InsertSliderImage>): Promise<SliderImage>;
  deleteSliderImage(id: number): Promise<void>;
  
  // Attachment operations
  getAttachmentsByPost(postId: number): Promise<Attachment[]>;
  getAttachment(id: number): Promise<Attachment | undefined>;
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  updateAttachment(id: number, updates: Partial<InsertAttachment>): Promise<Attachment>;
  deleteAttachment(id: number): Promise<void>;
  updateAttachmentPostId(filename: string, postId: number): Promise<void>;
}

// 개발환경용 Mock Storage
export class MockStorage implements IStorage {
  // 정적 변수로 모든 인스턴스가 같은 데이터를 공유하도록 함
  private static mockComments: CommentWithAuthor[] = [];
  private static nextCommentId = 1;
  
  private mockUsers: User[] = [
    {
      id: 'admin_001',
      email: 'admin@example.com',
      password: '$2b$10$A9JdpaIyCd.jxlWWFxB44.ZnhaE7EF3doltKH0xUbE9Gkgky6ywIq', // password123
      name: '관리자',
      profileImageUrl: null,
      role: 'admin',
      isApproved: true,
      organization: '한국아동청소년그룹홈협의회',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private mockPendingUsers: User[] = [
    {
      id: 'user_001',
      email: 'user1@example.com',
      password: '$2b$10$A9JdpaIyCd.jxlWWFxB44.ZnhaE7EF3doltKH0xUbE9Gkgky6ywIq', // password123
      name: '홍길동',
      profileImageUrl: null,
      role: 'visitor',
      isApproved: false,
      organization: '테스트 기관',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'user_002',
      email: 'user2@example.com',
      password: '$2b$10$A9JdpaIyCd.jxlWWFxB44.ZnhaE7EF3doltKH0xUbE9Gkgky6ywIq', // password123
      name: '김영희',
      profileImageUrl: null,
      role: 'visitor',
      isApproved: false,
      organization: '사회복지법인 테스트',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private mockApprovedUsers: User[] = [
    {
      id: 'approved_001',
      email: 'user@example.com',
      password: '$2b$10$A9JdpaIyCd.jxlWWFxB44.ZnhaE7EF3doltKH0xUbE9Gkgky6ywIq', // password123
      name: '이승민',
      profileImageUrl: null,
      role: 'member',
      isApproved: true,
      organization: '승인된 기관',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private mockCategories: BoardCategory[] = [
    {
      id: 1,
      name: '회원 공지사항',
      slug: 'member-notices',
      description: '회원을 위한 중요 공지사항',
      requiresAuth: true,
      requiresApproval: false,
      allowedRoles: ['admin', 'member'],
      createdAt: new Date(),
    },
    {
      id: 2,
      name: '소통공간',
      slug: 'communication',
      description: '회원 간 자유로운 소통 공간',
      requiresAuth: true,
      requiresApproval: true,
      allowedRoles: ['admin', 'member'],
      createdAt: new Date(),
    },
    {
      id: 3,
      name: '사업신청',
      slug: 'business-application',
      description: '각종 사업 신청 및 관련 공지',
      requiresAuth: true,
      requiresApproval: true,
      allowedRoles: ['admin', 'member'],
      createdAt: new Date(),
    },
    {
      id: 4,
      name: '일반 공지사항',
      slug: 'general-notices',
      description: '일반인을 위한 공지사항',
      requiresAuth: false,
      requiresApproval: false,
      allowedRoles: ['admin'],
      createdAt: new Date(),
    },
    {
      id: 5,
      name: '채용공고',
      slug: 'job-postings',
      description: '채용 관련 공고',
      requiresAuth: false,
      requiresApproval: false,
      allowedRoles: ['admin'],
      createdAt: new Date(),
    },
  ];

  private mockPosts: PostWithAuthor[] = [
    {
      id: 1,
      title: '회원 공지사항 테스트 글',
      content: '회원 공지사항 테스트 내용입니다.',
      authorId: 'admin_001',
      categoryId: 1,
      isNotice: true,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: 'admin_001',
        email: 'admin@example.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        name: '관리자',
        profileImageUrl: null,
        role: 'admin',
        isApproved: true,
        organization: '한국아동청소년그룹홈협의회',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      category: this.mockCategories[0],
    },
  ];

  private mockSliderImages: SliderImage[] = [
    {
      id: 1,
      title: '메인 슬라이드 1',
      imageUrl: '/img/메인이미지 (1).png',
      altText: '한국아동청소년그룹홈협의회 인천지부 메인 이미지',
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];



  async getUser(id: string): Promise<User | undefined> {
    console.log(`Mock: getUser called with id: ${id}`);
    const allUsers = [...this.mockUsers, ...this.mockPendingUsers, ...this.mockApprovedUsers];
    return allUsers.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`Mock: getUserByEmail called with email: ${email}`);
    const allUsers = [...this.mockUsers, ...this.mockPendingUsers, ...this.mockApprovedUsers];
    return allUsers.find(user => user.email === email);
  }

  async findUserByNameAndOrganization(name: string, organization?: string): Promise<User | undefined> {
    console.log(`Mock: findUserByNameAndOrganization called with name: ${name}, organization: ${organization}`);
    const allUsers = [...this.mockUsers, ...this.mockPendingUsers, ...this.mockApprovedUsers];
    
    return allUsers.find(user => {
      const nameMatch = user.name.toLowerCase().includes(name.toLowerCase());
      const organizationMatch = organization 
        ? user.organization?.toLowerCase().includes(organization.toLowerCase()) 
        : true;
      
      return nameMatch && organizationMatch;
    });
  }

  async createUser(userData: SignupData): Promise<PublicUser> {
    console.log(`Mock: createUser called with:`, userData);
    const hashedPassword = await hashPassword(userData.password);
    const newUser: User = {
      id: generateUserId(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      profileImageUrl: null,
      role: 'visitor',
      isApproved: false,
      organization: userData.organization || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.mockPendingUsers.push(newUser);
    
    // 패스워드 제거한 공개 사용자 정보 반환
    const { password, ...publicUser } = newUser;
    return publicUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    console.log(`Mock: upsertUser called with:`, userData);
    return {
      id: userData.id || 'mock-user-id',
      email: userData.email || 'mock@example.com',
      password: userData.password || 'hashed-password',
      name: userData.name || 'Mock User',
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || 'visitor',
      isApproved: userData.isApproved || false,
      organization: userData.organization || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    console.log(`Mock: updateUser called with id: ${id}, updates:`, updates);
    const allUsers = [...this.mockUsers, ...this.mockPendingUsers, ...this.mockApprovedUsers];
    const userIndex = allUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = allUsers[userIndex];
    Object.assign(user, updates);
    user.updatedAt = new Date();
    
    return user;
  }

  async updateUserRole(userId: string, role: string, isApproved: boolean): Promise<User> {
    console.log(`Mock: updateUserRole called with: ${userId}, ${role}, ${isApproved}`);
    const allUsers = [...this.mockUsers, ...this.mockPendingUsers];
    const userIndex = allUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = allUsers[userIndex];
    user.role = role;
    user.isApproved = isApproved;
    user.updatedAt = new Date();
    
    // 승인되면 정식 사용자로 이동
    if (isApproved && role === 'member') {
      const pendingIndex = this.mockPendingUsers.findIndex(u => u.id === userId);
      if (pendingIndex !== -1) {
        this.mockPendingUsers.splice(pendingIndex, 1);
        this.mockUsers.push(user);
      }
    }
    
    return user;
  }

  async getPendingUsers(): Promise<User[]> {
    console.log(`Mock: getPendingUsers called`);
    return this.mockPendingUsers.filter(user => !user.isApproved);
  }

  async getBoardCategories(): Promise<BoardCategory[]> {
    console.log(`Mock: getBoardCategories called`);
    return this.mockCategories;
  }

  async getBoardCategory(slug: string): Promise<BoardCategory | undefined> {
    console.log(`Mock: getBoardCategory called with slug: ${slug}`);
    return this.mockCategories.find(cat => cat.slug === slug);
  }

  async createBoardCategory(category: InsertBoardCategory): Promise<BoardCategory> {
    console.log(`Mock: createBoardCategory called with:`, category);
    return {
      id: 1,
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      requiresAuth: category.requiresAuth || false,
      requiresApproval: category.requiresApproval || false,
      allowedRoles: category.allowedRoles || null,
      createdAt: new Date(),
    };
  }

  async getPosts(categoryId?: number, limit: number = 10): Promise<PostWithAuthor[]> {
    console.log(`Mock: getPosts called with categoryId: ${categoryId}, limit: ${limit}`);
    let filteredPosts = this.mockPosts;
    
    if (categoryId) {
      filteredPosts = this.mockPosts.filter(post => post.categoryId === categoryId);
    }
    
    // 공지사항을 상단에 오도록 정렬 (isNotice DESC, createdAt DESC)
    filteredPosts.sort((a, b) => {
      if (a.isNotice && !b.isNotice) return -1;
      if (!a.isNotice && b.isNotice) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return filteredPosts.slice(0, limit);
  }

  async getPost(id: number): Promise<PostWithAuthor | undefined> {
    console.log(`Mock: getPost called with id: ${id}`);
    return this.mockPosts.find(post => post.id === id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    console.log(`Mock: createPost called with:`, post);
    const newPost = {
      id: this.mockPosts.length + 1,
      title: post.title,
      content: post.content,
      authorId: post.authorId || null,
      categoryId: post.categoryId ?? null,
      isNotice: post.isNotice || false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Also add to mock posts array for consistent behavior
    const author = this.mockUsers.find(u => u.id === post.authorId) || {
      id: post.authorId || 'unknown',
      email: 'test@example.com',
      password: 'hashed-password',
      name: '테스트 사용자',
      profileImageUrl: null,
      role: 'member',
      isApproved: true,
      organization: '테스트 기관',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const category = this.mockCategories.find(cat => cat.id === (post.categoryId ?? null)) || null;
    
    this.mockPosts.push({
      ...newPost,
      categoryId: newPost.categoryId ?? null,
      author,
      category,
    });
    
    return newPost;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post> {
    console.log(`Mock: updatePost called with id: ${id}, updates:`, updates);
    return {
      id,
      title: updates.title || 'Mock Title',
      content: updates.content || 'Mock Content',
      authorId: updates.authorId ?? null,
      categoryId: updates.categoryId ?? null,
      isNotice: updates.isNotice || false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async deletePost(id: number): Promise<void> {
    console.log(`Mock: deletePost called with id: ${id}`);
  }

  async incrementViewCount(postId: number): Promise<void> {
    console.log(`Mock: incrementViewCount called with postId: ${postId}`);
  }

  async getCommentsByPost(postId: number): Promise<CommentWithAuthor[]> {
    console.log(`Mock: getCommentsByPost called with postId: ${postId}`);
    console.log(`Mock: Current total comments in storage: ${MockStorage.mockComments.length}`);
    console.log(`Mock: All comments:`, MockStorage.mockComments);
    const filtered = MockStorage.mockComments.filter(comment => comment.postId === postId);
    console.log(`Mock: Filtered comments for postId ${postId}:`, filtered);
    return filtered;
  }

  async getComment(id: number): Promise<Comment | undefined> {
    console.log(`Mock: getComment called with id: ${id}`);
    return MockStorage.mockComments.find(comment => comment.id === id);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    console.log(`Mock: createComment called with:`, comment);
    console.log(`Mock: Current comments before creation:`, MockStorage.mockComments.length);
    
    const author = await this.getUser(comment.authorId || '');
    console.log(`Mock: Found author:`, author);
    
    const newComment: CommentWithAuthor = {
      id: MockStorage.nextCommentId++,
      content: comment.content,
      authorId: comment.authorId ?? null,
      postId: comment.postId ?? null,
      parentId: comment.parentId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: author || null,
    };
    
    console.log(`Mock: New comment to be stored:`, newComment);
    MockStorage.mockComments.push(newComment);
    console.log(`Mock: Comment created and stored. Total comments: ${MockStorage.mockComments.length}`);
    console.log(`Mock: All comments:`, MockStorage.mockComments);
    
    return newComment;
  }

  async updateComment(id: number, updates: Partial<InsertComment>): Promise<Comment> {
    console.log(`Mock: updateComment called with id: ${id}, updates:`, updates);
    
    const commentIndex = MockStorage.mockComments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      throw new Error(`Comment with id ${id} not found`);
    }
    
    const existingComment = MockStorage.mockComments[commentIndex];
    const updatedComment: CommentWithAuthor = {
      ...existingComment,
      ...updates,
      id: id,
      updatedAt: new Date(),
    };
    
    MockStorage.mockComments[commentIndex] = updatedComment;
    return updatedComment;
  }

  async deleteComment(id: number): Promise<void> {
    console.log(`Mock: deleteComment called with id: ${id}`);
    const commentIndex = MockStorage.mockComments.findIndex(comment => comment.id === id);
    if (commentIndex !== -1) {
      MockStorage.mockComments.splice(commentIndex, 1);
      console.log(`Mock: Comment deleted. Total comments: ${MockStorage.mockComments.length}`);
    }
  }

  // Slider image operations
  async getSliderImages(): Promise<SliderImage[]> {
    console.log(`Mock: getSliderImages called`);
    return this.mockSliderImages;
  }

  async createSliderImage(image: InsertSliderImage): Promise<SliderImage> {
    console.log(`Mock: createSliderImage called with:`, image);
    const newImage = {
      id: this.mockSliderImages.length + 1,
      title: image.title,
      imageUrl: image.imageUrl,
      altText: image.altText || null,
      isActive: image.isActive || true,
      order: image.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockSliderImages.push(newImage);
    return newImage;
  }

  async updateSliderImage(id: number, updates: Partial<InsertSliderImage>): Promise<SliderImage> {
    console.log(`Mock: updateSliderImage called with id: ${id}, updates:`, updates);
    const index = this.mockSliderImages.findIndex(img => img.id === id);
    if (index !== -1) {
      this.mockSliderImages[index] = {
        ...this.mockSliderImages[index],
        ...updates,
        updatedAt: new Date(),
      };
      return this.mockSliderImages[index];
    }
    throw new Error('Slider image not found');
  }

  async deleteSliderImage(id: number): Promise<void> {
    console.log(`Mock: deleteSliderImage called with id: ${id}`);
    const index = this.mockSliderImages.findIndex(img => img.id === id);
    if (index !== -1) {
      this.mockSliderImages.splice(index, 1);
    }
  }

  // Attachment operations
  async getAttachmentsByPost(postId: number): Promise<Attachment[]> {
    return []; // Mock implementation
  }

  async getAttachment(id: number): Promise<Attachment | undefined> {
    return undefined; // Mock implementation
  }

  async createAttachment(attachment: InsertAttachment): Promise<Attachment> {
    const newAttachment: Attachment = {
      id: Date.now(),
      ...attachment,
      postId: attachment.postId ?? null,
      isImage: attachment.isImage ?? null,
      createdAt: new Date(),
    };
    return newAttachment;
  }

  async updateAttachment(id: number, updates: Partial<InsertAttachment>): Promise<Attachment> {
    // Mock implementation
    return { id, ...updates } as Attachment;
  }

  async deleteAttachment(id: number): Promise<void> {
    // Mock implementation
  }

  async updateAttachmentPostId(filename: string, postId: number): Promise<void> {
    // Mock implementation
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not connected");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not connected");
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findUserByNameAndOrganization(name: string, organization?: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not connected");
    
    const conditions = [
      sql`LOWER(${users.name}) LIKE LOWER(${`%${name}%`})`
    ];
    
    if (organization) {
      conditions.push(
        sql`LOWER(${users.organization}) LIKE LOWER(${`%${organization}%`})`
      );
    }
    
    const [user] = await db.select().from(users).where(and(...conditions));
    return user;
  }

  async createUser(userData: SignupData): Promise<PublicUser> {
    if (!db) throw new Error("Database not connected");
    const hashedPassword = await hashPassword(userData.password);
    const [newUser] = await db.insert(users).values({
      id: generateUserId(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      organization: userData.organization || null,
      role: 'visitor',
      isApproved: false,
    }).returning();
    
    // 패스워드 제거한 공개 사용자 정보 반환
    const { password, ...publicUser } = newUser;
    return publicUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!db) throw new Error("Database not connected");
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

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!db) throw new Error("Database not connected");
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserRole(userId: string, role: string, isApproved: boolean): Promise<User> {
    if (!db) throw new Error("Database not connected");
    const [user] = await db
      .update(users)
      .set({ role, isApproved, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getPendingUsers(): Promise<User[]> {
    if (!db) throw new Error("Database not connected");
    return await db
      .select()
      .from(users)
      .where(eq(users.isApproved, false))
      .orderBy(desc(users.createdAt));
  }

  // Board category operations
  async getBoardCategories(): Promise<BoardCategory[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(boardCategories).orderBy(boardCategories.id);
  }

  async getBoardCategory(slug: string): Promise<BoardCategory | undefined> {
    if (!db) throw new Error("Database not connected");
    const [category] = await db
      .select()
      .from(boardCategories)
      .where(eq(boardCategories.slug, slug));
    return category;
  }

  async createBoardCategory(category: InsertBoardCategory): Promise<BoardCategory> {
    if (!db) throw new Error("Database not connected");
    const [newCategory] = await db
      .insert(boardCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Post operations
  async getPosts(categoryId?: number, limit: number = 10): Promise<PostWithAuthor[]> {
    if (!db) throw new Error("Database not connected");
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
          password: users.password,
          name: users.name,
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
    if (!db) throw new Error("Database not connected");
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
          password: users.password,
          name: users.name,
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
    if (!db) throw new Error("Database not connected");
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post> {
    if (!db) throw new Error("Database not connected");
    const [updatedPost] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db.delete(posts).where(eq(posts.id, id));
  }

  async incrementViewCount(postId: number): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, postId));
  }

  // Comment operations
  async getCommentsByPost(postId: number): Promise<CommentWithAuthor[]> {
    if (!db) throw new Error("Database not connected");
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
          password: users.password,
          name: users.name,
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

  async getComment(id: number): Promise<Comment | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db.select().from(comments).where(eq(comments.id, id));
    return result[0];
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    if (!db) throw new Error("Database not connected");
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async updateComment(id: number, updates: Partial<InsertComment>): Promise<Comment> {
    if (!db) throw new Error("Database not connected");
    const [updatedComment] = await db
      .update(comments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return updatedComment;
  }

  async deleteComment(id: number): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db.delete(comments).where(eq(comments.id, id));
  }

  // Slider image operations
  async getSliderImages(): Promise<SliderImage[]> {
    if (!db) throw new Error("Database not connected");
    return await db
      .select()
      .from(sliderImages)
      .where(eq(sliderImages.isActive, true))
      .orderBy(sliderImages.order, sliderImages.createdAt);
  }

  async createSliderImage(image: InsertSliderImage): Promise<SliderImage> {
    if (!db) throw new Error("Database not connected");
    const [newImage] = await db.insert(sliderImages).values(image).returning();
    return newImage;
  }

  async updateSliderImage(id: number, updates: Partial<InsertSliderImage>): Promise<SliderImage> {
    if (!db) throw new Error("Database not connected");
    const [updatedImage] = await db
      .update(sliderImages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(sliderImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteSliderImage(id: number): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db.delete(sliderImages).where(eq(sliderImages.id, id));
  }

  // Attachment operations
  async getAttachmentsByPost(postId: number): Promise<Attachment[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(attachments).where(eq(attachments.postId, postId));
  }

  async getAttachment(id: number): Promise<Attachment | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db.select().from(attachments).where(eq(attachments.id, id));
    return result[0];
  }

  async createAttachment(attachment: InsertAttachment): Promise<Attachment> {
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(attachments).values(attachment).returning();
    return result[0];
  }

  async updateAttachment(id: number, updates: Partial<InsertAttachment>): Promise<Attachment> {
    if (!db) throw new Error("Database not connected");
    const result = await db.update(attachments).set(updates).where(eq(attachments.id, id)).returning();
    return result[0];
  }

  async deleteAttachment(id: number): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db.delete(attachments).where(eq(attachments.id, id));
  }

  async updateAttachmentPostId(filename: string, postId: number): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db.update(attachments).set({ postId }).where(eq(attachments.filename, filename));
  }
}

// 개발환경에서는 MockStorage 사용, 프로덕션에서는 DatabaseStorage 사용
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MockStorage();
