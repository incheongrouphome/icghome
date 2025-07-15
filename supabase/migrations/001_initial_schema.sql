-- 확장 기능 설정
create extension if not exists "uuid-ossp";

-- 세션 테이블 생성
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- 세션 만료 시간 인덱스 생성
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions(expire);

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

-- 초기 데이터 삽입
INSERT INTO board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) 
VALUES 
  ('일반 공지', 'general-notices', '모든 방문자가 볼 수 있는 공지사항', false, false, NULL),
  ('채용 공고', 'job-postings', '구인 구직 정보', false, false, NULL),
  ('회원 공지', 'member-notices', '회원 전용 공지사항', true, false, ARRAY['member', 'admin']),
  ('소통 공간', 'communication', '회원 간 소통 공간', true, true, ARRAY['member', 'admin']),
  ('사업 신청', 'business-application', '사업 신청 및 관련 공지', true, true, ARRAY['member', 'admin'])
ON CONFLICT (slug) DO NOTHING;

-- 인덱스 생성
create index if not exists users_email_idx on public.users(email);
create index if not exists users_role_idx on public.users(role);
create index if not exists board_categories_slug_idx on public.board_categories(slug);
create index if not exists posts_author_id_idx on public.posts(author_id);
create index if not exists posts_category_id_idx on public.posts(category_id);
create index if not exists posts_created_at_idx on public.posts(created_at);
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comments_parent_id_idx on public.comments(parent_id);
create index if not exists slider_images_active_order_idx on public.slider_images(is_active, "order");

-- RLS (Row Level Security) 설정
alter table public.users enable row level security;
alter table public.board_categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.slider_images enable row level security;

-- 사용자 정책
create policy "Users can view their own profile" on public.users
    for select using (auth.uid()::text = id);

create policy "Users can update their own profile" on public.users
    for update using (auth.uid()::text = id);

create policy "Admins can view all users" on public.users
    for select using (
        exists (
            select 1 from public.users
            where id = auth.uid()::text and role = 'admin'
        )
    );

create policy "Admins can update any user" on public.users
    for update using (
        exists (
            select 1 from public.users
            where id = auth.uid()::text and role = 'admin'
        )
    );

-- 게시판 카테고리 정책
create policy "Everyone can view board categories" on public.board_categories
    for select using (true);

create policy "Admins can manage board categories" on public.board_categories
    for all using (
        exists (
            select 1 from public.users
            where id = auth.uid()::text and role = 'admin'
        )
    );

-- 게시글 정책
create policy "Everyone can view posts" on public.posts
    for select using (true);

create policy "Authenticated users can create posts" on public.posts
    for insert with check (auth.uid()::text = author_id);

create policy "Authors can update their own posts" on public.posts
    for update using (auth.uid()::text = author_id);

create policy "Admins can manage all posts" on public.posts
    for all using (
        exists (
            select 1 from public.users
            where id = auth.uid()::text and role = 'admin'
        )
    );

-- 댓글 정책
create policy "Everyone can view comments" on public.comments
    for select using (true);

create policy "Authenticated users can create comments" on public.comments
    for insert with check (auth.uid()::text = author_id);

create policy "Authors can update their own comments" on public.comments
    for update using (auth.uid()::text = author_id);

create policy "Admins can manage all comments" on public.comments
    for all using (
        exists (
            select 1 from public.users
            where id = auth.uid()::text and role = 'admin'
        )
    );

-- 슬라이더 이미지 정책
create policy "Everyone can view slider images" on public.slider_images
    for select using (true);

create policy "Admins can manage slider images" on public.slider_images
    for all using (
        exists (
            select 1 from public.users
            where id = auth.uid()::text and role = 'admin'
        )
    );

-- 트리거 함수 (updated_at 자동 업데이트)
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- 트리거 설정
create trigger handle_users_updated_at
    before update on public.users
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_posts_updated_at
    before update on public.posts
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_comments_updated_at
    before update on public.comments
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_slider_images_updated_at
    before update on public.slider_images
    for each row
    execute procedure public.handle_updated_at(); 