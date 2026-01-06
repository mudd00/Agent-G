import Anthropic from '@anthropic-ai/sdk';
import { config, logger } from '../config';

// Tool 정의 타입
export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// 메시지 타입
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Tool 사용 결과 타입
export interface ToolUse {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

// LLM 응답 타입
export interface LLMResponse {
  content: string;
  toolUses: ToolUse[];
  stopReason: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export class LLMBrain {
  private client: Anthropic;
  private model: string = 'claude-sonnet-4-20250514';

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY,
    });
  }

  /**
   * 단순 텍스트 생성
   */
  async think(
    systemPrompt: string,
    userMessage: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<string> {
    logger.debug('LLM think called');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature ?? 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const result = textBlock?.type === 'text' ? textBlock.text : '';

    logger.debug('LLM response:', {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    });

    return result;
  }

  /**
   * Tool calling을 포함한 응답 생성
   */
  async thinkWithTools(
    systemPrompt: string,
    messages: Message[],
    tools: ToolDefinition[],
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<LLMResponse> {
    logger.debug('LLM thinkWithTools called with', tools.length, 'tools');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature ?? 0.3,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.input_schema,
      })),
    });

    // 응답 파싱
    let content = '';
    const toolUses: ToolUse[] = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        content += block.text;
      } else if (block.type === 'tool_use') {
        toolUses.push({
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>,
        });
      }
    }

    logger.debug('LLM response:', {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      toolUses: toolUses.length,
      stopReason: response.stop_reason,
    });

    return {
      content,
      toolUses,
      stopReason: response.stop_reason || 'end_turn',
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  /**
   * Tool 실행 결과를 포함하여 계속 대화
   */
  async continueWithToolResults(
    systemPrompt: string,
    messages: Anthropic.MessageParam[],
    tools: ToolDefinition[],
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<LLMResponse> {
    logger.debug('LLM continueWithToolResults called');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature ?? 0.3,
      system: systemPrompt,
      messages,
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.input_schema,
      })),
    });

    let content = '';
    const toolUses: ToolUse[] = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        content += block.text;
      } else if (block.type === 'tool_use') {
        toolUses.push({
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>,
        });
      }
    }

    logger.debug('LLM continue response:', {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      toolUses: toolUses.length,
    });

    return {
      content,
      toolUses,
      stopReason: response.stop_reason || 'end_turn',
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }
}

// 싱글톤 인스턴스 (필요 시 사용)
export const llmBrain = new LLMBrain();
