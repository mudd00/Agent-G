import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { ToolDefinition } from '../../core/LLMBrain';
import { logger } from '../../config';

// 입력 스키마
export const addLabelInputSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  issue_number: z.number().describe('Issue or PR number'),
  labels: z.array(z.string()).describe('Labels to add'),
});

export type AddLabelInput = z.infer<typeof addLabelInputSchema>;

// Tool 정의 (Claude에게 제공)
export const addLabelTool: ToolDefinition = {
  name: 'add_label',
  description:
    'Add labels to a GitHub issue or pull request. Use this to categorize issues (bug, enhancement, question) or set priority (P0, P1, P2).',
  input_schema: {
    type: 'object',
    properties: {
      issue_number: {
        type: 'number',
        description: 'The issue or PR number to add labels to',
      },
      labels: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Array of label names to add. Available labels: bug, enhancement, question, documentation, P0, P1, P2',
      },
    },
    required: ['issue_number', 'labels'],
  },
};

// Tool 실행 함수
export async function addLabel(
  octokit: Octokit,
  input: AddLabelInput
): Promise<{ success: boolean; labels: string[] }> {
  const validated = addLabelInputSchema.parse(input);

  logger.info(
    `Adding labels to ${validated.owner}/${validated.repo}#${validated.issue_number}:`,
    validated.labels
  );

  const response = await octokit.issues.addLabels({
    owner: validated.owner,
    repo: validated.repo,
    issue_number: validated.issue_number,
    labels: validated.labels,
  });

  const addedLabels = response.data.map((l) => l.name);
  logger.info('Labels added:', addedLabels);

  return {
    success: true,
    labels: addedLabels,
  };
}
