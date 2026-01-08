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

const agentConfig: Record<string, { emoji: string; color: string; bg: string }> = {
  IssueOrganizerAgent: { emoji: '🏷️', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  PRReviewerAgent: { emoji: '👀', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  ReadmeGeneratorAgent: { emoji: '📝', color: 'text-green-400', bg: 'bg-green-500/20' },
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

function getAgentLabel(agentName: string): string {
  switch (agentName) {
    case 'IssueOrganizerAgent': return 'Issue 분류';
    case 'PRReviewerAgent': return 'PR 리뷰';
    case 'ReadmeGeneratorAgent': return 'README 생성';
    default: return 'Agent';
  }
}

export function RecentActivity({ logs, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">최근 활동</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-4 p-4 rounded-xl bg-white/5">
              <div className="w-12 h-12 bg-white/10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-6">최근 활동</h2>
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <div className="text-gray-400">아직 활동 기록이 없습니다</div>
          <div className="text-gray-500 text-sm mt-2">Issue나 PR을 생성하면 여기에 표시됩니다</div>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => {
            const config = agentConfig[log.agent_name] || { emoji: '🤖', color: 'text-gray-400', bg: 'bg-gray-500/20' };
            return (
              <div
                key={log.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center text-xl`}>
                  {config.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {getAgentLabel(log.agent_name)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      log.status === 'success'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.status === 'success' ? '성공' : '실패'}
                    </span>
                  </div>
                  <div className="text-white font-medium truncate">
                    {log.target_title || `#${log.target_number}` || log.event_type}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>{formatTime(log.created_at)}</span>
                    <span className="text-gray-600">•</span>
                    <span>{log.duration_ms}ms</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
