import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { PublicUser } from '@shared/schema';

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

export interface AuthRequest extends Request {
  user?: PublicUser;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Auth check - Session ID:', req.sessionID);
    console.log('Auth check - Session data:', req.session);
    
    const userId = req.session?.userId;
    console.log('Auth check - User ID from session:', userId);
    
    if (!userId) {
      console.log('Auth check - No user ID in session');
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      console.log('Auth check - User not found for ID:', userId);
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다' });
    }

    console.log('Auth check - User found:', { id: user.id, email: user.email, role: user.role });

    // 패스워드 제거한 공개 사용자 정보
    const { password, ...publicUser } = user;
    req.user = publicUser;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: '인증 오류가 발생했습니다' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await requireAuth(req, res, () => {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: '관리자 권한이 필요합니다' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: '인증 오류가 발생했습니다' });
  }
};

// 세션 타입 확장
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
} 