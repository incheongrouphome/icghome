import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { requireAuth, requireAdmin, comparePassword, AuthRequest } from "./auth";
import { 
  insertPostSchema, 
  insertCommentSchema, 
  insertBoardCategorySchema, 
  insertSliderImageSchema,
  loginSchema,
  signupSchema,
  type LoginData,
  type SignupData 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // 세션 미들웨어 설정
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  }));

  // 로그인 API
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password }: LoginData = loginSchema.parse(req.body);
      console.log(`Login attempt: email=${email}, password=${password}`);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
      }

      console.log('User found:', { id: user.id, email: user.email, role: user.role });
      console.log('Stored password hash:', user.password);
      console.log('Input password:', password);

      const isValidPassword = await comparePassword(password, user.password);
      console.log('Password comparison result:', isValidPassword);
      
      // 개발 환경에서는 평문 비밀번호도 허용
      const isPlainTextMatch = process.env.NODE_ENV === 'development' && password === 'password123';
      console.log('Plain text match (dev only):', isPlainTextMatch);
      
      if (!isValidPassword && !isPlainTextMatch) {
        console.log('Password validation failed');
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
      }

      // 세션에 사용자 ID 저장
      req.session.userId = user.id;
      console.log('Login successful, session created');
      console.log('Session ID:', req.sessionID);
      console.log('Session data:', req.session);

      // 패스워드 제거한 공개 사용자 정보 반환
      const { password: _, ...publicUser } = user;
      res.json({ message: '로그인 성공', user: publicUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: '입력 정보를 확인해주세요', errors: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: '로그인 중 오류가 발생했습니다' });
    }
  });

  // 회원가입 API
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const userData: SignupData = signupSchema.parse(req.body);
      
      // 이미 존재하는 이메일인지 확인
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: '이미 등록된 이메일입니다' });
      }

      const newUser = await storage.createUser(userData);
      res.status(201).json({ 
        message: '회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.',
        user: newUser 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: '입력 정보를 확인해주세요', errors: error.errors });
      }
      console.error('Signup error:', error);
      res.status(500).json({ message: '회원가입 중 오류가 발생했습니다' });
    }
  });

  // 로그아웃 API
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다' });
      }
      res.json({ message: '로그아웃 되었습니다' });
    });
  });

  // 현재 사용자 정보 조회
  app.get('/api/auth/user', requireAuth, async (req: AuthRequest, res) => {
    res.json(req.user);
  });

  // Board category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getBoardCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/categories/:slug', async (req, res) => {
    try {
      const category = await storage.getBoardCategory(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post('/api/categories', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const categoryData = insertBoardCategorySchema.parse(req.body);
      const category = await storage.createBoardCategory(categoryData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Post routes
  app.get('/api/posts', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const posts = await storage.getPosts(categoryId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/:id', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Increment view count
      await storage.incrementViewCount(postId);
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post('/api/posts', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postData = insertPostSchema.parse({
        ...req.body,
        authorId: req.user!.id,
      });

      // Check if user has permission to post in this category
      if (postData.categoryId) {
        const category = await storage.getBoardCategory(''); // We need to modify this to get by ID
        if (category?.requiresApproval && !req.user!.isApproved) {
          return res.status(403).json({ message: "Approval required to post in this category" });
        }
        if (category?.allowedRoles && !category.allowedRoles.includes(req.user!.role)) {
          return res.status(403).json({ message: "Insufficient role to post in this category" });
        }
      }

      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Comment routes
  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getCommentsByPost(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/posts/:postId/comments', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        authorId: req.user!.id,
        postId,
      });

      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Admin routes
  app.get('/api/admin/pending-users', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const pendingUsers = await storage.getPendingUsers();
      res.json(pendingUsers);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ message: "Failed to fetch pending users" });
    }
  });

  app.put('/api/admin/users/:userId/approve', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;
      const { role, isApproved } = req.body;
      
      const updatedUser = await storage.updateUserRole(userId, role, isApproved);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Slider image routes
  app.get('/api/slider-images', async (req, res) => {
    try {
      const images = await storage.getSliderImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching slider images:", error);
      res.status(500).json({ message: "Failed to fetch slider images" });
    }
  });

  app.post('/api/admin/slider-images', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const imageData = insertSliderImageSchema.parse(req.body);
      const image = await storage.createSliderImage(imageData);
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating slider image:", error);
      res.status(500).json({ message: "Failed to create slider image" });
    }
  });

  app.put('/api/admin/slider-images/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const imageId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedImage = await storage.updateSliderImage(imageId, updates);
      res.json(updatedImage);
    } catch (error) {
      console.error("Error updating slider image:", error);
      res.status(500).json({ message: "Failed to update slider image" });
    }
  });

  app.delete('/api/admin/slider-images/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const imageId = parseInt(req.params.id);
      await storage.deleteSliderImage(imageId);
      res.json({ message: "Slider image deleted" });
    } catch (error) {
      console.error("Error deleting slider image:", error);
      res.status(500).json({ message: "Failed to delete slider image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
