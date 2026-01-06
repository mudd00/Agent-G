import { createOctokitForInstallation } from '../github/client';
import { AgentContext } from '../core/AgentBase';
import { logger } from '../config';

// PR Webhook Payload 타입 (간소화)
interface PRPayload {
  action: string;
  number: number;
  pull_request: {
    number: number;
    title: string;
    body: string | null;
    user: { login: string };
    head: { ref: string; sha: string };
    base: { ref: string };
    state: string;
    draft: boolean;
    merged: boolean;
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

export async function handlePREvent(
  payload: Record<string, unknown>
): Promise<void> {
  const data = payload as unknown as PRPayload;
  const { action, pull_request, repository, installation, sender } = data;

  logger.info(`[PRHandler] Processing PR #${pull_request.number}: ${action}`);

  if (!installation?.id) {
    logger.error('[PRHandler] No installation ID found');
    return;
  }

  const octokit = await createOctokitForInstallation(installation.id);

  const context: AgentContext = {
    owner: repository.owner.login,
    repo: repository.name,
    installationId: installation.id,
    eventType: 'pull_request',
    eventAction: action,
    eventPayload: {
      prNumber: pull_request.number,
      title: pull_request.title,
      body: pull_request.body,
      author: pull_request.user.login,
      headBranch: pull_request.head.ref,
      headSha: pull_request.head.sha,
      baseBranch: pull_request.base.ref,
      isDraft: pull_request.draft,
      state: pull_request.state,
    },
    triggeredBy: sender.login,
    triggeredAt: new Date(),
  };

  switch (action) {
    case 'opened':
      await handlePROpened(context, octokit);
      break;

    case 'synchronize':
      logger.info('[PRHandler] PR updated with new commits');
      break;

    case 'ready_for_review':
      logger.info('[PRHandler] PR marked ready for review');
      break;

    default:
      logger.debug(`[PRHandler] Unhandled action: ${action}`);
  }
}

async function handlePROpened(
  context: AgentContext,
  octokit: Awaited<ReturnType<typeof createOctokitForInstallation>>
): Promise<void> {
  logger.info(`[PRHandler] New PR opened: #${context.eventPayload.prNumber}`);
  logger.info(`[PRHandler] Title: ${context.eventPayload.title}`);

  // Phase 3에서 PRReviewerAgent 구현 후 활성화
  // const agent = new PRReviewerAgent();
  // const result = await agent.run(context, octokit);

  // 임시: 간단한 메시지 (Phase 1 테스트용)
  try {
    await octokit.issues.createComment({
      owner: context.owner,
      repo: context.repo,
      issue_number: context.eventPayload.prNumber as number,
      body: `👋 Thanks for the PR, @${context.triggeredBy}!\n\n🤖 **Agent-G** will review this code and provide feedback shortly.\n\n_This is a placeholder message from Phase 1._`,
    });
    logger.info('[PRHandler] Placeholder comment created');
  } catch (error) {
    logger.error('[PRHandler] Failed to create comment:', error);
  }
}
