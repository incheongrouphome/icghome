-- 기본 게시판 카테고리 데이터 삽입
insert into public.board_categories (name, slug, description, requires_auth, requires_approval, allowed_roles) values
('열린공지', 'general', '일반 공지사항', false, false, null),
('채용공고', 'jobs', '채용 관련 공지', false, false, null),
('회원공지', 'member-notices', '회원 전용 공지사항', true, false, array['member', 'admin']),
('소통공간', 'communication', '회원 간 소통 공간', true, true, array['member', 'admin']),
('사업신청', 'business-application', '사업 신청 관련', true, true, array['member', 'admin']);

-- 기본 사용자 데이터 삽입 (비밀번호: password123)
insert into public.users (id, email, password, first_name, last_name, role, is_approved, organization) values
('admin_001', 'admin@example.com', '$2b$10$70tR7KVysT6Ok4fBYJr0G.Upy7f693x4MF53EOHHZUIHj7Hfyl72K', '관리자', '김', 'admin', true, '인천광역시그룹홈협의회'),
('user_001', 'user@example.com', '$2b$10$70tR7KVysT6Ok4fBYJr0G.Upy7f693x4MF53EOHHZUIHj7Hfyl72K', '사용자', '이', 'member', true, '테스트기관'),
('visitor_001', 'visitor@example.com', '$2b$10$70tR7KVysT6Ok4fBYJr0G.Upy7f693x4MF53EOHHZUIHj7Hfyl72K', '방문자', '박', 'visitor', false, '신청기관');

-- 기본 슬라이더 이미지 데이터 삽입
insert into public.slider_images (title, image_url, alt_text, is_active, "order") values
('메인 슬라이드 1', '/img/메인이미지 (1).png', '메인 슬라이드 1', true, 1),
('메인 슬라이드 2', '/img/소개 (1).jpg', '메인 슬라이드 2', true, 2),
('메인 슬라이드 3', '/img/협의회단체사진 (1).jpg', '메인 슬라이드 3', true, 3);

-- 샘플 게시글 데이터 삽입
insert into public.posts (title, content, author_id, category_id, is_notice, view_count) values
('인천광역시그룹홈협의회 공지사항', '안녕하세요. 인천광역시그룹홈협의회입니다. 이번 달 정기 모임에 대해 안내드립니다.', 'admin_001', 1, true, 0),
('2024년 채용 공고', '2024년 상반기 채용 공고를 안내드립니다. 많은 관심과 지원 부탁드립니다.', 'admin_001', 2, false, 0),
('회원 전용 공지사항', '회원 여러분께 안내드립니다. 이번 달 회원 전용 행사에 대해 공지드립니다.', 'admin_001', 3, true, 0),
('소통공간 테스트 글', '회원 간 소통을 위한 테스트 글입니다. 자유롭게 의견을 나누어 주세요.', 'user_001', 4, false, 0),
('사업신청 관련 안내', '2024년 사업 신청에 대한 안내사항입니다. 신청 기한과 절차를 확인해 주세요.', 'admin_001', 5, false, 0);

-- 샘플 댓글 데이터 삽입
insert into public.comments (content, author_id, post_id, parent_id) values
('좋은 정보 감사합니다!', 'user_001', 1, null),
('궁금한 점이 있습니다. 연락처를 알려주세요.', 'user_001', 2, null),
('회원 행사 참여하고 싶습니다.', 'user_001', 3, null),
('의견 공유 감사합니다.', 'admin_001', 4, null),
('사업 신청 절차가 복잡하네요.', 'user_001', 5, null),
('032-364-1617로 연락 주세요.', 'admin_001', 2, 2);

-- 뷰 카운트 업데이트
update public.posts set view_count = floor(random() * 100) + 1; 