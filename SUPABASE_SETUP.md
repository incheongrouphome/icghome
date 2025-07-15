# Supabase 프로덕션 환경 설정 가이드

## 📋 필수 사항

### 1. Supabase 프로젝트 생성
- [Supabase Dashboard](https://supabase.com/dashboard) 접속
- 새 프로젝트 생성
- 프로젝트 이름: `AIBridge GroupHome Incheon`
- 지역: `Northeast Asia (ap-northeast-1)`

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 프로덕션 환경
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 데이터베이스 설정 (Transaction mode 권장)
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres

# 세션 비밀키
SESSION_SECRET=your-super-secret-session-key-here

# 프로덕션 모드
NODE_ENV=production
```

### 3. 프로덕션 환경 접속 정보
- **프로덕션 웹사이트**: https://your-site.vercel.app
- **Supabase 대시보드**: https://supabase.com/dashboard/project/your-project-id
- **데이터베이스 (Direct connection)**: Port 5432 (IPv6 전용)
- **데이터베이스 (Connection pooling)**: Port 6543 (IPv4/IPv6 모두 지원)

## 🚀 설정 및 배포 방법

### 1. 데이터베이스 스키마 생성
Supabase 대시보드 → SQL Editor에서 다음 스크립트 실행:

```sql
-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  profile_image_url VARCHAR,
  role VARCHAR DEFAULT 'visitor' NOT NULL,
  is_approved BOOLEAN DEFAULT false NOT NULL,
  organization VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 게시판 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS board_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  requires_auth BOOLEAN DEFAULT false NOT NULL,
  requires_approval BOOLEAN DEFAULT false NOT NULL,
  allowed_roles TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 게시글 테이블 생성
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  author_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES board_categories(id) ON DELETE SET NULL,
  is_notice BOOLEAN DEFAULT false NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 슬라이더 이미지 테이블 생성
CREATE TABLE IF NOT EXISTS slider_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  image_url VARCHAR NOT NULL,
  alt_text VARCHAR,
  is_active BOOLEAN DEFAULT true NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 첨부파일 테이블 생성
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  filename VARCHAR NOT NULL,
  original_filename VARCHAR NOT NULL,
  mimetype VARCHAR NOT NULL,
  size INTEGER NOT NULL,
  file_path VARCHAR NOT NULL,
  is_image BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Storage 버킷 생성
Supabase 대시보드 → Storage에서 버킷 생성:

```sql
-- 첨부파일 버킷 생성
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);

-- 슬라이더 이미지 버킷 생성
INSERT INTO storage.buckets (id, name, public) VALUES ('slider-images', 'slider-images', true);
```

### 3. Storage 정책 설정
SQL Editor에서 다음 정책 생성:

```sql
-- 첨부파일 버킷 정책
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can upload to attachments" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own files in attachments" ON storage.objects 
FOR DELETE USING (bucket_id = 'attachments' AND auth.uid() = owner);

-- 슬라이더 이미지 버킷 정책
CREATE POLICY "Public read access for slider images" ON storage.objects 
FOR SELECT USING (bucket_id = 'slider-images');

CREATE POLICY "Authenticated users can upload to slider-images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'slider-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own files in slider-images" ON storage.objects 
FOR DELETE USING (bucket_id = 'slider-images' AND auth.uid() = owner);
```

### 4. 초기 데이터 생성
SQL Editor에서 기본 카테고리 생성:

```sql
-- 게시판 카테고리 초기 데이터
INSERT INTO board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) VALUES
('회원 공지사항', 'member-notices', '회원을 위한 중요 공지사항', true, false, ARRAY['admin', 'member']),
('소통공간', 'communication', '회원 간 자유로운 소통 공간', true, true, ARRAY['admin', 'member']),
('사업신청', 'business-application', '각종 사업 신청 및 관련 공지', true, true, ARRAY['admin', 'member']),
('일반 공지사항', 'general-notices', '일반인을 위한 공지사항', false, false, ARRAY['admin']),
('채용공고', 'job-postings', '채용 관련 공고', false, false, ARRAY['admin']);

-- 관리자 계정 생성 (비밀번호는 bcrypt로 해시된 값)
INSERT INTO users (id, email, password, name, role, is_approved, organization) VALUES
('admin_001', 'admin@example.com', '$2b$10$A9JdpaIyCd.jxlWWFxB44.ZnhaE7EF3doltKH0xUbE9Gkgky6ywIq', '관리자', 'admin', true, '한국아동청소년그룹홈협의회 인천지부');
```

### 5. Vercel 배포 설정
Vercel 대시보드에서 환경 변수 설정:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project-id.supabase.co:6543/postgres
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
```

## 🔧 유용한 명령어

### 개발 관련
```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm run start

# 타입 체크
npm run check

# 데이터베이스 스키마 푸시
npm run db:push
```

## 🛠️ 트러블슈팅

### 1. 데이터베이스 연결 오류
```bash
# 연결 문자열 확인
echo $DATABASE_URL

# IPv6 연결 문제 시 포트 6543 사용 (Transaction mode)
DATABASE_URL=postgresql://postgres:password@db.project-id.supabase.co:6543/postgres
```

### 2. 환경 변수 문제
```bash
# 환경 변수 확인
printenv | grep -E "(SUPABASE|DATABASE)"
```

### 3. 파일 업로드 오류
- Storage 버킷이 생성되었는지 확인
- 버킷 정책이 올바르게 설정되었는지 확인
- 환경 변수가 올바르게 설정되었는지 확인

## 🔐 보안 설정

### 프로덕션 환경 체크리스트
- [x] 환경 변수를 .env 파일이 아닌 배포 플랫폼에 설정
- [x] SESSION_SECRET을 강력한 랜덤 문자열로 설정
- [x] 데이터베이스 비밀번호를 복잡하게 설정
- [x] CORS 설정 확인
- [x] Rate Limiting 적용
- [x] 파일 업로드 크기 제한 설정

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)

## 🆘 문제 해결

문제가 발생하면 다음 정보와 함께 문의하세요:
1. 운영체제 및 Node.js 버전
2. 배포 플랫폼 (Vercel, Netlify 등)
3. 에러 메시지
4. 환경 변수 설정 상태
5. 브라우저 개발자 도구 콘솔 로그

---

**중요**: 이 설정은 프로덕션 환경을 위한 것입니다. 보안과 성능을 위해 모든 환경 변수를 적절히 설정해주세요. 