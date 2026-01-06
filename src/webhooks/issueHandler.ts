import { createOctokitForInstallation } from '../github/client';
import { AgentContext } from '../core/AgentBase';
import { IssueOrganizerAgent } from '../agents/IssueOrganizerAgent';
import { logger } from '../config';

// Issue Webhook Payload 타입 (간소화)
interface IssuePayload {
  action: string;
  issue: {
    number: number;
    title: string;
    body: string | null;
    user: { login: string };
    labels: Array<{ name: string }>;
    state: string;
  };
  repository: {
    name: string;
    owner: { login: string };
    full_name: string;
  };
  installation?: {
    id: number;
  };
  sender: {
    login: string;
  };
}

export async function handleIssueEvent(
  payload: Record<string, unknown>
): Promise<void> {
  const data = payload as unknown as IssuePayload;
  const { action, issue, repository, installation, sender } = data;

  logger.info(`[IssueHandler] Processing issue #${issue.number}: ${action}`);

  // Installation ID 확인
  if (!installation?.id) {
    logger.error('[IssueHandler] No installation ID found');
    return;
  }

  // Octokit 인스턴스 생성
  const octokit = await createOctokitForInstallation(installation.id);

  // Agent Context 생성
  const context: AgentContext = {
    owner: repository.owner.login,
    repo: repository.name,
    installationId: installation.id,
    eventType: 'issues',
    eventAction: action,
    eventPayload: {
      issueNumber: issue.number,
      title: issue.title,
      body: issue.body,
      author: issue.user.login,
      labels: issue.labels.map((l) => l.name),
      state: issue.state,
    },
    triggeredBy: sender.login,
    triggeredAt: new Date(),
  };

  // 액션별 처리
  switch (action) {
    case 'opened':
      await handleIssueOpened(context, octokit);
      break;

    case 'edited':
      logger.info('[IssueHandler] Issue edited - could trigger re-analysis');
      break;

    case 'labeled':
      logger.info('[IssueHandler] Issue labeled');
      break;

    default:
      logger.debug(`[IssueHandler] Unhandled action: ${action}`);
  }
}

async function handleIssueOpened(
  context: AgentContext,
  octokit: Awaited<ReturnType<typeof createOctokitForInstallation>>
): Promise<void> {
  logger.info(
    `[IssueHandler] New issue opened: #${context.eventPayload.issueNumber}`
  );
  logger.info(`[IssueHandler] Title: ${context.eventPayload.title}`);

  // IssueOrganizerAgent 실행
  try {
    const agent = new IssueOrganizerAgent();
    const result = await agent.run(context, octokit);

    if (result.success) {
      logger.info('[IssueHandler] Agent completed successfully', {
        actions: result.actions.length,
        inputTokens: result.totalInputTokens,
        outputTokens: result.totalOutputTokens,
      });
    } else {
      logger.error('[IssueHandler] Agent failed:', result.error);

      // Agent 실패 시 에러 댓글 작성
      await octokit.issues.createComment({
        owner: context.owner,
        repo: context.repo,
        issue_number: context.eventPayload.issueNumber as number,
        body: `Sorry, I encountered an error while analyzing this issue. A maintainer will review it manually.\n\n_Error: ${result.error}_`,
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('[IssueHandler] Unexpected error:', errorMessage);
  }
}
