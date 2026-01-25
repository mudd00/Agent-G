# Agent-G

GitHub 저장소 관리를 자동화하는 AI Agent 시스템입니다. 웹훅을 통해 GitHub 이벤트를 감지하고, 다양한 AI Agent들이 자동으로 작업을 수행합니다.

## 🚀 주요 기능

- **자동 README 생성**: 저장소 구조를 분석하여 README.md를 자동 생성 및 업데이트
- **PR 자동 리뷰**: Pull Request에 대한 자동 코드 리뷰 및 피드백 제공
- **이슈 자동 정리**: GitHub Issues를 자동으로 분류하고 라벨링
- **실시간 웹훅 처리**: GitHub 이벤트를 실시간으로 감지하고 처리
- **웹 대시보드**: Agent 활동을 모니터링할 수 있는 웹 인터페이스

## 🛠 기술 스택

### 백엔드
- **Node.js** + **TypeScript**
- **Express.js** - 웹 서버 및 API
- **GitHub API** - GitHub 저장소 연동
- **AI/LLM Integration** - 자동화된 코드 분석 및 생성

### 프론트엔드
- **React** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **ESLint** - 코드 품질 관리

## 📦 설치 방법

### 1. 저장소 클론
```bash
git clone https://github.com/mudd00/Agent-G.git
cd Agent-G
```

### 2. 백엔드 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 GitHub 토큰 등 필요한 값들을 설정하세요
```

### 3. 프론트엔드 설정
```bash
cd client
npm install
```

### 4. 개발 서버 실행
```bash
# 백엔드 서버 (루트 디렉토리에서)
npm run dev

# 프론트엔드 서버 (client 디렉토리에서)
cd client
npm run dev
```

## 🎯 사용 방법

### 1. GitHub 웹훅 설정
1. GitHub 저장소의 Settings > Webhooks로 이동
2. 새 웹훅 추가: `http://your-server/webhooks/github`
3. 이벤트 선택: `Push`, `Pull requests`, `Issues` 등

### 2. Agent 활성화
서버가 실행되면 다음 Agent들이 자동으로 활성화됩니다:
- **ReadmeGeneratorAgent**: Push 이벤트 시 README.md 자동 생성/업데이트
- **PRReviewerAgent**: Pull Request 생성 시 자동 코드 리뷰
- **IssueOrganizerAgent**: Issue 생성 시 자동 분류 및 라벨링

### 3. 웹 대시보드 접속
`http://localhost:3000`에서 Agent 활동을 모니터링할 수 있습니다.

## 📁 프로젝트 구조

```
Agent-G/
├── src/
│   ├── agents/           # AI Agent 구현체들
│   │   ├── ReadmeGeneratorAgent.ts
│   │   ├── PRReviewerAgent.ts
│   │   └── IssueOrganizerAgent.ts
│   ├── config/           # 설정 파일들
│   ├── core/             # 핵심 시스템 로직
│   ├── github/           # GitHub API 연동
│   ├── prompts/          # AI 프롬프트 템플릿
│   ├── services/         # 비즈니스 로직 서비스
│   ├── tools/            # 유틸리티 도구들
│   ├── webhooks/         # 웹훅 처리 로직
│   └── server.ts         # 메인 서버 파일
├── client/               # React 프론트엔드
│   ├── src/
│   ├── public/
│   └── package.json
├── PROGRESS.md           # 개발 진행 상황
└── package.json
```

## 🔧 환경 변수 설정

`.env.example` 파일을 참고하여 다음 환경 변수들을 설정하세요:

```env
GITHUB_TOKEN=your_github_personal_access_token
WEBHOOK_SECRET=your_webhook_secret
PORT=3001
NODE_ENV=development
```

## 📈 개발 진행 상황

자세한 개발 진행 상황과 로드맵은 [PROGRESS.md](./PROGRESS.md) 파일을 참고하세요.

## 🤝 기여 방법

1. 이 저장소를 Fork합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

⭐ 이 프로젝트가 유용하다면 Star를 눌러주세요!