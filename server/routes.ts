import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { requireAuth, requireAdmin, comparePassword, AuthRequest } from "./auth";
import { AuthService } from "./supabase-api";
import { 
  insertPostSchema, 
  insertCommentSchema, 
  insertBoardCategorySchema, 
  insertSliderImageSchema,
  insertAttachmentSchema,
  loginSchema,
  signupSchema,
  type LoginData,
  type SignupData 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // 보안 헤더 설정
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS 설정
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || false 
      : 'http://localhost:5000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Rate Limiting 설정
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 5, // 최대 5회 시도
    message: { message: '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100회 요청
    message: { message: '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // 일반 API에 Rate Limiting 적용
  app.use('/api/', generalLimiter);

  // 세션 미들웨어 설정
  if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable must be set in production');
  }
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-not-for-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  }));

  // 파일 업로드 미들웨어 설정
  const storage_multer = multer.diskStorage({
    destination: async (req, file, cb) => {
      const dir = path.join(process.cwd(), 'uploads', 'attachments');
      try {
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
      } catch (error) {
        cb(error as Error, dir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
  });

  const upload = multer({ 
    storage: storage_multer,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB 제한
    },
    fileFilter: (req, file, cb) => {
      // 허용되는 파일 형식
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain', 'text/csv'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('허용되지 않는 파일 형식입니다.'));
      }
    }
  });

  // 업로드된 파일 정적 서빙
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // 파일 업로드 API
  app.post('/api/upload', requireAuth, upload.single('file'), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
      }

      const isImage = req.file.mimetype.startsWith('image/');
      const filePath = `/uploads/attachments/${req.file.filename}`;

      // 임시로 postId 없이 파일만 업로드 (나중에 게시글 저장시 연결)
      const attachmentData = {
        postId: null, // 임시로 null, 나중에 게시글 저장시 업데이트
        filename: req.file.filename,
        originalFilename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filePath: filePath,
        isImage: isImage,
      };

      res.json({
        filename: req.file.filename,
        originalFilename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filePath: filePath,
        isImage: isImage,
        url: filePath, // 클라이언트에서 사용할 URL
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
    }
  });

  // 이미지 붙여넣기 업로드 API
  app.post('/api/upload-image', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { imageData } = req.body;

      if (!imageData || !imageData.startsWith('data:image/')) {
        return res.status(400).json({ message: '올바른 이미지 데이터가 아닙니다.' });
      }

      // Base64 데이터 파싱
      const matches = imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ message: '올바른 이미지 형식이 아닙니다.' });
      }

      const imageType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // 파일명 생성
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `paste-${uniqueSuffix}.${imageType}`;
      const filePath = `/uploads/attachments/${filename}`;
      const absolutePath = path.join(process.cwd(), 'uploads', 'attachments', filename);

      // 파일 저장
      await fs.writeFile(absolutePath, buffer);

      res.json({
        filename: filename,
        originalFilename: filename,
        mimetype: `image/${imageType}`,
        size: buffer.length,
        filePath: filePath,
        isImage: true,
        url: filePath, // 클라이언트에서 사용할 URL
      });
    } catch (error) {
      console.error('Image paste upload error:', error);
      res.status(500).json({ message: '이미지 업로드 중 오류가 발생했습니다.' });
    }
  });

  // 이메일 확인 발송 API
  app.post('/api/auth/send-verification', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: '이메일이 필요합니다' });
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: '올바른 이메일 형식이 아닙니다' });
      }

      // 이미 존재하는 이메일인지 확인
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: '이미 등록된 이메일입니다' });
      }

      // 이메일 확인 발송
      const { error, token } = await AuthService.sendVerificationEmail(email);

      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json({ 
        message: '확인 이메일이 발송되었습니다.',
        email 
      });
    } catch (error) {
      console.error('Send verification error:', error);
      res.status(500).json({ message: '이메일 발송 중 오류가 발생했습니다' });
    }
  });

  // 이메일 확인 상태 체크 API
  app.post('/api/auth/check-verification', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: '이메일이 필요합니다' });
      }

      // AuthService를 통한 이메일 확인 상태 체크
      const { verified, error } = await AuthService.checkEmailVerification(email);

      if (error) {
        return res.status(400).json({ message: error });
      }
      
      res.json({ 
        verified,
        email 
      });
    } catch (error) {
      console.error('Check verification error:', error);
      res.status(500).json({ message: '이메일 확인 상태 확인 중 오류가 발생했습니다' });
    }
  });

  // 이메일 확인 링크 처리 API (GET 방식)
  app.get('/verify-email', async (req, res) => {
    try {
      const { token, email } = req.query;
      
      if (!token || !email) {
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #dc2626;">이메일 확인 실패</h2>
              <p>유효하지 않은 확인 링크입니다.</p>
              <a href="/" style="color: #2563eb;">홈페이지로 돌아가기</a>
            </body>
          </html>
        `);
      }

      // 토큰 확인
      const { success, error } = await AuthService.verifyEmailToken(token as string, email as string);

      if (!success) {
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #dc2626;">이메일 확인 실패</h2>
              <p>${error || '이메일 확인에 실패했습니다.'}</p>
              <a href="/" style="color: #2563eb;">홈페이지로 돌아가기</a>
            </body>
          </html>
        `);
      }

      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #16a34a;">이메일 확인 완료!</h2>
            <p>이메일 인증이 완료되었습니다.</p>
            <p>이제 회원가입 창으로 돌아가서 가입을 완료해주세요.</p>
            <a href="/" style="color: #2563eb; font-weight: bold;">홈페이지로 돌아가기</a>
            <script>
              // 5초 후 자동으로 홈페이지로 이동
              setTimeout(() => {
                window.location.href = '/';
              }, 5000);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc2626;">서버 오류</h2>
            <p>이메일 확인 중 오류가 발생했습니다.</p>
            <a href="/" style="color: #2563eb;">홈페이지로 돌아가기</a>
          </body>
        </html>
      `);
    }
  });

  // 회원가입 API (Supabase 이메일 인증 사용)
  app.post('/api/auth/signup', authLimiter, async (req, res) => {
    try {
      const userData: SignupData = signupSchema.parse(req.body);
      
      // AuthService를 사용하여 회원가입 처리
      const { user, error, needsEmailConfirmation } = await AuthService.signUp(
        userData.email,
        userData.password,
        userData.name,
        userData.organization
      );

      if (error) {
        return res.status(400).json({ message: error });
      }

      if (needsEmailConfirmation) {
        return res.status(201).json({ 
          message: '이메일 확인이 필요합니다. 이메일을 확인해주세요.',
          needsEmailConfirmation: true
        });
      }

      res.status(201).json({ 
        message: '회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.',
        user 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: '입력 정보를 확인해주세요', errors: error.errors });
      }
      console.error('Signup error:', error);
      res.status(500).json({ message: '회원가입 중 오류가 발생했습니다' });
    }
  });

  // 이메일 확인 API
  app.post('/api/auth/confirm-email', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: '토큰이 필요합니다' });
      }

      const { user, error } = await AuthService.confirmEmail(token);

      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json({ 
        message: '이메일이 확인되었습니다. 관리자 승인을 기다려주세요.',
        user 
      });
    } catch (error) {
      console.error('Email confirmation error:', error);
      res.status(500).json({ message: '이메일 확인 중 오류가 발생했습니다' });
    }
  });

  // 이메일 재전송 API
  app.post('/api/auth/resend-confirmation', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: '이메일이 필요합니다' });
      }

      const { error } = await AuthService.resendConfirmation(email);

      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json({ 
        message: '확인 이메일이 재전송되었습니다.' 
      });
    } catch (error) {
      console.error('Resend confirmation error:', error);
      res.status(500).json({ message: '이메일 재전송 중 오류가 발생했습니다' });
    }
  });

  // 로그인 API
  app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
      const { email, password }: LoginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
      }

      const isValidPassword = await comparePassword(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
      }

      // 세션에 사용자 ID 저장
      req.session.userId = user.id;

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

  app.put('/api/posts/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user can edit this post (author or admin)
      if (post.authorId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "You can only edit your own posts" });
      }

      const postData = insertPostSchema.parse({
        ...req.body,
        authorId: post.authorId, // Keep original author
      });

      const updatedPost = await storage.updatePost(postId, postData);
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user can delete this post (author or admin)
      if (post.authorId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "You can only delete your own posts" });
      }

      await storage.deletePost(postId);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  app.post('/api/posts/:id/view', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      await storage.incrementViewCount(postId);
      res.json({ message: "View count incremented" });
    } catch (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).json({ message: "Failed to increment view count" });
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

  app.put('/api/comments/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.getComment(commentId);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check if user can edit this comment (author or admin)
      if (comment.authorId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "You can only edit your own comments" });
      }

      const commentData = insertCommentSchema.parse({
        ...req.body,
        authorId: comment.authorId, // Keep original author
        postId: comment.postId, // Keep original post
      });

      const updatedComment = await storage.updateComment(commentId, commentData);
      res.json(updatedComment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });

  app.delete('/api/comments/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.getComment(commentId);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check if user can delete this comment (author or admin)
      if (comment.authorId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "You can only delete your own comments" });
      }

      await storage.deleteComment(commentId);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
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
