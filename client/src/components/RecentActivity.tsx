interface AgentLog {
  id: string;
  created_at: string;
  repo_owner: string;
  repo_name: string;
  event_type: string;
  event_action?: string;
  target_number?: number;
  target_title?: string;
  agent_name: string;
  actions_taken: string[];
  duration_ms: number;
  status: 'success' | 'error';
}

interface RecentActivityProps {
  logs: AgentLog[];
  loading: boolean;
}

const agentEmoji: Record<string, string> = {
  IssueOrganizerAgent: '🏷️',
  PRReviewerAgent: '👀',
  ReadmeGeneratorAgent: '📝',
};

const eventEmoji: Record<string, string> = {
  issue: '🎫',
  pull_request: '🔀',
  push: '📤',
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

function getAgentDescription(log: AgentLog): string {
  switch (log.agent_name) {
    case 'IssueOrganizerAgent':
      return log.actions_taken.find(a => a.startsWith('add_label:'))?.replace('add_label:', '라벨 추가: ') || '이슈 분석 완료';
    case 'PRReviewerAgent':
      return '코드 리뷰 완료';
    case 'ReadmeGeneratorAgent':
      return 'README 생성/업데이트';
    default:
      return '작업 완료';
  }
}

export function RecentActivity({ logs, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          📋 최근 활동
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-10 h-10 bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        📋 최근 활동
      </h2>
      {logs.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          아직 활동 기록이 없습니다
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xl">
                {agentEmoji[log.agent_name] || '🤖'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">
                    {eventEmoji[log.event_type] || '📌'}{' '}
                    {log.target_title || `#${log.target_number}` || log.event_type}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    log.status === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {log.status === 'success' ? '성공' : '실패'}
                  </span>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {getAgentDescription(log)}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>{formatTime(log.created_at)}</span>
                  <span>•</span>
                  <span>{log.repo_owner}/{log.repo_name}</span>
                  <span>•</span>
                  <span>{log.duration_ms}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
