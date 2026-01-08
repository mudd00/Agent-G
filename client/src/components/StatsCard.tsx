interface StatsCardProps {
  icon: string;
  value: number | string;
  label: string;
  color?: 'blue' | 'green' | 'purple';
}

const colorConfig = {
  blue: {
    bg: 'from-blue-500/20 to-blue-600/20',
    border: 'border-blue-500/30',
    icon: 'from-blue-500 to-blue-600',
    text: 'text-blue-400',
  },
  green: {
    bg: 'from-green-500/20 to-green-600/20',
    border: 'border-green-500/30',
    icon: 'from-green-500 to-green-600',
    text: 'text-green-400',
  },
  purple: {
    bg: 'from-purple-500/20 to-purple-600/20',
    border: 'border-purple-500/30',
    icon: 'from-purple-500 to-purple-600',
    text: 'text-purple-400',
  },
};

export function StatsCard({ icon, value, label, color = 'blue' }: StatsCardProps) {
  const config = colorConfig[color];

  return (
    <div className={`bg-gradient-to-br ${config.bg} backdrop-blur-sm rounded-2xl p-6 border ${config.border}`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${config.icon} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
        <div>
          <div className="text-4xl font-bold text-white">{value}</div>
          <div className={`text-sm ${config.text} font-medium`}>{label}</div>
        </div>
      </div>
    </div>
  );
}
