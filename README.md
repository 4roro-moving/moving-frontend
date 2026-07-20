# 🚚 MOVING Frontend

무빙(MOVING) 프로젝트의 프론트엔드 저장소입니다.

본 저장소는 Next.js 기반으로 개발되며, 초기 개발 환경 설정과 협업을 위한 규칙을 관리합니다.

---

## 개발 환경

- Node.js 22.x
- npm
- Next.js
- React
- TypeScript
- Tailwind CSS

---

## 프로젝트 실행

프로젝트를 실행하기 전에 의존성을 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

---

# 🚚 MOVING Frontend

무빙(MOVING) 프로젝트의 프론트엔드 저장소입니다.

본 저장소는 Next.js 기반으로 개발되며, 초기 개발 환경 설정과 협업을 위한 규칙을 관리합니다.

---

## 개발 환경

- Node.js 22.x
- npm
- Next.js
- React
- TypeScript
- Tailwind CSS

---

## 프로젝트 실행

프로젝트를 실행하기 전에 의존성을 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

---

## 📁 폴더 구조

```text
src
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── assets
├── components
│   ├── common
│   ├── auth
│   ├── estimate
│   ├── mover
│   ├── notification
│   └── review
├── hooks
├── lib
│   ├── api
│   │   └── axiosInstance.ts
│   ├── constants
│   │   ├── apiRoutes.ts
│   │   └── queryKeys.ts
│   └── utils
│       └── cn.ts
├── providers
│   └── QueryProvider.tsx
├── styles
└── types
```

### 폴더 설명

| 폴더            | 설명                                  |
| --------------- | ------------------------------------- |
| `app`           | Next.js App Router 페이지 및 레이아웃 |
| `assets`        | 이미지, 아이콘 등 정적 리소스         |
| `components`    | 재사용 가능한 UI 컴포넌트             |
| `hooks`         | Custom Hook                           |
| `lib/api`       | Axios 인스턴스 및 API 관련 코드       |
| `lib/constants` | API 경로, Query Key 등 공통 상수      |
| `lib/utils`     | 공통 유틸리티 함수                    |
| `providers`     | React Query, Context Provider         |
| `styles`        | 전역 스타일 및 공통 스타일            |
| `types`         | 공통 타입 정의                        |

---

## 📁 폴더 구조

```text
src
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── assets
├── components
│   ├── common
│   ├── auth
│   ├── estimate
│   ├── mover
│   ├── notification
│   └── review
├── hooks
├── lib
│   ├── api
│   │   └── axiosInstance.ts
│   ├── constants
│   │   ├── apiRoutes.ts
│   │   └── queryKeys.ts
│   └── utils
│       └── cn.ts
├── providers
│   └── QueryProvider.tsx
├── styles
└── types
```

### 폴더 설명

| 폴더            | 설명                                  |
| --------------- | ------------------------------------- |
| `app`           | Next.js App Router 페이지 및 레이아웃 |
| `assets`        | 이미지, 아이콘 등 정적 리소스         |
| `components`    | 재사용 가능한 UI 컴포넌트             |
| `hooks`         | Custom Hook                           |
| `lib/api`       | Axios 인스턴스 및 API 관련 코드       |
| `lib/constants` | API 경로, Query Key 등 공통 상수      |
| `lib/utils`     | 공통 유틸리티 함수                    |
| `providers`     | React Query, Context Provider         |
| `styles`        | 전역 스타일 및 공통 스타일            |
| `types`         | 공통 타입 정의                        |

---

## 🌿 Git 브랜치 전략

프로젝트는 Git Flow를 기반으로 브랜치를 관리합니다.

### 브랜치 구조

```text
main
└── dev
    ├── feature/*
    ├── fix/*
    ├── refactor/*
    ├── docs/*
    └── chore/*
```

### 브랜치 설명

| 브랜치       | 설명                  |
| ------------ | --------------------- |
| `main`       | 배포 가능한 안정 버전 |
| `dev`        | 개발 브랜치           |
| `feature/*`  | 새로운 기능 개발      |
| `fix/*`      | 버그 수정             |
| `refactor/*` | 리팩토링              |
| `docs/*`     | 문서 수정             |
| `chore/*`    | 설정 및 환경 구성     |

### 브랜치 생성

```bash
git switch dev
git pull origin dev
git switch -c feature/login
```

### 작업 완료 후

```bash
git add .
git commit -m "feat: 로그인 기능 구현"
git push -u origin feature/login
```

GitHub에서 `dev` 브랜치로 Pull Request를 생성합니다.

---

## 📝 Commit Convention

커밋 메시지는 아래 형식을 사용합니다.

```text
type: 작업 내용
```

### Commit Type

| Type       | 설명                     |
| ---------- | ------------------------ |
| `feat`     | 새로운 기능 추가         |
| `fix`      | 버그 수정                |
| `refactor` | 기능 변경 없는 코드 개선 |
| `style`    | 코드 스타일 및 포맷 수정 |
| `docs`     | 문서 수정                |
| `test`     | 테스트 코드              |
| `chore`    | 설정, 패키지, 환경 구성  |
| `perf`     | 성능 개선                |
| `ci`       | CI/CD 설정               |
| `revert`   | 이전 커밋 되돌리기       |

### 예시

```text
feat: 로그인 기능 구현
fix: 헤더 레이아웃 수정
refactor: 인증 로직 분리
docs: README 수정
chore: 프로젝트 초기 설정
```

### 규칙

- 첫 글자는 소문자를 사용합니다.
- `type`과 `:` 사이에는 공백을 넣지 않습니다.
- `:` 뒤에는 한 칸 띄어 작성합니다.
- 하나의 커밋에는 하나의 작업만 포함합니다.
- 의미 있는 단위로 커밋합니다.

> Commitlint를 통해 올바르지 않은 커밋 메시지는 자동으로 차단됩니다.
