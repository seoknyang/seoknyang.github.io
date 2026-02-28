# PortPolio_csn 작업 히스토리

## 프로젝트 정보
- **GitHub 저장소:** https://github.com/seoknyang/seoknyang.github.io
- **배포 URL:** https://seoknyang.github.io
- **로컬 경로:** C:\Users\seokn\Desktop\csn\PortPolio_csn
- **GitHub 계정:** seoknyang (seoknyang@naver.com)

## 사용 스택
- **프론트엔드:** Vite + React
- **스타일링:** Tailwind CSS
- **라우팅:** React Router v6
- **CMS:** Sanity.io
- **호스팅:** GitHub Pages (GitHub Actions 자동 배포)

## 프로젝트 구조
```
PortPolio_csn/
├── .github/workflows/deploy.yml        ← main 브랜치 push 시 자동 배포
├── sanity-studio/
│   ├── components/TechStackInput.jsx   ← 기술스택 커스텀 입력 컴포넌트
│   └── schemaTypes/
│       ├── portfolio.js                ← 포트폴리오 스키마
│       ├── post.js                     ← 블로그 포스트 스키마
│       ├── techStackOptions.js         ← 기술스택 선택 목록
│       └── index.js
├── src/
│   ├── components/
│   │   ├── Layout.jsx                  ← 네비게이션 + 공통 레이아웃
│   │   └── TechBadge.jsx              ← 기술스택 아이콘 뱃지 컴포넌트
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Portfolio.jsx               ← Sanity 연동 완료
│   │   ├── Blog.jsx                    ← Sanity 연동 완료
│   │   └── BlogPost.jsx               ← Sanity 연동 완료
│   ├── sanityClient.js                 ← Sanity 클라이언트 설정
│   └── App.jsx
└── vite.config.js
```

## 라우팅 구조
- `/`             → Home (메인 소개)
- `/portfolio`    → Portfolio (포트폴리오 목록)
- `/blog`         → Blog (블로그 목록)
- `/blog/:slug`   → BlogPost (블로그 상세)

## 완료된 작업
- [x] Vite + React 프로젝트 생성
- [x] React Router, Tailwind CSS 설치 및 설정
- [x] GitHub Actions 자동 배포 워크플로우 작성
- [x] 기본 페이지 구조 구현 (Layout, Home, Portfolio, Blog, BlogPost)
- [x] GitHub 저장소 push 완료
- [x] GitHub Pages 배포 소스 → GitHub Actions 설정 완료
- [x] Sanity.io 프로젝트 생성 및 npm 설치 완료
- [x] Sanity 콘텐츠 스키마 정의 (portfolio, post)
- [x] React 앱에 @sanity/client, @portabletext/react 설치
- [x] Sanity API로 Portfolio / Blog / BlogPost 페이지 데이터 연동
- [x] 전체 반응형 디자인 점검 (모바일 대응)
- [x] 기술스택 아이콘 표시 (skillicons.dev + 커스텀 업로드 지원)
  - TechBadge 컴포넌트: skillicons.dev 자동 매핑, 커스텀 아이콘 우선 표시
  - TechStackInput: 검색 드롭다운, 직접 입력, 이미지 업로드 (Sanity 에셋)
  - techStackOptions.js: 35개 기술 선택 목록 (오타 방지)

## 다음 작업 (미완료)
- [ ] Sanity Studio 배포 (`cd sanity-studio && npm run deploy`)
- [ ] GitHub Pages 최종 배포 (`git push` to main)

## Sanity 정보
- **프로젝트명:** PortPolio_csn
- **Organization:** seoknyang
- **Dataset:** production (public)
- **Studio 경로:** C:\Users\seokn\Desktop\csn\PortPolio_csn\sanity-studio
- Sanity Project ID는 sanity-studio/sanity.config.js 에서 확인 가능
