# 🚚 MOVING Frontend

무빙(MOVING) 프로젝트의 프론트엔드 저장소입니다.

본 저장소는 Next.js 기반으로 개발되며, 초기 개발 환경 설정과 협업을 위한 규칙을 관리합니다.

---

## 배포주소

[무빙](https://moving-frontend-p2ol.vercel.app/)

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

---

# 🚀 Cursor + Figma MCP 사용 가이드

> 우리 프로젝트는 Cursor AI와 Figma MCP를 활용하여 디자인을 빠르고 일관성 있게 구현합니다.

---

# 1. Cursor 설치

최신 Cursor를 설치합니다.

https://cursor.com

---

# 2. 프로젝트 열기

프로젝트 Root를 Cursor에서 엽니다.

```text
moving/
```

---

# 3. 프로젝트 규칙

프로젝트에는 아래 규칙 파일이 포함되어 있습니다.

```text
.cursor/
└── rules/
    ├── project.mdc
    └── figma.mdc
```

Cursor는 프로젝트를 열면 위 규칙을 자동으로 적용합니다.

별도의 설정은 필요하지 않습니다.

---

# 4. Figma MCP 연결

## Remote MCP

Cursor에서 아래 명령어를 실행합니다.

```text
/add-plugin figma
```

또는

```
Settings
→ MCP
→ Add Plugin
→ Figma
```

---

## Desktop MCP

1. Figma Desktop 실행
2. Dev Mode 활성화
3. Desktop MCP Server 활성화

Cursor의 `mcp.json`

```json
{
  "mcpServers": {
    "Figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {}
    },
    "figma-desktop": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

---

# 5. 권장 작업 순서

```text
Figma Frame 선택

↓

Cursor 화면 분석

↓

기존 프로젝트 분석

↓

공통 컴포넌트 확인

↓

구현

↓

직접 검토
```

---

# 6. 추천 프롬프트

## 화면 분석

```text
figma-desktop MCP를 사용해서 현재 선택한 Frame을 분석해줘.

다음 내용을 정리해줘.

- 화면 구조
- 컴포넌트
- Typography
- Color
- Spacing
- Auto Layout

아직 코드는 작성하지 마.
```

---

## 화면 구현

```text
project.mdc와 figma.mdc 규칙을 적용해서 현재 선택한 Frame을 구현해줘.

조건
- 프로젝트 구조 먼저 분석
- 기존 공통 컴포넌트 재사용
- 디자인 토큰 사용
- TypeScript 사용
- TailwindCSS 사용
- 반응형 구현
```

---

## 특정 컴포넌트 구현

```text
현재 선택한 컴포넌트를 프로젝트 규칙에 맞게 구현해줘.

기존 공통 컴포넌트가 있다면 재사용해.
```

---

# 7. 프로젝트 규칙

## ✅ 반드시

- 프로젝트 구조를 먼저 분석합니다.
- 구현 전에 기존 공통 컴포넌트가 있는지 먼저 확인합니다.
- 동일하거나 유사한 공통 컴포넌트가 있다면 **새로 만들지 않고 반드시 재사용합니다.**
- 공통 컴포넌트 수정이 필요한 경우에는 기존 컴포넌트를 확장하거나 props를 추가하는 방식을 우선 고려합니다.
- 디자인 토큰을 사용합니다.
- TypeScript를 사용합니다.
- TailwindCSS를 사용합니다.
- 프로젝트 구조를 유지합니다.

## ❌ 금지

- 기존 공통 컴포넌트가 있는데 새로 생성하는 행위
- 디자인 하드코딩
- any 사용
- 중복 컴포넌트 생성
- 기존 프로젝트 구조 변경

---

# 💡 AI 활용 원칙

Cursor는 **프로젝트 구조와 디자인 시스템을 이해하고 구현을 도와주는 AI 페어 프로그래머**로 사용합니다.

AI가 생성한 코드는 반드시 검토한 후 반영하며, 기존 프로젝트의 컴포넌트와 디자인 토큰을 우선적으로 재사용합니다.
