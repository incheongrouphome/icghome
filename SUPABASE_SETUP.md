# Supabase 로컬 개발 환경 설정 가이드

## 📋 필수 요구사항

### 1. Docker 설치
로컬 Supabase 개발 환경을 위해 Docker가 필요합니다.

- **Windows**: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop) 설치
- **macOS**: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop) 설치
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/) 설치

### 2. 설치 확인
```bash
docker --version
docker-compose --version
```

## 🚀 설정 및 실행 방법

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 로컬 개발 환경
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# 데이터베이스 설정
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# 세션 비밀키
SESSION_SECRET=your-super-secret-session-key-here

# 개발 모드
NODE_ENV=development
```

### 2. Supabase 로컬 환경 시작
```bash
# Supabase 컨테이너 시작 (백그라운드 실행)
npm run supabase:start

# 로그 확인
npm run supabase:logs
```

### 3. 개발 서버 시작
```bash
# 메인 애플리케이션 실행
npm run dev
```

### 4. 서비스 접근 주소
- **메인 애플리케이션**: http://localhost:5173
- **API 게이트웨이**: http://localhost:8000
- **데이터베이스**: localhost:54322
- **Auth 서비스**: http://localhost:9999
- **Storage 서비스**: http://localhost:5000
- **이메일 테스트**: http://localhost:54324

## 🗄️ 데이터베이스 구조

### 테이블 구조
- **users**: 사용자 정보
- **board_categories**: 게시판 카테고리
- **posts**: 게시글
- **comments**: 댓글
- **slider_images**: 메인 슬라이더 이미지

### 기본 데이터
초기 실행 시 다음 데이터가 자동으로 생성됩니다:
- 관리자 계정: `admin@example.com` / `password123`
- 일반 사용자: `user@example.com` / `password123`
- 방문자: `visitor@example.com` / `password123`

## 🔧 유용한 명령어

### Supabase 관리
```bash
# 컨테이너 시작
npm run supabase:start

# 컨테이너 중지
npm run supabase:stop

# 데이터 초기화 (모든 데이터 삭제)
npm run supabase:reset

# 로그 확인
npm run supabase:logs
```

### 개발 도구
```bash
# 타입 체크
npm run check

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start
```

## 🛠️ 트러블슈팅

### 1. Docker 컨테이너 실행 실패
```bash
# 기존 컨테이너 정리
docker-compose down -v
docker system prune -a

# 다시 시작
npm run supabase:start
```

### 2. 포트 충돌 문제
기본 포트가 이미 사용 중인 경우 `docker-compose.yml` 파일의 포트 번호를 변경하세요.

### 3. 데이터베이스 연결 오류
```bash
# 데이터베이스 컨테이너 로그 확인
docker-compose logs db

# 데이터베이스 재시작
docker-compose restart db
```

### 4. 이미지 로딩 문제
```bash
# 최신 이미지 다운로드
docker-compose pull

# 컨테이너 재시작
npm run supabase:reset
```

## 🔐 보안 설정

### 개발 환경 전용 키
현재 설정의 JWT 키들은 **개발 환경 전용**입니다. 
프로덕션 환경에서는 반드시 새로운 키를 생성해야 합니다.

### 프로덕션 배포 시 주의사항
1. `.env` 파일을 프로덕션 서버의 환경 변수로 설정
2. JWT 시크릿 키를 새로 생성
3. 데이터베이스 URL을 프로덕션 DB로 변경
4. 도메인 설정 업데이트

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Docker 공식 문서](https://docs.docker.com/)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)

## 🆘 도움이 필요한 경우

문제가 발생하면 다음 정보와 함께 문의하세요:
1. 운영체제 및 버전
2. Docker 버전
3. 에러 메시지
4. 실행한 명령어
5. 로그 내용 (`npm run supabase:logs`)

---

**중요**: 이 설정은 로컬 개발 환경을 위한 것입니다. 프로덕션 환경에서는 적절한 보안 설정이 필요합니다. 