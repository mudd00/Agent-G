# Agent-G

GitHub 저장소를 자동으로 관리하는 AI 에이전트 시스템입니다. 이슈 정리, PR 리뷰, README 생성 등의 작업을 자동화하여 개발 워크플로우를 개선합니다.

## 🚀 주요 기능

- **이슈 자동 정리**: 중복 이슈 감지 및 라벨링 자동화
- **PR 자동 리뷰**: 코드 품질 검토 및 개선 제안
- **README 자동 생성**: 프로젝트 구조 분석 후 문서 자동 생성
- **GitHub 웹훅 통합**: 실시간 저장소 이벤트 처리
- **웹 대시보드**: 에이전트 활동 모니터링 및 관리

## 🛠 기술 스택

### 백엔드
- **Node.js** + **TypeScript**
- **Express.js** - 웹 서버 및 API
- **GitHub API** - 저장소 연동
- **LLM 통합** - AI 기반 자동화

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

### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 열어 필요한 환경 변수를 설정하세요
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
1. GitHub 저장소 Settings → Webhooks
2. Payload URL: `http://your-server/webhooks/github`
3. Content type: `application/json`
4. 이벤트: Issues, Pull requests, Push 등 선택

### 에이전트 활성화
웹 대시보드에서 원하는 에이전트를 활성화하고 설정을 조정할 수 있습니다.

## 📁 프로젝트 구조

```
Agent-G/
├── src/                    # 백엔드 소스 코드
│   ├── agents/            # AI 에이전트 구현체
│   │   ├── IssueOrganizerAgent.ts
│   │   ├── PRReviewerAgent.ts
│   │   └── ReadmeGeneratorAgent.ts
│   ├── core/              # 핵심 시스템
│   │   ├── AgentBase.ts   # 에이전트 기본 클래스
│   │   ├── LLMBrain.ts    # LLM 통합 모듈
│   │   └── ToolExecutor.ts
│   ├── github/            # GitHub API 연동
│   ├── services/          # 비즈니스 로직
│   ├── tools/             # 도구 및 유틸리티
│   ├── webhooks/          # 웹훅 핸들러
│   └── server.ts          # 메인 서버
├── client/                # 프론트엔드 (React)
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   └── App.tsx
│   └── package.json
├── package.json
└── tsconfig.json
```

## 🔧 개발 가이드

### 새로운 에이전트 추가
1. `src/agents/` 디렉토리에 새 에이전트 파일 생성
2. `AgentBase` 클래스를 상속받아 구현
3. 필요한 도구와 프롬프트 정의
4. 서버에 에이전트 등록

### 환경 변수
- `GITHUB_TOKEN`: GitHub API 토큰
- `OPENAI_API_KEY`: OpenAI API 키 (또는 다른 LLM 제공자)
- `PORT`: 서버 포트 (기본: 3000)

## 📈 진행 상황

프로젝트의 상세한 개발 진행 상황은 [PROGRESS.md](./PROGRESS.md)에서 확인할 수 있습니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

**Agent-G**로 GitHub 워크플로우를 자동화하고 개발 생산성을 향상시켜보세요! 🚀