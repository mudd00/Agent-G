import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config, logger } from '../config';

let supabase: SupabaseClient | null = null;

/**
 * Supabase 클라이언트 초기화
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    return null;
  }

  if (!supabase) {
    supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    logger.info('Supabase client initialized');
  }

  return supabase;
}

/**
 * Agent 로그 타입
 */
export interface AgentLog {
  repo_owner: string;
  repo_name: string;
  event_type: string;
  event_action?: string;
  target_number?: number;
  target_title?: string;
  agent_name: string;
  actions_taken: string[];
  duration_ms: number;
  input_tokens: number;
  output_tokens: number;
  status: 'success' | 'error';
}

/**
 * Agent 실행 로그를 Supabase에 저장
 */
export async function saveAgentLog(log: AgentLog): Promise<void> {
  const client = getSupabaseClient();

  if (!client) {
    logger.debug('Supabase not configured, skipping log save');
    return;
  }

  try {
    const { error } = await client
      .from('agent_logs')
      .insert(log);

    if (error) {
      logger.error('Failed to save agent log:', error.message);
    } else {
      logger.debug(`Agent log saved: ${log.agent_name} - ${log.status}`);
    }
  } catch (err) {
    logger.error('Error saving agent log:', err);
  }
}

/**
 * 최근 Agent 로그 조회 (대시보드용)
 */
export async function getRecentLogs(limit: number = 20): Promise<AgentLog[]> {
  const client = getSupabaseClient();

  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('agent_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Failed to fetch logs:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    logger.error('Error fetching logs:', err);
    return [];
  }
}

/**
 * 통계 조회 (대시보드용)
 */
export async function getStats(): Promise<{
  total: number;
  today: number;
  success_rate: number;
  by_agent: Record<string, number>;
}> {
  const client = getSupabaseClient();

  if (!client) {
    return { total: 0, today: 0, success_rate: 0, by_agent: {} };
  }

  try {
    // 전체 개수
    const { count: total } = await client
      .from('agent_logs')
      .select('*', { count: 'exact', head: true });

    // 오늘 개수
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayCount } = await client
      .from('agent_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // 성공률
    const { count: successCount } = await client
      .from('agent_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'success');

    // Agent별 개수
    const { data: agentData } = await client
      .from('agent_logs')
      .select('agent_name');

    const byAgent: Record<string, number> = {};
    agentData?.forEach((row: { agent_name: string }) => {
      byAgent[row.agent_name] = (byAgent[row.agent_name] || 0) + 1;
    });

    return {
      total: total || 0,
      today: todayCount || 0,
      success_rate: total ? ((successCount || 0) / total) * 100 : 0,
      by_agent: byAgent,
    };
  } catch (err) {
    logger.error('Error fetching stats:', err);
    return { total: 0, today: 0, success_rate: 0, by_agent: {} };
  }
}
