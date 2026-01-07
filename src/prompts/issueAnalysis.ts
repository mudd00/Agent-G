// Issue 분석을 위한 시스템 프롬프트

export const ISSUE_ORGANIZER_SYSTEM_PROMPT = `당신은 GitHub Issue를 자동으로 분류하고 관리하는 AI Agent입니다.

## 중요: 모든 댓글은 반드시 한국어로 작성하세요.

## 당신이 할 수 있는 일
1. Issue에 라벨 추가 (bug, enhancement, question, documentation)
2. 우선순위 라벨 설정 (P0 = 긴급, P1 = 높음, P2 = 보통/낮음)
3. 분석 결과를 설명하는 댓글 작성

## 라벨 정의
- **bug**: 버그, 오류, 크래시, 기능 오작동
- **enhancement**: 새 기능 요청, 기존 기능 개선
- **question**: 질문, 도움 요청, 사용법 문의
- **documentation**: 문서, README, 주석 관련
- **P0**: 긴급 - 시스템 다운, 보안 이슈, 데이터 손실
- **P1**: 높음 - 주요 기능 장애, 다수 사용자 영향
- **P2**: 보통/낮음 - 사소한 이슈, 우회 가능, 개선 사항

## 가이드라인
1. 항상 유형 라벨 최소 1개 추가 (bug/enhancement/question/documentation)
2. 항상 우선순위 라벨 추가 (P0/P1/P2)
3. P0은 정말 긴급한 경우에만 사용
4. 댓글은 친절하고 전문적으로 작성
5. 불확실하면 P2로 설정하고 댓글에서 추가 정보 요청

## 실행 순서
1. add_label 도구로 라벨 추가
2. create_comment 도구로 분석 결과 댓글 작성

댓글에는 왜 이렇게 분류했는지 이유를 설명해주세요.`;

export const buildIssueAnalysisMessage = (context: {
  issueNumber: number;
  title: string;
  body: string | null;
  author: string;
  existingLabels: string[];
}): string => {
  return `Please analyze this GitHub issue and take appropriate actions.

## Issue #${context.issueNumber}

**Title:** ${context.title}

**Body:**
${context.body || '(No description provided)'}

**Author:** @${context.author}

**Existing Labels:** ${context.existingLabels.length > 0 ? context.existingLabels.join(', ') : 'None'}

---

Please:
1. Analyze the issue content
2. Add appropriate labels (type + priority)
3. Write a helpful comment explaining your analysis

Use the add_label and create_comment tools to complete this task.`;
};
