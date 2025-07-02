# ACG 인트라넷 Admin

ACG 그룹의 내부 관리 시스템으로, 직원 관리, 근태, 식사, 복리후생, 활동 등을 종합적으로 관리할 수 있는 관리자용 웹 애플리케이션입니다.

## 🌐 배포 URL
- **운영 환경**: https://test-benefit-admin.insahr.co.kr

## 🚀 기술 스택

### Frontend
- **Framework**: Next.js 14.2.7
- **Language**: TypeScript
- **UI Library**: Mantine v7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS + PostCSS
- **Rich Text Editor**: Tiptap
- **Charts**: Recharts, Mantine Charts
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Utilities**: Lodash

### Development
- **Build Tool**: Next.js
- **Code Quality**: ESLint
- **Font**: Pretendard (로컬 폰트)
- **Icons**: Tabler Icons

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/                    # API 라우트
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── Global/            # 전역 컴포넌트
│   │   ├── activity/          # 활동 관련 컴포넌트
│   │   ├── attendance/        # 근태 관련 컴포넌트
│   │   ├── main/              # 메인 페이지 컴포넌트
│   │   ├── meal/              # 식사 관련 컴포넌트
│   │   ├── notice/            # 공지사항 컴포넌트
│   │   ├── staff/             # 직원 관리 컴포넌트
│   │   ├── vacation/          # 휴가 관리 컴포넌트
│   │   └── welfare/           # 복리후생 컴포넌트
│   ├── enums/                 # 열거형 정의
│   ├── hooks/                 # 커스텀 훅
│   ├── main/                  # 메인 페이지들
│   │   ├── activity/          # 활동 관리
│   │   ├── attendance/        # 근태 관리
│   │   ├── meal/              # 식사 관리
│   │   ├── notice/            # 공지사항 관리
│   │   ├── staff/             # 직원 관리
│   │   └── welfare/           # 복리후생 관리
│   ├── store/                 # 상태 관리
│   ├── type/                  # TypeScript 타입 정의
│   └── utils/                 # 유틸리티 함수
├── public/
│   ├── icons/                 # SVG 아이콘
│   └── images/                # 이미지 파일
```

## 🔧 주요 기능

### 📊 대시보드
- 직원 근태 현황 요약
- 월별 음료 소비 현황
- 공지사항 관리

### 👥 직원 관리
- 직원 정보 조회 및 수정
- 직원 등록/삭제
- 직원 상태 관리

### 🕐 근태 관리
- 출퇴근 기록 조회
- 근태 시간 수정
- 휴가 신청 및 승인 관리
- 근태 현황 통계

### 🍽️ 식사 관리
- 점심조 설정 및 관리
- 식비 정산 관리
- 월별 식사 예산 관리

### 🎉 활동 관리
- 회사 활동 및 이벤트 관리
- 활동 예산 및 정산
- 활동 참가자 관리

### 🎁 복리후생 관리
- 복리후생 프로그램 관리
- 예산 및 정산 관리
- 사용 현황 통계

### 📢 공지사항
- 공지사항 작성/수정/삭제
- 리치 텍스트 에디터 지원
- 파일 첨부 기능

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- npm, yarn, pnpm 또는 bun

### 설치
```bash
# 저장소 클론
git clone [repository-url]
cd acg-playground-admin

# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

### 코드 품질 검사
```bash
# ESLint 실행
npm run lint
```

## 🔗 주요 의존성

- **@mantine/core**: UI 컴포넌트 라이브러리
- **@tanstack/react-query**: 서버 상태 관리
- **zustand**: 클라이언트 상태 관리
- **@tiptap/react**: 리치 텍스트 에디터
- **dayjs**: 날짜 처리
- **axios**: HTTP 클라이언트
- **recharts**: 차트 라이브러리

## 📝 개발 가이드

### 컴포넌트 작성 규칙
- 기능별로 폴더를 구분하여 컴포넌트 작성
- TypeScript를 사용하여 타입 안정성 확보
- Mantine 컴포넌트를 기본으로 활용
- 재사용 가능한 컴포넌트는 `components/Global/` 폴더에 배치

### 상태 관리
- 전역 상태: Zustand 사용
- 서버 상태: TanStack Query 사용
- 로컬 상태: React hooks 사용

### API 통신
- `src/app/api/` 폴더의 `getApi.ts`, `postApi.ts` 활용
- Axios를 통한 HTTP 통신
- TanStack Query를 통한 캐싱 및 동기화

## 🎨 스타일링

- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Mantine**: 컴포넌트 라이브러리의 기본 스타일
- **CSS Modules**: 특정 컴포넌트별 스타일링
- **Pretendard**: 한글 최적화 폰트

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱 환경을 모두 지원하는 반응형 웹 애플리케이션입니다.

## 🔐 보안

- HTTPS 프로토콜 사용
- 환경 변수를 통한 민감 정보 관리
- CSP(Content Security Policy) 적용

## 📄 라이선스

이 프로젝트는 ACG 그룹의 내부 시스템으로, 상업적 목적으로 제한됩니다.

## 🤝 기여

내부 개발팀에서 관리하는 프로젝트입니다. 버그 리포트나 기능 제안은 내부 이슈 트래커를 통해 제출해 주세요.

---

**ACG 그룹 © 2024. All rights reserved.**