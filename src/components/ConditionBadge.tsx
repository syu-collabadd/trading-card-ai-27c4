import clsx from 'clsx';
import type { CardCondition } from '../data/types';

const CONDITION_COLORS: Record<CardCondition, string> = {
  'PSA 10': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'PSA 9': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  'PSA 8': 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  'PSA 7': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  'PSA 6': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  'Raw NM': 'bg-slate-600/40 text-slate-300 border-slate-500/40',
  'Raw EX': 'bg-slate-600/30 text-slate-400 border-slate-600/40',
  'Raw VG': 'bg-slate-700/40 text-slate-500 border-slate-600/40',
};

interface Props {
  condition: CardCondition;
  size?: 'sm' | 'md';
}

export default function ConditionBadge({ condition, size = 'md' }: Props) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded border font-semibold tabular',
      CONDITION_COLORS[condition],
      size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
    )}>
      {condition}
    </span>
  );
}
