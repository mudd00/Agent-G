import { useEffect, useState } from 'react';
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

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-3xl">
              🤖
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Agent-G</h3>
              <p className="text-white/80 text-sm">GitHub AI Automation System</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 프로젝트 소개 */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📋</span> 프로젝트 소개
            </h4>
            <p className="text-gray-300 leading-relaxed text-sm">
              Agent-G는 GitHub 저장소 관리를 자동화하는 AI 에이전트 시스템입니다.
              GitHub App으로 설치하면 Issue, Pull Request, Push 이벤트를 감지하여
              Claude AI가 자동으로 분석하고 적절한 액션을 수행합니다.
            </p>
          </div>

          {/* 주요 기능 */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">⚡</span> 주요 기능
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="text-2xl mb-2">🏷️</div>
                <div className="text-white font-medium text-sm">Issue Organizer</div>
                <div className="text-gray-400 text-xs mt-1">Issue 내용을 분석하여 자동으로 라벨 분류</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <div className="text-2xl mb-2">👀</div>
                <div className="text-white font-medium text-sm">PR Reviewer</div>
                <div className="text-gray-400 text-xs mt-1">코드 변경사항을 분석하여 리뷰 코멘트 작성</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-white font-medium text-sm">README Generator</div>
                <div className="text-gray-400 text-xs mt-1">프로젝트 구조를 분석하여 README 자동 생성</div>
              </div>
            </div>
          </div>

          {/* 기술 스택 */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🛠️</span> 기술 스택
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'TypeScript', color: 'bg-blue-500/20 text-blue-300' },
                { name: 'Node.js', color: 'bg-green-500/20 text-green-300' },
                { name: 'Express', color: 'bg-gray-500/20 text-gray-300' },
                { name: 'Claude API', color: 'bg-orange-500/20 text-orange-300' },
                { name: 'GitHub App', color: 'bg-purple-500/20 text-purple-300' },
                { name: 'Supabase', color: 'bg-emerald-500/20 text-emerald-300' },
                { name: 'React', color: 'bg-cyan-500/20 text-cyan-300' },
                { name: 'Tailwind', color: 'bg-sky-500/20 text-sky-300' },
              ].map(tech => (
                <span key={tech.name} className={`px-3 py-1 rounded-lg text-xs font-medium ${tech.color}`}>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* 작동 방식 */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🔄</span> 작동 방식
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
                <div>
                  <div className="text-white text-sm font-medium">GitHub 이벤트 발생</div>
                  <div className="text-gray-400 text-xs">Issue 생성, PR 오픈, 코드 Push 시 Webhook 전송</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
                <div>
                  <div className="text-white text-sm font-medium">AI Agent 분석</div>
                  <div className="text-gray-400 text-xs">Claude AI가 이벤트 내용을 분석하고 적합한 작업 결정</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">3</div>
                <div>
                  <div className="text-white text-sm font-medium">자동 액션 실행</div>
                  <div className="text-gray-400 text-xs">라벨 추가, 리뷰 코멘트, README 커밋 등 GitHub API 호출</div>
                </div>
              </div>
            </div>
          </div>

          {/* 아키텍처 */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🏗️</span> 시스템 아키텍처
            </h4>
            <div className="bg-white/5 rounded-xl p-4 text-xs font-mono text-gray-300">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="bg-gray-700 px-2 py-1 rounded">GitHub</span>
                <span className="text-gray-500">→ Webhook →</span>
                <span className="bg-blue-700 px-2 py-1 rounded">Express Server</span>
                <span className="text-gray-500">→</span>
                <span className="bg-purple-700 px-2 py-1 rounded">AI Agents</span>
                <span className="text-gray-500">→</span>
                <span className="bg-orange-700 px-2 py-1 rounded">Claude API</span>
                <span className="text-gray-500">→</span>
                <span className="bg-gray-700 px-2 py-1 rounded">GitHub API</span>
              </div>
            </div>
          </div>

          {/* 데모/사용법 */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">🧪</span> 테스트 방법
            </h4>
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-300">
                <span className="text-blue-400">1.</span>
                <span>GitHub 저장소에서 <strong className="text-white">Issue를 생성</strong>하면 자동으로 라벨이 붙습니다</span>
              </div>
              <div className="flex items-start gap-2 text-gray-300">
                <span className="text-purple-400">2.</span>
                <span><strong className="text-white">Pull Request를 생성</strong>하면 AI가 코드 리뷰 코멘트를 남깁니다</span>
              </div>
              <div className="flex items-start gap-2 text-gray-300">
                <span className="text-green-400">3.</span>
                <span><strong className="text-white">main 브랜치에 Push</strong>하면 README가 자동 업데이트됩니다</span>
              </div>
            </div>
          </div>

          {/* GitHub 링크 */}
          <div className="pt-4 border-t border-white/10">
            <a
              href="https://github.com/mudd00/Agent-G"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub에서 소스코드 보기
            </a>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
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
          setServerStatus('online');
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setServerStatus('offline');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background - Agents Working */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Scrolling code blocks - left side */}
        <div className="absolute left-[3%] top-0 w-72 h-full opacity-[0.12] overflow-hidden">
          <div className="animate-scroll-code font-mono text-xs text-blue-400/80 whitespace-pre leading-loose">
{`async function analyzeIssue(issue) {
  const labels = await claude.analyze({
    title: issue.title,
    body: issue.body,
    type: 'classification'
  });
  return labels;
}

function processWebhook(event) {
  if (event.type === 'issue') {
    IssueOrganizerAgent.run();
  }
}

const response = await fetch(
  '/api/github/labels',
  { method: 'POST' }
);

interface ReviewResult {
  score: number;
  comments: Comment[];
  suggestions: string[];
}

async function reviewPR(diff) {
  const analysis = await ai.review({
    changes: diff,
    rules: codeStyle
  });
  return analysis;
}

export class AgentBase {
  protected github: GitHubAPI;
  protected claude: ClaudeClient;

  async execute(event: WebhookEvent) {
    const result = await this.process();
    await this.logResult(result);
    return result;
  }
}

async function analyzeIssue(issue) {
  const labels = await claude.analyze({
    title: issue.title,
    body: issue.body,
    type: 'classification'
  });
  return labels;
}

function processWebhook(event) {
  if (event.type === 'issue') {
    IssueOrganizerAgent.run();
  }
}`}
          </div>
        </div>

        {/* Scrolling code blocks - right side */}
        <div className="absolute right-[3%] top-0 w-72 h-full opacity-[0.12] overflow-hidden">
          <div className="animate-scroll-code-slow font-mono text-xs text-purple-400/80 whitespace-pre leading-loose">
{`{
  "agent": "PRReviewerAgent",
  "status": "analyzing",
  "files_changed": 12,
  "lines_added": 234,
  "lines_removed": 89
}

// README.md generated
// Installation guide
// API documentation
// Usage examples
// Contributing guide

export class PRReviewerAgent {
  async process(event) {
    const diff = await this.getDiff();
    const review = await claude.review({
      changes: diff,
      focus: ['bugs', 'security']
    });
    await this.postComments(review);
  }
}

webhook.on('pull_request', async (e) => {
  const agent = new PRReviewerAgent();
  await agent.execute(e);
});

// Labels applied:
//   bug
//   priority:high
//   component:auth

{
  "event": "issues.opened",
  "action": "labeled",
  "labels": ["bug", "urgent"]
}

class ReadmeGeneratorAgent {
  async generateDocs() {
    const files = await this.scanProject();
    const readme = await claude.generate({
      template: 'readme',
      context: files
    });
    await this.commitFile(readme);
  }
}`}
          </div>
        </div>

        {/* Subtle glow spots */}
        <div className="absolute top-[30%] left-[20%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[20%] w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Agent-G</h1>
                <p className="text-xs text-gray-400">GitHub AI Automation</p>
              </div>
              {/* Server Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
                <div className={`w-2 h-2 rounded-full ${
                  serverStatus === 'online'
                    ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                    : serverStatus === 'connecting'
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-red-400'
                }`} />
                <span className={`text-xs font-medium ${
                  serverStatus === 'online'
                    ? 'text-green-400'
                    : serverStatus === 'connecting'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}>
                  {serverStatus === 'online' ? 'Server Online' : serverStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                </span>
              </div>
            </div>
            <a
              href="https://github.com/mudd00/Agent-G"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="max-w-6xl mx-auto px-6 py-16 relative">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              GitHub 저장소를
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> 자동으로 </span>
              관리합니다
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Issue 자동 분류 • PR 코드 리뷰 • README 자동 생성
            </p>
          </div>
        </div>
      </section>

      {/* Stats Cards - Hero 아래 메인에 표시 */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                📊
              </div>
              <div>
                <div className="text-4xl font-bold text-white">{stats.today}</div>
                <div className="text-sm text-blue-400 font-medium">오늘 처리한 작업</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                📈
              </div>
              <div>
                <div className="text-4xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-purple-400 font-medium">전체 처리한 작업</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                ✅
              </div>
              <div>
                <div className="text-4xl font-bold text-white">{stats.success_rate.toFixed(0)}%</div>
                <div className="text-sm text-green-400 font-medium">성공률</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <RecentActivity logs={logs} loading={loading} />
            {/* 프로젝트 소개 버튼 - 최근활동 아래 */}
            <button
              onClick={() => setShowAbout(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/10 rounded-xl transition-all text-white font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              프로젝트 소개 및 작동 방식 보기
            </button>
          </div>
          <div className="lg:col-span-2">
            <ProjectInfo byAgent={stats.by_agent} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              Built with TypeScript, Express, Claude API, React
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Agent-G © 2025</span>
            </div>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;
