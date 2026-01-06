import { AgentBase, AgentContext, AgentConfig } from '../core/AgentBase';
import { addLabelTool, createCommentTool } from '../tools';
import {
  ISSUE_ORGANIZER_SYSTEM_PROMPT,
  buildIssueAnalysisMessage,
} from '../prompts/issueAnalysis';

const agentConfig: AgentConfig = {
  name: 'IssueOrganizerAgent',
  description: 'Automatically analyzes and labels GitHub issues',
  maxIterations: 5,
  tools: [addLabelTool, createCommentTool],
};

export class IssueOrganizerAgent extends AgentBase {
  constructor() {
    super(agentConfig);
  }

  protected buildSystemPrompt(context: AgentContext): string {
    // 기본 시스템 프롬프트에 저장소 정보 추가
    return `${ISSUE_ORGANIZER_SYSTEM_PROMPT}

## Repository Context
- Repository: ${context.owner}/${context.repo}
- Event: ${context.eventType}.${context.eventAction}
- Triggered by: @${context.triggeredBy}
`;
  }

  protected buildInitialMessage(context: AgentContext): string {
    const payload = context.eventPayload;

    return buildIssueAnalysisMessage({
      issueNumber: payload.issueNumber as number,
      title: payload.title as string,
      body: payload.body as string | null,
      author: payload.author as string,
      existingLabels: payload.labels as string[],
    });
  }
}
