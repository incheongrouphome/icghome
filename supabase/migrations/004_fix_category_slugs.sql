-- 004_fix_category_slugs.sql
-- 카테고리 slug 불일치 문제 해결 

-- 기존 카테고리 slug를 클라이언트 코드와 일치하도록 수정
UPDATE board_categories 
SET slug = 'general-notices' 
WHERE slug IN ('general-announcements', 'general');

UPDATE board_categories 
SET slug = 'job-postings' 
WHERE slug = 'jobs';

-- 카테고리 이름도 통일
UPDATE board_categories 
SET name = '열린공지' 
WHERE slug = 'general-notices';

UPDATE board_categories 
SET name = '채용공고' 
WHERE slug = 'job-postings';

-- 카테고리가 없으면 생성 (ON CONFLICT 대신 조건부 INSERT)
INSERT INTO board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) 
SELECT '열린공지', 'general-notices', '일반 공지사항', false, false, null
WHERE NOT EXISTS (SELECT 1 FROM board_categories WHERE slug = 'general-notices');

INSERT INTO board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) 
SELECT '채용공고', 'job-postings', '채용 관련 공지', false, false, null
WHERE NOT EXISTS (SELECT 1 FROM board_categories WHERE slug = 'job-postings');

INSERT INTO board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) 
SELECT '회원공지', 'member-notices', '회원 전용 공지사항', true, false, ARRAY['member', 'admin']
WHERE NOT EXISTS (SELECT 1 FROM board_categories WHERE slug = 'member-notices');

INSERT INTO board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) 
SELECT '소통공간', 'communication', '회원 간 소통 공간', true, true, ARRAY['member', 'admin']
WHERE NOT EXISTS (SELECT 1 FROM board_categories WHERE slug = 'communication');

INSERT INTO board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) 
SELECT '사업신청', 'business-application', '사업 신청 관련', true, true, ARRAY['member', 'admin']
WHERE NOT EXISTS (SELECT 1 FROM board_categories WHERE slug = 'business-application'); 