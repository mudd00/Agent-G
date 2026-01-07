import { Octokit } from '@octokit/rest';
import { ToolDefinition } from '../../core/LLMBrain';
import { logger } from '../../config';

// Tool 정의
export const createOrUpdateFileTool: ToolDefinition = {
  name: 'create_or_update_file',
  description: 'GitHub 저장소에 파일을 생성하거나 수정합니다. README.md 등의 파일을 자동으로 생성/업데이트할 때 사용합니다.',
  input_schema: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        description: '저장소 소유자',
      },
      repo: {
        type: 'string',
        description: '저장소 이름',
      },
      path: {
        type: 'string',
        description: '파일 경로 (예: README.md)',
      },
      content: {
        type: 'string',
        description: '파일 내용',
      },
      message: {
        type: 'string',
        description: '커밋 메시지',
      },
      branch: {
        type: 'string',
        description: '브랜치 이름 (기본: main)',
      },
    },
    required: ['owner', 'repo', 'path', 'content', 'message'],
  },
};

// Tool 입력 타입
export interface CreateOrUpdateFileInput {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
}

// Tool 실행 결과
export interface CreateOrUpdateFileResult {
  success: boolean;
  action: 'created' | 'updated';
  commitSha: string;
  url: string;
}

// Tool 실행 함수
export async function createOrUpdateFile(
  octokit: Octokit,
  input: CreateOrUpdateFileInput
): Promise<CreateOrUpdateFileResult> {
  const { owner, repo, path, content, message, branch = 'main' } = input;

  logger.info(`Creating/updating file: ${owner}/${repo}/${path}`);

  // 기존 파일 확인 (SHA 가져오기)
  let existingSha: string | undefined;
  try {
    const { data: existingFile } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (!Array.isArray(existingFile) && existingFile.type === 'file') {
      existingSha = existingFile.sha;
      logger.debug(`Existing file found, SHA: ${existingSha}`);
    }
  } catch (error: unknown) {
    // 파일이 없으면 404, 새로 생성
    if ((error as { status?: number }).status !== 404) {
      throw error;
    }
    logger.debug('File does not exist, will create new');
  }

  // 파일 생성 또는 업데이트
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
    sha: existingSha,
  });

  const action = existingSha ? 'updated' : 'created';

  logger.info(`File ${action}: ${path}`);
  logger.debug(`Commit SHA: ${data.commit.sha}`);

  return {
    success: true,
    action,
    commitSha: data.commit.sha || '',
    url: data.content?.html_url || '',
  };
}
