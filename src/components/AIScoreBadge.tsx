import clsx from 'clsx';

interface Props {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number) {
  if (score >= 90) return { ring: 'stroke-emerald-400', text: 'text-emerald-400' };
  if (score >= 75) return { ring: 'stroke-blue-400', text: 'text-blue-400' };
  if (score >= 60) return { ring: 'stroke-yellow-400', text: 'text-yellow-400' };
  return { ring: 'stroke-rose-400', text: 'text-rose-400' };
}

export default function AIScoreBadge({ score, label = 'AI Score', size = 'md' }: Props) {
  const { ring, text } = getScoreColor(score);
  const radius = size === 'lg' ? 28 : size === 'md' ? 22 : 16;
  const strokeWidth = size === 'lg' ? 3 : 2.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dim = (radius + strokeWidth + 2) * 2;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2} cy={dim / 2} r={radius}
            fill="none" stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-700"
          />
          <circle
            cx={dim / 2} cy={dim / 2} r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={clsx('transition-all duration-700', ring)}
          />
        </svg>
        <span className={clsx(
          'absolute tabular font-bold',
          text,
          size === 'lg' ? 'text-xl' : size === 'md' ? 'text-sm' : 'text-xs',
        )}>
          {score}
        </span>
      </div>
      {label && <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>}
    </div>
  );
}
