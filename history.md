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

## 완료된 작업 (추가)
- [x] Sanity Studio 배포 → https://seoknyang.sanity.studio/
- [x] GitHub Pages 최종 배포 → https://seoknyang.github.io

---

## 다음 계획: 포트폴리오 페이지 개편 (이력서 형식)

### 설계 방향
섹션을 타입별로 고정하지 않고, **섹션 타이틀을 자유 입력**하는 유연한 구조.
섹션 내 아이템은 공통 필드를 공유하고, 필요한 것만 채워서 사용.

**사용 예시:**
- 타이틀 "경력" → 각 아이템에 시작일/종료일/제목(회사명)/설명(업무내용) 입력
- 타이틀 "학력" → 시작일/종료일/제목(학교명)/부가정보(졸업여부·졸업일자) 입력
- 타이틀 "자격/어학/수상" → 날짜/제목(자격명)/설명(합격·점수)/부가정보(자격번호) 입력
- 타이틀 "경험/활동/교육" → 시작일/종료일/제목(활동명) 입력

### Sanity 스키마 구조 (`profile` 싱글톤)
```
profile {
  intro        text                  소개 텍스트
  links        array of {            외부 링크
                 label: string
                 url: url
               }
  techStack    array of techItem     기존 TechBadge 재사용
  sections     array of {            자유 섹션 목록 (순서 조정 가능)
                 title: string       "경력" / "학력" / "자격증" 등 자유 입력
                 items: array of {
                   startDate: date   시작일 (선택)
                   endDate:   date   종료일 (선택)
                   date:      date   단일 날짜 (선택, 자격 취득일 등)
                   name:      string 제목/회사명/학교명/자격명
                   description: text 설명/업무내용/점수 등 (선택)
                   note:      string 부가정보: 자격번호/졸업여부 등 (선택)
                 }
               }
}
```

### 구현 단계
#### Phase 1: Sanity 스키마
- [x] `sanity-studio/schemaTypes/profile.js` 생성
- [x] `schemaTypes/index.js`에 profile 등록
- [x] `sanity.config.js` structure 설정 (profile 싱글톤)
- [x] Sanity Studio에서 profile 문서 1개 생성 및 데이터 입력

#### Phase 2: 기존 프로젝트 목록 분리
- [x] 기존 `Portfolio.jsx`(프로젝트 목록)를 `Projects.jsx`로 복사
- [x] App.jsx 라우팅: `/portfolio` → 이력서 페이지, `/projects` → 프로젝트 목록
- [x] Layout.jsx 네비게이션 메뉴 업데이트 (Portfolio / Projects / Blog)

#### Phase 3: React 이력서 페이지 구현
- [x] `Portfolio.jsx` 새로 작성 (profile 데이터 fetch)
- [x] 소개, 링크, 기술스택 섹션 UI
- [x] sections 배열 렌더링: 타이틀 + 아이템 목록 (타임라인 스타일)
- [x] Home.jsx에 "프로젝트 보기" 버튼 추가
- [x] techStack null 항목 에러 수정 (GROQ `[defined(name)]` 필터 적용)

---

## 다음 계획: 사이트 리브랜딩 & UI 현대화

### 변경 사항
- 왼쪽 상단 사이트명 "seoknyang" → **"CSN TechLog"** 로 변경 (`Layout.jsx`)
- 전체 UI 현대화 (디자인 개선)

### UI 현대화 방향 (미정, 다음 세션에서 구체화)
- 전체적인 레이아웃/타이포그래피 개선
- 네비게이션 스타일 개선
- 페이지별 UI 개선 (Home, Portfolio, Projects, Blog)

---

## Sanity 정보
- **프로젝트명:** PortPolio_csn
- **Organization:** seoknyang
- **Dataset:** production (public)
- **Studio 경로:** C:\Users\seokn\Desktop\csn\PortPolio_csn\sanity-studio
- Sanity Project ID는 sanity-studio/sanity.config.js 에서 확인 가능
