-- 003_fix_timestamp_not_null.sql
-- 모든 timestamp 필드를 NOT NULL로 변경

-- users 테이블
ALTER TABLE users 
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN updated_at SET NOT NULL;

-- board_categories 테이블
ALTER TABLE board_categories 
ALTER COLUMN created_at SET NOT NULL;

-- posts 테이블  
ALTER TABLE posts 
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN updated_at SET NOT NULL;

-- comments 테이블
ALTER TABLE comments 
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN updated_at SET NOT NULL;

-- slider_images 테이블
ALTER TABLE slider_images 
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN updated_at SET NOT NULL;

-- attachments 테이블
ALTER TABLE attachments 
ALTER COLUMN created_at SET NOT NULL; 