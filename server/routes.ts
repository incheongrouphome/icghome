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
import { storage } from "./storage.js";
import { requireAuth, requireAdmin, comparePassword, AuthRequest } from "./auth.js";
import { AuthService } from "./supabase-api.js";
import { supabase, supabaseAdmin } from "../config/supabase.js";
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
} from "../shared/schema.js";
import { z } from "zod";

// 파일명을 안전하게 정리하는 함수
function sanitizeFilename(filename: string): string {
  // 파일 확장자 분리
  const lastDotIndex = filename.lastIndexOf('.');
  const name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  const ext = lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';
  
  // 한글, 공백, 특수문자 제거하고 영문/숫자만 남김
  const cleanName = name
    .replace(/[^a-zA-Z0-9._-]/g, '') // 영문, 숫자, 점, 밑줄, 하이픈만 허용
    .replace(/\s+/g, '_') // 공백을 밑줄로 변경
    .replace(/[._-]+/g, '_') // 연속된 특수문자를 하나의 밑줄로 변경
    .replace(/^[._-]+|[._-]+$/g, '') // 시작/끝의 특수문자 제거
    .substring(0, 50); // 최대 50자로 제한
  
  // 이름이 비어있으면 기본 이름 사용
  const finalName = cleanName || 'file';
  
  return finalName + ext.toLowerCase();
}

// Supabase Storage 업로드 함수
async function uploadToSupabaseStorage(file: Express.Multer.File, bucket: string, folder: string = '') {
  // 안전한 파일명 생성
  const sanitizedName = sanitizeFilename(file.originalname);
  const fileName = `${folder}${Date.now()}-${Math.round(Math.random() * 1E9)}-${sanitizedName}`;
  
  console.log('📁 파일명 변환:', file.originalname, '→', fileName);
  
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase Storage 업로드 오류:', error);
    throw new Error(`파일 업로드 실패: ${error.message}`);
  }

  // 공개 URL 생성
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    fileName,
    publicUrl: publicUrlData.publicUrl,
    path: data.path
  };
}

// Base64 이미지를 Supabase Storage에 업로드
async function uploadBase64ToSupabaseStorage(base64Data: string, bucket: string, folder: string = '') {
  const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('올바른 이미지 형식이 아닙니다.');
  }

  const imageType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const fileName = `${folder}paste-${Date.now()}-${Math.round(Math.random() * 1E9)}.${imageType}`;
  
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: `image/${imageType}`,
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase Storage 업로드 오류:', error);
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  // 공개 URL 생성
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    fileName,
    publicUrl: publicUrlData.publicUrl,
    path: data.path,
    size: buffer.length
  };
}

export async function registerRoutes(app: Express) {
  // 보안 헤더 설정
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", ...(process.env.NODE_ENV === 'development' ? ["https://replit.com"] : [])],
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

  // 파일 업로드 미들웨어 설정 (메모리 저장)
  const upload = multer({ 
    storage: multer.memoryStorage(),
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
  
  // 슬라이더 이미지 등 public 에셋 정적 서빙
  app.use(express.static(path.join(process.cwd(), 'client', 'public')));

  // 파일 업로드 API (Supabase Storage)
  app.post('/api/upload', requireAuth, upload.single('file'), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
      }

      const isImage = req.file.mimetype.startsWith('image/');
      
      // Supabase Storage에 파일 업로드
      const uploadResult = await uploadToSupabaseStorage(req.file, 'attachments', 'posts/');
      
      res.json({
        filename: uploadResult.fileName,
        originalFilename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filePath: uploadResult.path,
        isImage: isImage,
        url: uploadResult.publicUrl, // Supabase Storage 공개 URL
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
    }
  });

  // 이미지 붙여넣기 업로드 API (Supabase Storage)
  app.post('/api/upload-image', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { imageData } = req.body;

      if (!imageData || !imageData.startsWith('data:image/')) {
        return res.status(400).json({ message: '올바른 이미지 데이터가 아닙니다.' });
      }

      // Supabase Storage에 Base64 이미지 업로드
      const uploadResult = await uploadBase64ToSupabaseStorage(imageData, 'attachments', 'posts/');

      res.json({
        filename: uploadResult.fileName,
        originalFilename: uploadResult.fileName,
        mimetype: `image/${uploadResult.fileName.split('.').pop()}`,
        size: uploadResult.size,
        filePath: uploadResult.path,
        isImage: true,
        url: uploadResult.publicUrl, // Supabase Storage 공개 URL
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

      // Supabase Auth를 통한 토큰 검증
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        console.error('Token verification error:', error);
        return res.status(400).json({ message: '유효하지 않은 토큰입니다' });
      }

      if (!data.user) {
        return res.status(400).json({ message: '사용자를 찾을 수 없습니다' });
      }

      // 이메일 확인 완료 - 사용자에게 성공 메시지 전송
      res.json({ 
        message: '이메일 확인이 완료되었습니다. 이제 회원가입을 진행할 수 있습니다.',
        user: {
          id: data.user.id,
          email: data.user.email,
          confirmed: true
        }
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
      console.log(`🔍 Login attempt for email: ${email}`);
      
      const user = await storage.getUserByEmail(email);
      console.log(`🔍 User found:`, user ? `${user.email} (${user.role})` : 'null');
      
      if (!user) {
        console.log(`❌ No user found for email: ${email}`);
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
      }

      console.log(`🔍 Comparing password for user: ${user.email}`);
      const isValidPassword = await comparePassword(password, user.password);
      console.log(`🔍 Password valid:`, isValidPassword);
      
      if (!isValidPassword) {
        console.log(`❌ Invalid password for user: ${user.email}`);
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
      }

      // 세션에 사용자 ID 저장
      req.session.userId = user.id;
      console.log(`✅ Login successful for user: ${user.email}`);

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

  // ID 찾기 API
  app.post('/api/auth/find-id', async (req, res) => {
    try {
      const { name, organization } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: '이름이 필요합니다' });
      }

      // 이름과 조직명으로 사용자 찾기
      const user = await storage.findUserByNameAndOrganization(name, organization);
      if (!user) {
        return res.status(404).json({ message: '일치하는 사용자 정보를 찾을 수 없습니다' });
      }

      // 보안을 위해 이메일의 일부만 마스킹하여 표시
      const email = user.email;
      const [localPart, domain] = email.split('@');
      const maskedEmail = localPart.length > 3 
        ? `${localPart.slice(0, 3)}${'*'.repeat(localPart.length - 3)}@${domain}`
        : `${localPart.slice(0, 1)}${'*'.repeat(localPart.length - 1)}@${domain}`;

      res.json({ 
        message: '등록된 이메일 정보를 찾았습니다',
        id: maskedEmail,
        fullId: user.email // 실제 사용 시에는 제거하고 이메일로 전송
      });
    } catch (error) {
      console.error('Find ID error:', error);
      res.status(500).json({ message: 'ID 찾기 중 오류가 발생했습니다' });
    }
  });

  // 비밀번호 재설정 요청 API
  app.post('/api/auth/request-password-reset', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: '이메일이 필요합니다' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: '등록되지 않은 이메일입니다' });
      }

      // 비밀번호 재설정 토큰 생성
      const { error, token } = await AuthService.sendPasswordResetEmail(email);

      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json({ 
        message: '비밀번호 재설정 링크를 이메일로 전송했습니다',
        email 
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({ message: '비밀번호 재설정 요청 중 오류가 발생했습니다' });
    }
  });

  // 비밀번호 재설정 실행 API
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, email, newPassword } = req.body;
      
      if (!token || !email || !newPassword) {
        return res.status(400).json({ message: '필수 정보가 누락되었습니다' });
      }

      // 토큰 검증 및 비밀번호 재설정
      const { success, error } = await AuthService.resetPassword(token, email, newPassword);

      if (!success) {
        return res.status(400).json({ message: error });
      }

      res.json({ 
        message: '비밀번호가 성공적으로 변경되었습니다'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: '비밀번호 재설정 중 오류가 발생했습니다' });
    }
  });

  // 비밀번호 재설정 페이지 (GET 방식)
  app.get('/reset-password', async (req, res) => {
    try {
      const { token, email } = req.query;
      
      if (!token || !email) {
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #dc2626;">비밀번호 재설정 실패</h2>
              <p>유효하지 않은 재설정 링크입니다.</p>
              <a href="/" style="color: #2563eb;">홈페이지로 돌아가기</a>
            </body>
          </html>
        `);
      }

      // 토큰 검증
      const { valid, error } = await AuthService.validateResetToken(token as string, email as string);

      if (!valid) {
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #dc2626;">비밀번호 재설정 실패</h2>
              <p>${error || '유효하지 않거나 만료된 재설정 링크입니다.'}</p>
              <a href="/" style="color: #2563eb;">홈페이지로 돌아가기</a>
            </body>
          </html>
        `);
      }

      res.send(`
        <html>
          <head>
            <title>비밀번호 재설정</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 50px; background-color: #f5f5f5; }
              .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .form-group { margin-bottom: 20px; }
              label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
              input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; }
              button { width: 100%; padding: 12px; background-color: #059669; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
              button:hover { background-color: #047857; }
              .error { color: #dc2626; margin-top: 10px; }
              .success { color: #16a34a; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 style="text-align: center; color: #333;">비밀번호 재설정</h2>
              <form id="resetForm">
                <div class="form-group">
                  <label for="password">새 비밀번호</label>
                  <input type="password" id="password" name="password" required minlength="6" placeholder="6자 이상 입력해주세요">
                </div>
                <div class="form-group">
                  <label for="confirmPassword">비밀번호 확인</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="비밀번호를 다시 입력해주세요">
                </div>
                <button type="submit" id="submitBtn">비밀번호 변경</button>
                <div id="message"></div>
              </form>
            </div>
            <script>
              document.getElementById('resetForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const messageDiv = document.getElementById('message');
                const submitBtn = document.getElementById('submitBtn');
                
                if (password !== confirmPassword) {
                  messageDiv.innerHTML = '<div class="error">비밀번호가 일치하지 않습니다.</div>';
                  return;
                }
                
                if (password.length < 6) {
                  messageDiv.innerHTML = '<div class="error">비밀번호는 6자 이상이어야 합니다.</div>';
                  return;
                }
                
                submitBtn.disabled = true;
                submitBtn.textContent = '변경 중...';
                
                try {
                  const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      token: '${token}',
                      email: '${email}',
                      newPassword: password
                    })
                  });
                  
                  const data = await response.json();
                  
                  if (response.ok) {
                    messageDiv.innerHTML = '<div class="success">' + data.message + '</div>';
                    setTimeout(() => {
                      window.location.href = '/';
                    }, 2000);
                  } else {
                    messageDiv.innerHTML = '<div class="error">' + data.message + '</div>';
                  }
                } catch (error) {
                  messageDiv.innerHTML = '<div class="error">네트워크 오류가 발생했습니다.</div>';
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = '비밀번호 변경';
              });
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Password reset page error:', error);
      res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc2626;">서버 오류</h2>
            <p>비밀번호 재설정 중 오류가 발생했습니다.</p>
            <a href="/" style="color: #2563eb;">홈페이지로 돌아가기</a>
          </body>
        </html>
      `);
    }
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
  app.get('/api/admin/system-status', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const status = {
        database: {
          connected: !!process.env.DATABASE_URL,
          type: process.env.DATABASE_URL ? 'PostgreSQL/Supabase' : 'MockStorage',
          url: process.env.DATABASE_URL ? '***Connected***' : 'Not configured'
        },
        storage: {
          uploadsDir: 'uploads/attachments',
          imagesDir: 'client/public/img'
        },
        environment: process.env.NODE_ENV || 'development'
      };
      res.json(status);
    } catch (error) {
      console.error("Error fetching system status:", error);
      res.status(500).json({ message: "Failed to fetch system status" });
    }
  });

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

  // 슬라이더 이미지 업로드 미들웨어 설정 (메모리 저장)
  const uploadSliderImage = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        const error = new Error('이미지 파일만 업로드 가능합니다.') as any;
        cb(error, false);
      }
    }
  });

  // 슬라이더 이미지 파일 업로드 API
  app.post('/api/admin/slider-images/upload', (req: AuthRequest, res, next) => {
    console.log('📤 슬라이더 이미지 업로드 요청 시작');
    console.log('📍 요청 URL:', req.url);
    console.log('📍 요청 메소드:', req.method);
    console.log('📍 Content-Type:', req.get('Content-Type'));
    
    // 먼저 인증 확인
    requireAdmin(req, res, (err) => {
      if (err) {
        console.log('❌ 인증 실패:', err.message);
        return res.status(401).json({ message: '관리자 권한이 필요합니다.' });
      }
      
      console.log('✅ 인증 통과 - 사용자:', req.user?.email, req.user?.role);
      
      // multer 미들웨어 실행
      uploadSliderImage.single('image')(req, res, (multerErr) => {
        if (multerErr) {
          console.error('🚨 Multer 에러:', multerErr);
          return res.status(400).json({ 
            message: `파일 업로드 에러: ${multerErr.message}`,
            error: multerErr.code 
          });
        }
        
        // 업로드 처리
        handleSliderImageUpload(req as AuthRequest, res);
      });
    });
  });

  // 슬라이더 이미지 업로드 처리 함수 (Supabase Storage)
  async function handleSliderImageUpload(req: AuthRequest, res: express.Response) {
    try {
      console.log('📁 파일 업로드 처리 시작');
      
      if (!req.file) {
        console.log('❌ 파일이 업로드되지 않음');
        return res.status(400).json({ message: '이미지 파일이 업로드되지 않았습니다.' });
      }

      console.log('📁 업로드된 파일 정보:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? 'present' : 'missing'
      });

      // Supabase Storage에 슬라이더 이미지 업로드
      const uploadResult = await uploadToSupabaseStorage(req.file, 'slider-images', 'slider/');
      
      const result = {
        success: true,
        filename: uploadResult.fileName,
        originalFilename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        imageUrl: uploadResult.publicUrl,
        url: uploadResult.publicUrl
      };
      
      console.log('✅ 슬라이더 이미지 업로드 성공:', result);
      
      // JSON 응답 확실히 보내기
      res.set('Content-Type', 'application/json');
      return res.status(200).json(result);
    } catch (error) {
      console.error('🚨 슬라이더 이미지 업로드 에러:', error);
      return res.status(500).json({ 
        success: false,
        message: '이미지 업로드 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

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
}
