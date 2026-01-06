import { Octokit } from '@octokit/rest';
import { executeTool, allTools, getToolDefinition } from '../tools';
import { ToolDefinition, ToolUse } from './LLMBrain';
import { logger } from '../config';

export interface ToolExecutionResult {
  toolUseId: string;
  toolName: string;
  input: Record<string, unknown>;
  output: unknown;
  success: boolean;
  error?: string;
  executionTimeMs: number;
}

export class ToolExecutor {
  private octokit: Octokit;
  private context: { owner: string; repo: string };

  constructor(octokit: Octokit, context: { owner: string; repo: string }) {
    this.octokit = octokit;
    this.context = context;
  }

  /**
   * 사용 가능한 모든 Tool 정의 반환
   */
  getAvailableTools(): ToolDefinition[] {
    return allTools;
  }

  /**
   * 특정 Tool들만 반환
   */
  getTools(names: string[]): ToolDefinition[] {
    return names
      .map((name) => getToolDefinition(name))
      .filter((t): t is ToolDefinition => t !== undefined);
  }

  /**
   * 단일 Tool 실행
   */
  async execute(toolUse: ToolUse): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    try {
      // Context 정보 주입 (owner, repo)
      const enrichedInput = {
        ...toolUse.input,
        owner: this.context.owner,
        repo: this.context.repo,
      };

      logger.info(`Executing tool: ${toolUse.name}`);

      const output = await executeTool(
        this.octokit,
        toolUse.name,
        enrichedInput
      );

      return {
        toolUseId: toolUse.id,
        toolName: toolUse.name,
        input: enrichedInput,
        output,
        success: true,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Tool ${toolUse.name} failed:`, errorMessage);

      return {
        toolUseId: toolUse.id,
        toolName: toolUse.name,
        input: toolUse.input,
        output: null,
        success: false,
        error: errorMessage,
        executionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * 여러 Tool 순차 실행
   */
  async executeAll(toolUses: ToolUse[]): Promise<ToolExecutionResult[]> {
    const results: ToolExecutionResult[] = [];

    for (const toolUse of toolUses) {
      const result = await this.execute(toolUse);
      results.push(result);

      // 에러 발생 시 로그만 남기고 계속 진행
      if (!result.success) {
        logger.warn(`Tool ${toolUse.name} failed, continuing with next tool`);
      }
    }

    return results;
  }

  /**
   * Tool 실행 결과를 Claude 메시지 형식으로 변환
   */
  formatResultsForClaude(
    results: ToolExecutionResult[]
  ): Array<{ type: 'tool_result'; tool_use_id: string; content: string }> {
    return results.map((result) => ({
      type: 'tool_result' as const,
      tool_use_id: result.toolUseId,
      content: result.success
        ? JSON.stringify(result.output)
        : JSON.stringify({ error: result.error }),
    }));
  }
}
