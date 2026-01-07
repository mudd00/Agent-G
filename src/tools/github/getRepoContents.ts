import { Octokit } from '@octokit/rest';
import { ToolDefinition } from '../../core/LLMBrain';
import { logger } from '../../config';

// Tool 정의
export const getRepoContentsTool: ToolDefinition = {
  name: 'get_repo_contents',
  description: '저장소의 파일/폴더 구조를 가져옵니다. README 생성을 위해 프로젝트 구조를 파악할 때 사용합니다.',
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
        description: '조회할 경로 (기본: 루트)',
      },
    },
    required: ['owner', 'repo'],
  },
};

// Tool 입력 타입
export interface GetRepoContentsInput {
  owner: string;
  repo: string;
  path?: string;
}

// 파일/폴더 정보
export interface RepoItem {
  name: string;
  type: 'file' | 'dir';
  path: string;
  size?: number;
}

// Tool 실행 결과
export interface GetRepoContentsResult {
  items: RepoItem[];
  totalFiles: number;
  totalDirs: number;
}

// Tool 실행 함수
export async function getRepoContents(
  octokit: Octokit,
  input: GetRepoContentsInput
): Promise<GetRepoContentsResult> {
  const { owner, repo, path = '' } = input;

  logger.info(`Getting contents of ${owner}/${repo}/${path || '(root)'}`);

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  // 단일 파일인 경우
  if (!Array.isArray(data)) {
    return {
      items: [{
        name: data.name,
        type: 'file',
        path: data.path,
        size: data.size,
      }],
      totalFiles: 1,
      totalDirs: 0,
    };
  }

  // 디렉토리인 경우
  const items: RepoItem[] = data.map(item => ({
    name: item.name,
    type: item.type === 'dir' ? 'dir' : 'file',
    path: item.path,
    size: item.size,
  }));

  const totalFiles = items.filter(i => i.type === 'file').length;
  const totalDirs = items.filter(i => i.type === 'dir').length;

  logger.info(`Found ${totalFiles} files, ${totalDirs} directories`);

  return {
    items,
    totalFiles,
    totalDirs,
  };
}
