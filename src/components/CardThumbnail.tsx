import clsx from 'clsx';
import type { Card } from '../data/types';

const CARD_COLORS: Record<string, string> = {
  'charizard-base-1': 'from-orange-700 via-red-600 to-yellow-600',
  'blastoise-base-1': 'from-blue-700 via-cyan-600 to-blue-500',
  'venusaur-base-1': 'from-green-700 via-emerald-600 to-teal-600',
  'mewtwo-base-1': 'from-purple-700 via-indigo-600 to-violet-600',
  'pika-base-1': 'from-yellow-500 via-amber-500 to-orange-400',
  'pikachu-promo-1': 'from-yellow-600 via-amber-500 to-red-500',
  'lugia-neo-1': 'from-slate-500 via-blue-400 to-indigo-500',
  'umbreon-gold-star-1': 'from-yellow-600 via-amber-700 to-slate-800',
  'charizard-unlimited-1': 'from-orange-600 via-red-500 to-amber-600',
  'mew-promo-1': 'from-pink-500 via-fuchsia-500 to-violet-500',
};

const POKEMON_EMOJI: Record<string, string> = {
  'charizard-base-1': '🔥',
  'blastoise-base-1': '💧',
  'venusaur-base-1': '🌿',
  'mewtwo-base-1': '🔮',
  'pika-base-1': '⚡',
  'pikachu-promo-1': '⚡',
  'lugia-neo-1': '🌊',
  'umbreon-gold-star-1': '🌙',
  'charizard-unlimited-1': '🔥',
  'mew-promo-1': '✨',
};

interface Props {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CardThumbnail({ card, size = 'md', className }: Props) {
  const gradient = CARD_COLORS[card.id] || 'from-slate-600 via-slate-500 to-slate-700';
  const emoji = POKEMON_EMOJI[card.id] || '🃏';

  const sizeClasses = {
    sm: 'w-16 h-22',
    md: 'w-24 h-32',
    lg: 'w-40 h-56',
  };
  const emojiSize = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl' };
  const nameSize = { sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-sm' };
  const setSize = { sm: 'text-[8px]', md: 'text-[9px]', lg: 'text-xs' };

  return (
    <div
      className={clsx(
        sizeClasses[size],
        'relative rounded-lg overflow-hidden flex-shrink-0',
        'bg-gradient-to-br',
        gradient,
        'shadow-lg border border-white/10',
        className,
      )}
      style={{ aspectRatio: '2.5/3.5' }}
    >
      {/* Holographic shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />

      {/* Card inner border */}
      <div className="absolute inset-[3px] rounded border border-white/20 flex flex-col items-center justify-between p-1.5">
        <div className={clsx('font-bold text-white text-center leading-tight', nameSize[size])}>
          {card.name}
        </div>
        <div className={emojiSize[size]}>{emoji}</div>
        <div className="text-center">
          <div className={clsx('text-white/60 leading-none', setSize[size])}>{card.set}</div>
          <div className={clsx('text-white/40', setSize[size])}>{card.number}</div>
        </div>
      </div>

      {/* Rarity glow */}
      {(card.rarity === 'Secret Rare' || card.rarity === 'Promo') && (
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
