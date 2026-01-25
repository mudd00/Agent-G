# Agent-G 🤖

GitHub 저장소를 위한 지능형 AI Agent 시스템입니다. 다양한 AI Agent들이 협력하여 GitHub 워크플로우를 자동화하고 개발 생산성을 향상시킵니다.

## 🚀 주요 기능

- **README 자동 생성**: 저장소 구조를 분석하여 README.md를 자동으로 생성하고 업데이트
- **PR 자동 리뷰**: Pull Request를 분석하고 코드 리뷰 및 피드백 제공
- **이슈 자동 정리**: GitHub Issues를 분석하고 분류하여 프로젝트 관리 지원
- **웹훅 기반 자동화**: GitHub 이벤트에 실시간으로 반응하여 자동화된 작업 수행
- **웹 대시보드**: 직관적인 웹 인터페이스를 통한 Agent 관리 및 모니터링

## 🛠 기술 스택

### Backend
- **Node.js** + **TypeScript**: 서버 사이드 로직
- **Express.js**: 웹 서버 및 API
- **GitHub API**: GitHub 저장소와의 통합
- **LLM Integration**: AI 기반 자동화 기능

### Frontend
- **React** + **TypeScript**: 사용자 인터페이스
- **Vite**: 빌드 도구 및 개발 서버
- **Tailwind CSS**: 스타일링
- **ESLint**: 코드 품질 관리

## 📦 설치 방법

### 1. 저장소 클론
```bash
git clone https://github.com/mudd00/Agent-G.git
cd Agent-G
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 환경 변수를 설정하세요
```

### 3. 백엔드 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 4. 프론트엔드 설치 및 실행
```bash
cd client
npm install
npm run dev
```

## 🎯 사용 방법

### GitHub 웹훅 설정
1. GitHub 저장소 Settings → Webhooks로 이동
2. 새 웹훅 추가: `http://your-server/webhooks/github`
3. 이벤트 선택: Push, Pull Request, Issues 등

### Agent 활용
- **README Generator**: 저장소에 push 이벤트 발생 시 자동으로 README.md 생성/업데이트
- **PR Reviewer**: Pull Request 생성 시 자동으로 코드 리뷰 및 피드백 제공
- **Issue Organizer**: 새 이슈 생성 시 자동으로 라벨링 및 분류

## 📁 프로젝트 구조

```
Agent-G/
├── src/
│   ├── agents/           # AI Agent 구현체들
│   │   ├── ReadmeGeneratorAgent.ts
│   │   ├── PRReviewerAgent.ts
│   │   └── IssueOrganizerAgent.ts
│   ├── core/            # 핵심 시스템 컴포넌트
│   │   ├── AgentBase.ts
│   │   ├── LLMBrain.ts
│   │   └── ToolExecutor.ts
│   ├── config/          # 설정 관리
│   ├── github/          # GitHub API 통합
│   ├── services/        # 비즈니스 로직
│   ├── tools/           # Agent 도구들
│   ├── webhooks/        # 웹훅 핸들러
│   └── server.ts        # 메인 서버
├── client/              # React 프론트엔드
└── PROGRESS.md          # 개발 진행 상황
```

## 🔧 개발 가이드

### 새로운 Agent 추가
1. `src/agents/` 폴더에 새 Agent 클래스 생성
2. `AgentBase`를 상속받아 구현
3. 필요한 도구들을 `src/tools/`에 추가
4. 웹훅 핸들러에 Agent 연결

### 환경 변수
- `GITHUB_TOKEN`: GitHub API 액세스 토큰
- `WEBHOOK_SECRET`: GitHub 웹훅 시크릿
- `LLM_API_KEY`: LLM 서비스 API 키

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📊 개발 현황

자세한 개발 진행 상황은 [PROGRESS.md](PROGRESS.md)를 참고하세요.

---

**Agent-G**로 GitHub 워크플로우를 자동화하고 개발 생산성을 높여보세요! 🚀