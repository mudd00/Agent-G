interface ProjectInfoProps {
  byAgent: Record<string, number>;
}

const agentInfo: Record<string, { name: string; description: string; emoji: string }> = {
  IssueOrganizerAgent: {
    name: 'Issue Organizer',
    description: 'Issue 자동 분류 및 라벨링',
    emoji: '🏷️',
  },
  PRReviewerAgent: {
    name: 'PR Reviewer',
    description: 'Pull Request 코드 리뷰',
    emoji: '👀',
  },
  ReadmeGeneratorAgent: {
    name: 'README Generator',
    description: 'README 자동 생성/업데이트',
    emoji: '📝',
  },
};

export function ProjectInfo({ byAgent }: ProjectInfoProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        💡 Agent-G 소개
      </h2>

      <p className="text-slate-300 mb-6">
        GitHub 저장소를 자동으로 관리하는 AI Agent 시스템입니다.
        Issue가 생성되면 자동 분류, PR이 열리면 코드 리뷰,
        Push가 되면 README를 자동 업데이트합니다.
      </p>

      <h3 className="text-lg font-medium text-white mb-3">🤖 Agents</h3>
      <div className="space-y-3">
        {Object.entries(agentInfo).map(([key, info]) => (
          <div
            key={key}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50"
          >
            <span className="text-2xl">{info.emoji}</span>
            <div className="flex-1">
              <div className="text-white font-medium">{info.name}</div>
              <div className="text-sm text-slate-400">{info.description}</div>
            </div>
            {byAgent[key] !== undefined && (
              <div className="text-slate-400 text-sm">
                {byAgent[key]}회 실행
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <h3 className="text-lg font-medium text-white mb-3">🛠️ 기술 스택</h3>
        <div className="flex flex-wrap gap-2">
          {['TypeScript', 'Node.js', 'Express', 'Claude API', 'GitHub App', 'Supabase', 'React', 'Tailwind'].map(tech => (
            <span
              key={tech}
              className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <a
          href="https://github.com/mudd00/Agent-G"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub에서 보기
        </a>
      </div>
    </div>
  );
}
