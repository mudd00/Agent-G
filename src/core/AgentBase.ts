import { Octokit } from '@octokit/rest';
import Anthropic from '@anthropic-ai/sdk';
import { LLMBrain, ToolDefinition, Message } from './LLMBrain';
import { ToolExecutor, ToolExecutionResult } from './ToolExecutor';
import { logger } from '../config';

// Agent 컨텍스트 (Webhook에서 전달받는 정보)
export interface AgentContext {
  // GitHub 정보
  owner: string;
  repo: string;
  installationId: number;

  // 이벤트 정보
  eventType: string;
  eventAction: string;
  eventPayload: Record<string, unknown>;

  // 추가 메타데이터
  triggeredBy: string;
  triggeredAt: Date;
}

// Agent 실행 결과
export interface AgentResult {
  success: boolean;
  actions: Array<{
    tool: string;
    input: Record<string, unknown>;
    result: unknown;
    success: boolean;
  }>;
  thinking: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  error?: string;
}

// Agent 설정
export interface AgentConfig {
  name: string;
  description: string;
  maxIterations?: number; // Tool 사용 최대 횟수
  tools: ToolDefinition[];
}

export abstract class AgentBase {
  protected config: AgentConfig;
  protected llm: LLMBrain;

  constructor(config: AgentConfig) {
    this.config = {
      ...config,
      maxIterations: config.maxIterations || 10,
    };
    this.llm = new LLMBrain();
  }

  /**
   * Agent의 시스템 프롬프트 생성 (각 Agent가 오버라이드)
   */
  protected abstract buildSystemPrompt(context: AgentContext): string;

  /**
   * 초기 사용자 메시지 생성 (각 Agent가 오버라이드)
   */
  protected abstract buildInitialMessage(context: AgentContext): string;

  /**
   * Agent 실행 (Think-Act 루프)
   */
  async run(context: AgentContext, octokit: Octokit): Promise<AgentResult> {
    const startTime = Date.now();
    logger.info(`[${this.config.name}] Starting agent...`);

    const systemPrompt = this.buildSystemPrompt(context);
    const initialMessage = this.buildInitialMessage(context);

    // Tool Executor 생성
    const executor = new ToolExecutor(octokit, {
      owner: context.owner,
      repo: context.repo,
    });

    // 대화 기록 (Anthropic 형식)
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: initialMessage },
    ];

    const allActions: AgentResult['actions'] = [];
    let thinking = '';
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let iterations = 0;

    try {
      while (iterations < this.config.maxIterations!) {
        iterations++;
        logger.info(`[${this.config.name}] Iteration ${iterations}`);

        // LLM에게 생각 요청
        const response = await this.llm.continueWithToolResults(
          systemPrompt,
          messages,
          this.config.tools,
          { temperature: 0.3 }
        );

        totalInputTokens += response.usage.inputTokens;
        totalOutputTokens += response.usage.outputTokens;
        thinking += response.content + '\n';

        logger.debug(`[${this.config.name}] LLM response:`, {
          content: response.content.substring(0, 200) + '...',
          toolUses: response.toolUses.length,
          stopReason: response.stopReason,
        });

        // Tool 사용이 없으면 종료
        if (response.toolUses.length === 0) {
          logger.info(`[${this.config.name}] No more tools to use, finishing.`);
          break;
        }

        // Tool 실행
        const toolResults: ToolExecutionResult[] = [];

        for (const toolUse of response.toolUses) {
          logger.info(`[${this.config.name}] Executing tool: ${toolUse.name}`);

          const result = await executor.execute(toolUse);
          toolResults.push(result);

          allActions.push({
            tool: toolUse.name,
            input: result.input,
            result: result.output,
            success: result.success,
          });
        }

        // 대화 기록 업데이트
        // Assistant 응답 추가
        const assistantContent: Anthropic.ContentBlock[] = [];
        if (response.content) {
          assistantContent.push({ type: 'text', text: response.content });
        }
        for (const toolUse of response.toolUses) {
          assistantContent.push({
            type: 'tool_use',
            id: toolUse.id,
            name: toolUse.name,
            input: toolUse.input,
          });
        }
        messages.push({ role: 'assistant', content: assistantContent });

        // Tool 결과 추가
        const toolResultContent = executor.formatResultsForClaude(toolResults);
        messages.push({ role: 'user', content: toolResultContent });

        // 종료 조건 체크
        if (response.stopReason === 'end_turn') {
          logger.info(`[${this.config.name}] Stop reason: end_turn`);
          break;
        }
      }

      const duration = Date.now() - startTime;
      logger.info(`[${this.config.name}] Completed in ${duration}ms`, {
        iterations,
        actions: allActions.length,
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
      });

      return {
        success: true,
        actions: allActions,
        thinking,
        totalInputTokens,
        totalOutputTokens,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error(`[${this.config.name}] Agent error:`, errorMessage);

      return {
        success: false,
        actions: allActions,
        thinking,
        totalInputTokens,
        totalOutputTokens,
        error: errorMessage,
      };
    }
  }
}
