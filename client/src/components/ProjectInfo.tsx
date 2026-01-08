import { useState } from 'react';

interface ProjectInfoProps {
  byAgent: Record<string, number>;
}

interface Agent {
  key: string;
  name: string;
  shortDesc: string;
  emoji: string;
  color: string;
  trigger: string;
  description: string;
  features: string[];
  flow: string[];
}

const agents: Agent[] = [
  {
    key: 'IssueOrganizerAgent',
    name: 'Issue Organizer',
    shortDesc: 'Issue 자동 분류 및 라벨링',
    emoji: '🏷️',
    color: 'from-blue-500 to-blue-600',
    trigger: 'GitHub Issue 생성 시 자동 실행',
    description: 'Claude AI가 Issue 내용을 분석하여 적절한 라벨을 자동으로 부여합니다. 버그 리포트, 기능 요청, 질문 등을 자동으로 분류하여 프로젝트 관리를 효율화합니다.',
    features: [
      'Issue 제목과 본문 내용 AI 분석',
      '버그/기능요청/질문/문서 등 유형 자동 분류',
      '우선순위 라벨 자동 부여 (priority:high/medium/low)',
      '관련 컴포넌트/영역 라벨링',
    ],
    flow: [
      'Issue가 생성되면 GitHub Webhook이 서버로 이벤트 전송',
      'IssueOrganizerAgent가 Issue 내용을 Claude API로 분석',
      'AI가 분류 결과를 JSON 형태로 반환',
      'GitHub API를 통해 해당 Issue에 라벨 자동 적용',
    ],
  },
  {
    key: 'PRReviewerAgent',
    name: 'PR Reviewer',
    shortDesc: 'Pull Request 코드 리뷰',
    emoji: '👀',
    color: 'from-purple-500 to-purple-600',
    trigger: 'Pull Request 생성/업데이트 시 자동 실행',
    description: 'Claude AI가 PR의 코드 변경사항을 분석하여 자동으로 코드 리뷰를 수행합니다. 버그 가능성, 코드 스타일, 보안 이슈 등을 검토하여 코드 품질을 향상시킵니다.',
    features: [
      '코드 변경사항(diff) 자동 분석',
      '잠재적 버그 및 논리 오류 검출',
      '코드 스타일 및 best practice 검토',
      '보안 취약점 검사',
      '개선 제안 코멘트 자동 작성',
    ],
    flow: [
      'PR이 생성/업데이트되면 GitHub Webhook이 이벤트 전송',
      'PRReviewerAgent가 변경된 파일들의 diff를 수집',
      'Claude API가 코드를 분석하고 리뷰 코멘트 생성',
      'GitHub API를 통해 PR에 리뷰 코멘트 자동 등록',
    ],
  },
  {
    key: 'ReadmeGeneratorAgent',
    name: 'README Generator',
    shortDesc: 'README 자동 생성/업데이트',
    emoji: '📝',
    color: 'from-green-500 to-green-600',
    trigger: 'main 브랜치 Push 시 자동 실행',
    description: 'Claude AI가 프로젝트 구조와 코드를 분석하여 README.md를 자동으로 생성하거나 업데이트합니다. 항상 최신 상태의 문서를 유지할 수 있습니다.',
    features: [
      '프로젝트 구조 자동 분석',
      'package.json, 소스코드 기반 기술 스택 파악',
      '설치 방법 및 사용법 자동 문서화',
      'API 엔드포인트 문서 생성',
      '기존 README와 병합하여 업데이트',
    ],
    flow: [
      'main 브랜치에 Push되면 GitHub Webhook이 이벤트 전송',
      'ReadmeGeneratorAgent가 저장소의 주요 파일들을 분석',
      'Claude API가 프로젝트 정보를 기반으로 README 생성',
      'GitHub API를 통해 README.md 파일 자동 커밋',
    ],
  },
];


function AgentModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/20 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${agent.color} p-6 rounded-t-2xl`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-3xl">
              {agent.emoji}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
              <div className="text-white/80 text-sm mt-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {agent.trigger}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <p className="text-gray-300 leading-relaxed">{agent.description}</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">✨</span> 주요 기능
            </h4>
            <ul className="space-y-2">
              {agent.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flow */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">⚙️</span> 작동 방식
            </h4>
            <div className="space-y-3">
              {agent.flow.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {i + 1}
                  </div>
                  <span className="text-gray-300 text-sm leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Powered by */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Powered by</span>
              <span className="text-orange-400 font-medium">Claude AI</span>
              <span>+</span>
              <span className="text-purple-400 font-medium">GitHub API</span>
            </div>
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

export function ProjectInfo({ byAgent }: ProjectInfoProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">AI Agents</h2>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">클릭하여 상세보기</span>
        </div>

        <div className="space-y-3 mb-8">
          {agents.map(agent => (
            <div
              key={agent.key}
              onClick={() => setSelectedAgent(agent)}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${agent.color} rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                {agent.emoji}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium flex items-center gap-2">
                  {agent.name}
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-sm text-gray-400">{agent.shortDesc}</div>
              </div>
              {byAgent[agent.key] !== undefined && byAgent[agent.key] > 0 && (
                <div className="text-2xl font-bold text-white/80">
                  {byAgent[agent.key]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedAgent && (
        <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </>
  );
}
