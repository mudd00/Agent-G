import { useEffect, useState } from 'react';
import { StatsCard } from './components/StatsCard';
import { RecentActivity } from './components/RecentActivity';
import { ProjectInfo } from './components/ProjectInfo';

interface Stats {
  total: number;
  today: number;
  success_rate: number;
  by_agent: Record<string, number>;
}

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

function App() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    success_rate: 0,
    by_agent: {},
  });
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, logsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/logs?limit=10'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // 30초마다 데이터 갱신
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h1 className="text-2xl font-bold">Agent-G Dashboard</h1>
              <p className="text-sm text-slate-400">GitHub 저장소 자동 관리 AI Agent</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon="📊"
            value={stats.today}
            label="오늘 처리"
            color="blue"
          />
          <StatsCard
            icon="📈"
            value={stats.total}
            label="전체 처리"
            color="purple"
          />
          <StatsCard
            icon="✅"
            value={`${stats.success_rate.toFixed(1)}%`}
            label="성공률"
            color="green"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity logs={logs} loading={loading} />
          <ProjectInfo byAgent={stats.by_agent} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          Built with Claude API • GitHub App • React + Tailwind
        </div>
      </footer>
    </div>
  );
}

export default App;
