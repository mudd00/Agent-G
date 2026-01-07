# Agent-G

GitHub 저장소 관리를 자동화하는 AI Agent 시스템입니다. 다양한 GitHub 작업을 지능적으로 처리하여 개발 워크플로우를 개선합니다.

## 🚀 주요 기능

- **Issue 자동 정리**: 이슈를 분석하고 자동으로 라벨링 및 할당
- **PR 자동 리뷰**: Pull Request를 분석하여 코드 리뷰 및 피드백 제공
- **README 자동 생성**: 프로젝트 구조를 분석하여 README.md 자동 생성/업데이트
- **GitHub Webhook 지원**: 실시간 이벤트 처리를 통한 자동화
- **LLM 기반 지능형 처리**: 대화형 AI를 활용한 스마트한 작업 수행

## 🛠 기술 스택

- **언어**: TypeScript
- **런타임**: Node.js
- **AI/LLM**: 대화형 AI 모델 통합
- **API**: GitHub REST API
- **웹훅**: GitHub Webhooks

## 📦 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/mudd00/Agent-G.git
cd Agent-G
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 환경 변수 설정
```

4. TypeScript 컴파일 및 실행
```bash
npm run build
npm start
```

## 🎯 사용 방법

### 기본 서버 실행
```bash
npm start
```

### 개발 모드 실행
```bash
npm run dev
```

### Agent 사용 예시
```typescript
import { IssueOrganizerAgent } from './src/agents/IssueOrganizerAgent';
import { PRReviewerAgent } from './src/agents/PRReviewerAgent';
import { ReadmeGeneratorAgent } from './src/agents/ReadmeGeneratorAgent';

// Issue 자동 정리
const issueAgent = new IssueOrganizerAgent();
await issueAgent.processIssue(issueData);

// PR 자동 리뷰
const prAgent = new PRReviewerAgent();
await prAgent.reviewPullRequest(prData);

// README 자동 생성
const readmeAgent = new ReadmeGeneratorAgent();
await readmeAgent.generateReadme(repoData);
```

## 📁 프로젝트 구조

```
src/
├── agents/           # AI Agent 구현체들
│   ├── IssueOrganizerAgent.ts
│   ├── PRReviewerAgent.ts
│   └── ReadmeGeneratorAgent.ts
├── core/            # 핵심 시스템 컴포넌트
│   ├── AgentBase.ts
│   ├── LLMBrain.ts
│   └── ToolExecutor.ts
├── github/          # GitHub API 클라이언트
│   └── client.ts
├── tools/           # GitHub 작업 도구들
│   └── github/
│       ├── addLabel.ts
│       ├── assignUser.ts
│       ├── createComment.ts
│       ├── createOrUpdateFile.ts
│       ├── getPRDiff.ts
│       └── getRepoContents.ts
├── webhooks/        # GitHub Webhook 처리
├── prompts/         # AI 프롬프트 템플릿
├── config/          # 설정 파일들
└── server.ts        # 메인 서버 파일
```

## 🔧 환경 변수

`.env.example` 파일을 참고하여 다음 환경 변수들을 설정하세요:

- `GITHUB_TOKEN`: GitHub Personal Access Token
- `WEBHOOK_SECRET`: GitHub Webhook Secret
- `LLM_API_KEY`: AI 모델 API 키
- `PORT`: 서버 포트 (기본값: 3000)

## 🤝 기여 방법

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📝 진행 상황

프로젝트의 자세한 진행 상황은 [PROGRESS.md](./PROGRESS.md) 파일을 참고하세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참고하세요.

---

**Agent-G**로 GitHub 워크플로우를 자동화하고 개발 생산성을 향상시켜보세요! 🚀