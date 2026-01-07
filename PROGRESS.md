# Agent-G 프로젝트 진행 상황

> 이 파일은 Claude AI가 작업을 이어서 진행할 수 있도록 현재 상태와 다음 단계를 기록합니다.
> 새 세션에서 이 파일을 먼저 읽어주세요.

---

## 프로젝트 개요

GitHub 저장소를 자동으로 관리하는 Agent AI 시스템.
- **핵심**: 이벤트 기반 자율 동작 (사용자 명령 없이 자동 처리)
- **트리거**: GitHub Webhook (Issue/PR 생성 시 자동 실행)
- **두뇌**: Claude API로 상황 판단
- **행동**: GitHub API로 라벨 추가, 댓글 작성 등

---

## 완료된 작업

### Phase 1: 기반 구축 ✅ 완료

- [x] 개발 환경 설정 (package.json, tsconfig.json)
- [x] Express 서버 (src/server.ts)
- [x] 환경 변수 관리 (src/config/index.ts)
- [x] Claude API 연동 (src/core/LLMBrain.ts)
- [x] GitHub App 인증 (src/github/client.ts)
- [x] GitHub Tools (src/tools/github/*.ts)
  - addLabel, createComment, assignUser
- [x] Agent 기본 클래스 (src/core/AgentBase.ts)
- [x] Tool 실행기 (src/core/ToolExecutor.ts)
- [x] Webhook 라우터 (src/webhooks/router.ts)
- [x] Issue/PR 핸들러 (src/webhooks/*.ts)

### Phase 2: Issue Organizer Agent ✅ 완료

- [x] Issue 분석 프롬프트 (src/prompts/issueAnalysis.ts)
- [x] IssueOrganizerAgent 클래스 (src/agents/IssueOrganizerAgent.ts)
- [x] issueHandler에서 Agent 호출 연결

### Phase 3: PR Reviewer Agent ✅ 완료

- [x] PR 리뷰 프롬프트 (src/prompts/prReview.ts)
- [x] PRReviewerAgent 클래스 (src/agents/PRReviewerAgent.ts)
- [x] prHandler에서 Agent 호출 연결
- [x] PR diff 가져오기 도구 (src/tools/github/getPRDiff.ts)
- [x] 실제 코드 변경사항 분석 기능

---

## 현재 상태

**Phase 3 완료, Phase 4 진행 예정**

```
npm install ✅ 완료
npm run typecheck ✅ 통과
서버 실행 ✅ 정상
Webhook 연결 ✅ 성공
Issue 자동 분류 ✅ 테스트 완료
한글 댓글 ✅ 적용됨
PR diff 분석 ✅ 실제 코드 리뷰 가능
```

---

## 테스트 환경

- **테스트 저장소**: https://github.com/mudd00/Agent-G (프로젝트 저장소 겸용)
- **GitHub App 설치 대상**: mudd00/Agent-G

---

## 다음 단계: 테스트 설정

### 1. 사용자가 해야 할 일

#### A. Anthropic API 키 발급
- https://console.anthropic.com/ 에서 API 키 생성

#### B. GitHub App 생성
1. https://github.com/settings/apps → New GitHub App
2. 설정:
   - App name: Agent-G
   - Webhook URL: (ngrok URL - 나중에 설정)
   - Webhook secret: 임의 문자열
3. 권한:
   - Issues: Read and write
   - Metadata: Read-only
   - Pull requests: Read and write
4. 이벤트 구독:
   - Issues ✅
   - Pull request ✅
5. 생성 후:
   - App ID 복사
   - Private key 다운로드 (.pem 파일)

#### C. 테스트 저장소에 App 설치
- GitHub App 설정 → Install App → 테스트 저장소 선택

### 2. Claude가 도와줄 일

#### A. .env 파일 설정
```bash
cp .env.example .env
# 사용자가 값 입력
```

#### B. 서버 실행 테스트
```bash
npm run dev
```

#### C. ngrok 설정
```bash
ngrok http 3000
# ngrok URL을 GitHub App Webhook URL에 입력
```

#### D. 테스트 Issue 생성
- 테스트 저장소에 Issue 생성
- Agent가 자동으로 라벨 + 댓글 추가하는지 확인

---

## 이후 Phase (아직 안 함)

### Phase 3: PR Reviewer Agent
- PRReviewerAgent 클래스 구현
- 코드 리뷰 프롬프트 작성
- prHandler에서 Agent 호출 연결

### Phase 4: README Generator Agent
- ReadmeGeneratorAgent 클래스 구현
- Push 이벤트 핸들러 구현

### Phase 5: 고도화
- Supabase 연동 (작업 이력 저장)
- 대시보드 UI (선택)
- 여러 저장소 지원

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Language | TypeScript |
| Runtime | Node.js 20+ Express |
| AI | Claude API (Sonnet) |
| GitHub | GitHub App + Octokit |
| 배포 | Railway (예정) |
| 개발 | ngrok |

---

## 설계 결정 및 이유

### 1. TypeScript 선택 이유 (vs JavaScript)

| 장점 | 설명 |
|------|------|
| **타입 안전성** | Claude API, Octokit 사용 시 실수 방지 |
| **IDE 자동완성** | 메서드/파라미터 자동 제안으로 개발 속도 향상 |
| **리팩토링 안전** | 변수명 변경 시 관련 코드 자동 업데이트 |
| **포트폴리오 가치** | 기업들이 TypeScript 선호하는 추세 |

JavaScript는 빠르게 시작할 수 있지만, Agent 프로젝트는 데이터 흐름이 복잡해서 타입이 없으면 디버깅이 힘듦.

### 2. GitHub App 선택 이유 (vs Personal Access Token)

| 구분 | GitHub App | PAT |
|------|------------|-----|
| **인증 주체** | App (봇 계정) | 개인 계정 |
| **권한 범위** | 저장소별로 세분화 | 계정 전체 |
| **보안** | 키 노출 시 영향 제한적 | 키 노출 시 계정 전체 위험 |
| **프로페셔널** | "agent-g[bot]"으로 표시 | 개인 이름으로 표시 |

GitHub App은 설정이 조금 복잡하지만:
- 진짜 Agent 느낌 (봇이 저장소에 설치되는 구조)
- 포트폴리오로 보여줄 때 훨씬 프로페셔널
- 다른 사람 저장소에도 설치 가능

### 3. Claude 모델 선택: Sonnet

| 모델 | 비용 (1M 토큰) | 용도 |
|------|---------------|------|
| Haiku | 입력 $0.25 / 출력 $1.25 | 간단한 분류 |
| **Sonnet** | 입력 $3 / 출력 $15 | ✅ Issue 분석에 적합 |
| Opus | 입력 $15 / 출력 $75 | 복잡한 추론 |

Issue 하나 분석 비용: 약 $0.008 (약 10원)
→ 1000개 Issue 처리해도 약 10,000원

### 4. Agent vs 일반 자동화의 차이

```
[일반 자동화]
if "bug" in title → add "bug" label
(정해진 규칙대로만 실행)

[Agent AI]
LLM이 전체 내용 분석 → "이건 기능 요청인데 버그로 착각한 것 같네"
→ enhancement 라벨 추가
(상황을 이해하고 판단)
```

### 5. 전체 동작 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. GitHub에서 Issue 생성                                        │
│    └─ 사용자가 "버그 발견: 로그인이 안 됩니다" Issue 작성          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. GitHub → 우리 서버로 Webhook POST                            │
│    { action: "opened", issue: { title: "...", body: "..." } }   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Webhook Router → issueHandler → IssueOrganizerAgent          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Agent가 Claude API 호출                                      │
│    "이 Issue를 분석해서 라벨과 우선순위를 정해줘"                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Claude 응답 + Tool 호출                                      │
│    "이건 로그인 버그네. bug, P1 라벨 추가할게"                    │
│    → add_label(["bug", "P1"])                                   │
│    → create_comment("버그로 분류했습니다...")                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. GitHub에 반영                                                │
│    - Issue에 bug, P1 라벨 추가됨                                 │
│    - Agent 분석 결과 댓글 작성됨                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6. 핵심 컴포넌트 역할

| 컴포넌트 | 파일 | 역할 |
|----------|------|------|
| **LLMBrain** | core/LLMBrain.ts | Claude API 래퍼, Tool calling 지원 |
| **AgentBase** | core/AgentBase.ts | Agent 기본 클래스, Think-Act 루프 |
| **ToolExecutor** | core/ToolExecutor.ts | Tool 실행 및 결과 관리 |
| **Tools** | tools/github/*.ts | GitHub API 호출 (라벨, 댓글 등) |
| **Webhook Router** | webhooks/router.ts | GitHub 이벤트 수신 및 라우팅 |
| **Handlers** | webhooks/*Handler.ts | 이벤트별 처리 및 Agent 호출 |

### 7. 추가 설계 결정

| 항목 | 결정 | 이유 |
|------|------|------|
| **라벨 세트** | bug, enhancement, question, documentation, P0/P1/P2 | 범용적이고 직관적 |
| **알림 방식** | 댓글로 분석 결과 설명 | 투명성, 사용자가 Agent 동작 이해 |
| **로그 수준** | 상세 로그 | 디버깅 용이, API 비용과 무관 |
| **에러 처리** | 에러 시 사과 댓글 | 사용자에게 피드백 제공 |
| **웹 UI** | Phase 5에서 추가 | MVP는 코드 우선 |

---

## 프로젝트 구조

```
Agent-G/
├── src/
│   ├── agents/
│   │   └── IssueOrganizerAgent.ts
│   ├── config/
│   │   └── index.ts
│   ├── core/
│   │   ├── AgentBase.ts
│   │   ├── LLMBrain.ts
│   │   └── ToolExecutor.ts
│   ├── github/
│   │   └── client.ts
│   ├── prompts/
│   │   └── issueAnalysis.ts
│   ├── tools/
│   │   ├── github/
│   │   │   ├── addLabel.ts
│   │   │   ├── createComment.ts
│   │   │   └── assignUser.ts
│   │   └── index.ts
│   ├── webhooks/
│   │   ├── issueHandler.ts
│   │   ├── prHandler.ts
│   │   └── router.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── PROGRESS.md          ← 이 파일
└── README.md
```

---

## 새 세션에서 작업 이어가기

```
1. 이 파일(PROGRESS.md) 읽기
2. "다음 단계" 섹션부터 진행
3. 사용자가 GitHub App 생성 완료했는지 확인
4. .env 설정 → 서버 실행 → ngrok → 테스트
```
