import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  accent?: 'blue' | 'violet' | 'emerald' | 'rose';
  className?: string;
}

export default function StatCard({ label, value, change, changeLabel, accent = 'blue', className }: Props) {
  const isPositive = change !== undefined && change >= 0;

  const accentClasses = {
    blue: 'from-electric-500/10 to-transparent border-electric-500/20',
    violet: 'from-violet-500/10 to-transparent border-violet-500/20',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20',
    rose: 'from-rose-500/10 to-transparent border-rose-500/20',
  };

  return (
    <div className={clsx(
      'bg-navy-800 rounded-xl border p-4 bg-gradient-to-br',
      accentClasses[accent],
      className,
    )}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="tabular text-2xl font-bold text-white leading-none mb-2">{value}</p>
      {change !== undefined && (
        <div className={clsx('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-emerald-400' : 'text-rose-400')}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span className="tabular">{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
          {changeLabel && <span className="text-slate-500 font-normal">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
