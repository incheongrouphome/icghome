-- 확장 기능 설정
create extension if not exists "uuid-ossp";

-- 사용자 테이블
create table if not exists public.users (
    id text primary key default gen_random_uuid()::text,
    email text unique not null,
    password text not null,
    first_name text not null,
    last_name text not null,
    profile_image_url text,
    role text not null default 'visitor',
    is_approved boolean not null default false,
    organization text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint users_role_check check (role in ('visitor', 'member', 'admin'))
);

-- 게시판 카테고리 테이블
create table if not exists public.board_categories (
    id serial primary key,
    name text not null,
    slug text unique not null,
    description text,
    requires_auth boolean default false,
    requires_approval boolean default false,
    allowed_roles text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 게시글 테이블
create table if not exists public.posts (
    id serial primary key,
    title text not null,
    content text not null,
    author_id text references public.users(id) on delete cascade,
    category_id integer references public.board_categories(id) on delete cascade,
    is_notice boolean default false,
    view_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 댓글 테이블
create table if not exists public.comments (
    id serial primary key,
    content text not null,
    author_id text references public.users(id) on delete cascade,
    post_id integer references public.posts(id) on delete cascade,
    parent_id integer references public.comments(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 슬라이더 이미지 테이블
create table if not exists public.slider_images (
    id serial primary key,
    title text not null,
    image_url text not null,
    alt_text text,
    is_active boolean default true,
    "order" integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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