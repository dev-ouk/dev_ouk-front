# Dev OUK - 프론트엔드 포트폴리오

Next.js 15와 TypeScript, Tailwind CSS로 구축된 프론트엔드 개발자 포트폴리오 사이트입니다.

## 🚀 기능

- **다크/라이트 모드** 지원
- **소셜 로그인** (Google, Kakao, GitHub)
- **권한 기반 시스템** (관리자, 일반 사용자, 게스트)
- **반응형 디자인**
- **포트폴리오, 기술 블로그, 코딩 테스트** 등 다양한 섹션

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Icons**: Heroicons

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# NextAuth.js 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Kakao OAuth 설정
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# GitHub OAuth 설정
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# 관리자 이메일 (쉼표로 구분)
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🔐 소셜 로그인 설정

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` 추가

### Kakao OAuth
1. [Kakao Developers](https://developers.kakao.com/)에서 애플리케이션 생성
2. 플랫폼 설정에서 웹 플랫폼 추가
3. Redirect URI에 `http://localhost:3000/api/auth/callback/kakao` 추가

### GitHub OAuth
1. [GitHub Developer Settings](https://github.com/settings/developers)에서 OAuth App 생성
2. Authorization callback URL에 `http://localhost:3000/api/auth/callback/github` 추가

## 👥 권한 시스템

- **관리자 (admin)**: 글 작성/수정/삭제, 모든 기능 사용
- **일반 사용자 (user)**: 댓글 작성 가능
- **게스트 (guest)**: 글 읽기만 가능

관리자 권한은 환경변수의 `ADMIN_EMAILS`에 등록된 이메일로 로그인하면 자동으로 부여됩니다.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/auth/          # NextAuth.js API 라우트
│   ├── auth/              # 로그인 페이지
│   ├── portfolio/         # 포트폴리오 페이지
│   ├── tech-blog/         # 기술 블로그 페이지
│   └── ...
├── components/            # 재사용 가능한 컴포넌트
│   ├── ProtectedComponent.tsx  # 권한 기반 컴포넌트
│   ├── LoginButton.tsx    # 로그인 버튼
│   └── Navigation.tsx     # 네비게이션
├── contexts/              # React Context
│   └── AuthContext.tsx    # 인증 컨텍스트
├── lib/                   # 유틸리티 함수
│   └── auth.ts           # NextAuth.js 설정
└── types/                # TypeScript 타입 정의
```

## 🎨 스타일링

Tailwind CSS v4를 사용하며, 다크모드는 `dark:` 접두사로 구현되어 있습니다.

## 🚀 배포

Vercel, Netlify 등 정적 사이트 호스팅 서비스에서 쉽게 배포할 수 있습니다.

```bash
npm run build
npm start
```