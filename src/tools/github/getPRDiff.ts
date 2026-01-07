import { Octokit } from '@octokit/rest';
import { ToolDefinition } from '../../core/LLMBrain';
import { logger } from '../../config';

// Tool 정의 (Claude에게 알려줄 스키마)
export const getPRDiffTool: ToolDefinition = {
  name: 'get_pr_diff',
  description: 'PR의 변경된 파일과 코드 차이(diff)를 가져옵니다. 코드 리뷰를 위해 사용합니다.',
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
      pull_number: {
        type: 'number',
        description: 'PR 번호',
      },
    },
    required: ['owner', 'repo', 'pull_number'],
  },
};

// Tool 입력 타입
export interface GetPRDiffInput {
  owner: string;
  repo: string;
  pull_number: number;
}

// 변경된 파일 정보
export interface FileChange {
  filename: string;
  status: string; // added, removed, modified, renamed
  additions: number;
  deletions: number;
  patch?: string; // 실제 diff 내용
}

// Tool 실행 결과
export interface PRDiffResult {
  totalFiles: number;
  totalAdditions: number;
  totalDeletions: number;
  files: FileChange[];
}

// Tool 실행 함수
export async function getPRDiff(
  octokit: Octokit,
  input: GetPRDiffInput
): Promise<PRDiffResult> {
  const { owner, repo, pull_number } = input;

  logger.info(`Getting diff for ${owner}/${repo}#${pull_number}`);

  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number,
    per_page: 100, // 최대 100개 파일
  });

  const fileChanges: FileChange[] = files.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch, // diff 내용 (큰 파일은 없을 수 있음)
  }));

  const result: PRDiffResult = {
    totalFiles: files.length,
    totalAdditions: files.reduce((sum, f) => sum + f.additions, 0),
    totalDeletions: files.reduce((sum, f) => sum + f.deletions, 0),
    files: fileChanges,
  };

  logger.info(`PR diff: ${result.totalFiles} files, +${result.totalAdditions}/-${result.totalDeletions}`);

  return result;
}
