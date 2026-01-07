import { Octokit } from '@octokit/rest';
import { ToolDefinition } from '../core/LLMBrain';
import { logger } from '../config';

// GitHub Tools
import {
  addLabelTool,
  addLabel,
  AddLabelInput,
} from './github/addLabel';
import {
  createCommentTool,
  createComment,
  CreateCommentInput,
} from './github/createComment';
import {
  assignUserTool,
  assignUser,
  AssignUserInput,
} from './github/assignUser';
import {
  getPRDiffTool,
  getPRDiff,
  GetPRDiffInput,
} from './github/getPRDiff';

// 모든 Tool 정의 내보내기
export const allTools: ToolDefinition[] = [
  addLabelTool,
  createCommentTool,
  assignUserTool,
  getPRDiffTool,
];

// Tool 이름으로 Tool 정의 찾기
export function getToolDefinition(name: string): ToolDefinition | undefined {
  return allTools.find((t) => t.name === name);
}

// Tool 실행 타입 정의
export type ToolInput =
  | { name: 'add_label'; input: AddLabelInput }
  | { name: 'create_comment'; input: CreateCommentInput }
  | { name: 'assign_user'; input: AssignUserInput }
  | { name: 'get_pr_diff'; input: GetPRDiffInput };

// Tool 실행 함수
export async function executeTool(
  octokit: Octokit,
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  logger.debug(`Executing tool: ${toolName}`);
  logger.debug('Tool input:', JSON.stringify(input, null, 2));

  const startTime = Date.now();

  try {
    let result: unknown;

    switch (toolName) {
      case 'add_label':
        result = await addLabel(octokit, input as AddLabelInput);
        break;
      case 'create_comment':
        result = await createComment(octokit, input as CreateCommentInput);
        break;
      case 'assign_user':
        result = await assignUser(octokit, input as AssignUserInput);
        break;
      case 'get_pr_diff':
        result = await getPRDiff(octokit, input as unknown as GetPRDiffInput);
        break;
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    const duration = Date.now() - startTime;
    logger.debug(`Tool ${toolName} completed in ${duration}ms`);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Tool ${toolName} failed after ${duration}ms:`, error);
    throw error;
  }
}

// 재내보내기
export { addLabelTool, createCommentTool, assignUserTool, getPRDiffTool };
export type { AddLabelInput, CreateCommentInput, AssignUserInput, GetPRDiffInput };
