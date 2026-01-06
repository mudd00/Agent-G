import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { ToolDefinition } from '../../core/LLMBrain';
import { logger } from '../../config';

// 입력 스키마
export const createCommentInputSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  issue_number: z.number(),
  body: z.string().describe('Comment body in markdown'),
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

// Tool 정의 (Claude에게 제공)
export const createCommentTool: ToolDefinition = {
  name: 'create_comment',
  description:
    'Create a comment on a GitHub issue or pull request. Use this to explain your analysis, provide feedback, or communicate with the issue author.',
  input_schema: {
    type: 'object',
    properties: {
      issue_number: {
        type: 'number',
        description: 'The issue or PR number to comment on',
      },
      body: {
        type: 'string',
        description:
          'The comment content in markdown format. Be helpful and professional.',
      },
    },
    required: ['issue_number', 'body'],
  },
};

// Tool 실행 함수
export async function createComment(
  octokit: Octokit,
  input: CreateCommentInput
): Promise<{ success: boolean; commentId: number; url: string }> {
  const validated = createCommentInputSchema.parse(input);

  logger.info(
    `Creating comment on ${validated.owner}/${validated.repo}#${validated.issue_number}`
  );
  logger.debug('Comment body:', validated.body.substring(0, 100) + '...');

  const response = await octokit.issues.createComment({
    owner: validated.owner,
    repo: validated.repo,
    issue_number: validated.issue_number,
    body: validated.body,
  });

  logger.info('Comment created:', response.data.html_url);

  return {
    success: true,
    commentId: response.data.id,
    url: response.data.html_url,
  };
}
