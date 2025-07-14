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

-- 첨부파일 인덱스 생성
create index if not exists attachments_post_id_idx on public.attachments(post_id);
create index if not exists attachments_is_image_idx on public.attachments(is_image);

-- 첨부파일 RLS 정책 설정
alter table public.attachments enable row level security;

-- 첨부파일 정책
create policy "Everyone can view attachments" on public.attachments
    for select using (true);

create policy "Authenticated users can create attachments" on public.attachments
    for insert with check (
        exists (
            select 1 from public.posts
            where id = post_id and author_id = auth.uid()::text
        )
    );

create policy "Post authors can manage their attachments" on public.attachments
    for all using (
        exists (
            select 1 from public.posts
            where id = post_id and author_id = auth.uid()::text
        )
    );

create policy "Admins can manage all attachments" on public.attachments
    for all using (
        exists (
            select 1 from public.users
            where id = auth.uid()::text and role = 'admin'
        )
    ); 