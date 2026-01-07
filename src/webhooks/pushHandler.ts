import { createOctokitForInstallation } from '../github/client';
import { AgentContext } from '../core/AgentBase';
import { ReadmeGeneratorAgent } from '../agents/ReadmeGeneratorAgent';
import { logger } from '../config';

// Push Webhook Payload 타입 (간소화)
interface PushPayload {
  ref: string; // "refs/heads/main"
  before: string;
  after: string;
  commits: Array<{
    id: string;
    message: string;
    added: string[];
    removed: string[];
    modified: string[];
  }>;
  repository: {
    name: string;
    full_name: string;
    default_branch: string;
    owner: { login: string };
  };
  installation?: {
    id: number;
  };
  sender: {
    login: string;
  };
}

export async function handlePushEvent(
  payload: Record<string, unknown>
): Promise<void> {
  const data = payload as unknown as PushPayload;
  const { ref, commits, repository, installation, sender } = data;

  // 브랜치 이름 추출
  const branch = ref.replace('refs/heads/', '');

  logger.info(`[PushHandler] Push to ${repository.full_name}:${branch}`);
  logger.info(`[PushHandler] ${commits.length} commit(s) by @${sender.login}`);

  if (!installation?.id) {
    logger.error('[PushHandler] No installation ID found');
    return;
  }

  // main/master 브랜치에 push된 경우에만 README 생성
  const isDefaultBranch = branch === repository.default_branch;

  if (!isDefaultBranch) {
    logger.debug(`[PushHandler] Not default branch (${repository.default_branch}), skipping`);
    return;
  }

  // 변경된 파일 목록 수집
  const allChangedFiles = new Set<string>();
  for (const commit of commits) {
    commit.added.forEach(f => allChangedFiles.add(f));
    commit.modified.forEach(f => allChangedFiles.add(f));
  }

  // 코드 파일이 변경된 경우에만 README 업데이트 고려
  const codeFilePatterns = ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.go'];
  const hasCodeChanges = [...allChangedFiles].some(file =>
    codeFilePatterns.some(ext => file.endsWith(ext))
  );

  if (!hasCodeChanges) {
    logger.debug('[PushHandler] No code file changes, skipping README generation');
    return;
  }

  // README.md가 이미 변경된 경우 스킵 (무한 루프 방지)
  if (allChangedFiles.has('README.md')) {
    logger.debug('[PushHandler] README.md was changed in this push, skipping');
    return;
  }

  const octokit = await createOctokitForInstallation(installation.id);

  const context: AgentContext = {
    owner: repository.owner.login,
    repo: repository.name,
    installationId: installation.id,
    eventType: 'push',
    eventAction: 'push',
    eventPayload: {
      branch,
      commits: commits.map(c => ({
        id: c.id,
        message: c.message,
      })),
      changedFiles: [...allChangedFiles],
    },
    triggeredBy: sender.login,
    triggeredAt: new Date(),
  };

  await generateReadme(context, octokit);
}

async function generateReadme(
  context: AgentContext,
  octokit: Awaited<ReturnType<typeof createOctokitForInstallation>>
): Promise<void> {
  logger.info(`[PushHandler] Generating README for ${context.owner}/${context.repo}`);

  try {
    const agent = new ReadmeGeneratorAgent();
    const result = await agent.run(context, octokit);

    if (result.success) {
      logger.info('[PushHandler] README generation completed', {
        actions: result.actions.length,
        inputTokens: result.totalInputTokens,
        outputTokens: result.totalOutputTokens,
      });
    } else {
      logger.error('[PushHandler] README generation failed:', result.error);
    }
  } catch (error) {
    logger.error('[PushHandler] Error generating README:', error);
  }
}
