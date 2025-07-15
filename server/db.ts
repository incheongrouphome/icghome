import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema.js";

// 개발환경에서는 데이터베이스 연결 없이도 실행 가능
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      "DATABASE_URL must be set in production. Did you forget to provision a database?",
    );
  }
  console.warn("⚠️  DATABASE_URL not set - running in development mode without database");
}

// PostgreSQL 연결 풀 생성 (Supabase 호환)
export const pool = process.env.DATABASE_URL ? new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Supabase 설정
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}) : null;

export const db = pool ? drizzle(pool, { schema }) : null;