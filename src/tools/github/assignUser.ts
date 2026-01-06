import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { ToolDefinition } from '../../core/LLMBrain';
import { logger } from '../../config';

// 입력 스키마
export const assignUserInputSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  issue_number: z.number(),
  assignees: z.array(z.string()).describe('GitHub usernames to assign'),
});

export type AssignUserInput = z.infer<typeof assignUserInputSchema>;

// Tool 정의 (Claude에게 제공)
export const assignUserTool: ToolDefinition = {
  name: 'assign_user',
  description:
    'Assign users to a GitHub issue or pull request. Only use this if you have information about who should handle this issue.',
  input_schema: {
    type: 'object',
    properties: {
      issue_number: {
        type: 'number',
        description: 'The issue or PR number to assign users to',
      },
      assignees: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of GitHub usernames to assign',
      },
    },
    required: ['issue_number', 'assignees'],
  },
};

// Tool 실행 함수
export async function assignUser(
  octokit: Octokit,
  input: AssignUserInput
): Promise<{ success: boolean; assignees: string[] }> {
  const validated = assignUserInputSchema.parse(input);

  logger.info(
    `Assigning users to ${validated.owner}/${validated.repo}#${validated.issue_number}:`,
    validated.assignees
  );

  const response = await octokit.issues.addAssignees({
    owner: validated.owner,
    repo: validated.repo,
    issue_number: validated.issue_number,
    assignees: validated.assignees,
  });

  const assignedUsers = response.data.assignees?.map((a) => a.login) || [];
  logger.info('Users assigned:', assignedUsers);

  return {
    success: true,
    assignees: assignedUsers,
  };
}
