import { AgentBase, AgentContext, AgentConfig } from '../core/AgentBase';
import { addLabelTool, createCommentTool, getPRDiffTool } from '../tools';
import {
  PR_REVIEWER_SYSTEM_PROMPT,
  buildPRReviewMessage,
} from '../prompts/prReview';

const agentConfig: AgentConfig = {
  name: 'PRReviewerAgent',
  description: 'Automatically reviews GitHub Pull Requests',
  maxIterations: 7, // diff 가져오기 + 분석 + 라벨 + 댓글
  tools: [getPRDiffTool, addLabelTool, createCommentTool],
};

export class PRReviewerAgent extends AgentBase {
  constructor() {
    super(agentConfig);
  }

  protected buildSystemPrompt(context: AgentContext): string {
    return `${PR_REVIEWER_SYSTEM_PROMPT}

## Repository Context
- Repository: ${context.owner}/${context.repo}
- Event: ${context.eventType}.${context.eventAction}
- Triggered by: @${context.triggeredBy}
`;
  }

  protected buildInitialMessage(context: AgentContext): string {
    const payload = context.eventPayload;

    return buildPRReviewMessage({
      prNumber: payload.prNumber as number,
      title: payload.title as string,
      body: payload.body as string | null,
      author: payload.author as string,
      headBranch: payload.headBranch as string,
      baseBranch: payload.baseBranch as string,
      isDraft: payload.isDraft as boolean,
    });
  }
}
