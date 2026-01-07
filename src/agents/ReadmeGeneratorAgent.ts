import { AgentBase, AgentContext, AgentConfig } from '../core/AgentBase';
import { getRepoContentsTool, createOrUpdateFileTool } from '../tools';
import {
  README_GENERATOR_SYSTEM_PROMPT,
  createReadmeGenerationPrompt,
} from '../prompts/readmeGeneration';

const agentConfig: AgentConfig = {
  name: 'ReadmeGeneratorAgent',
  description: 'Automatically generates and updates README.md',
  maxIterations: 10, // 구조 파악 + README 작성에 여러 번 호출 필요
  tools: [getRepoContentsTool, createOrUpdateFileTool],
};

export class ReadmeGeneratorAgent extends AgentBase {
  constructor() {
    super(agentConfig);
  }

  protected buildSystemPrompt(context: AgentContext): string {
    return `${README_GENERATOR_SYSTEM_PROMPT}

## Repository Context
- Repository: ${context.owner}/${context.repo}
- Event: ${context.eventType}
- Triggered by: @${context.triggeredBy}
`;
  }

  protected buildInitialMessage(context: AgentContext): string {
    const payload = context.eventPayload;
    const changedFiles = (payload.changedFiles as string[]) || [];

    return createReadmeGenerationPrompt(
      context.owner,
      context.repo,
      changedFiles
    );
  }
}
