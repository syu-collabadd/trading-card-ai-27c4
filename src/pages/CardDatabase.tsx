import { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, LayoutGrid, List } from 'lucide-react';
import { MOCK_CARDS } from '../data/mockCards';
import CardThumbnail from '../components/CardThumbnail';
import ConditionBadge from '../components/ConditionBadge';
import AIScoreBadge from '../components/AIScoreBadge';
import type { Card } from '../data/types';
import clsx from 'clsx';

type SortKey = 'currentPrice' | 'priceChange30d' | 'aiScore' | 'rarityScore' | 'population';
type ViewMode = 'grid' | 'list';

const RARITIES = ['All', 'Holo Rare', 'Secret Rare', 'Promo', 'Ultra Rare', 'Rare', 'Common'];
const CONDITIONS = ['All', 'PSA 10', 'PSA 9', 'PSA 8', 'PSA 7'];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function CardDatabase() {
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState('All');
  const [condition, setCondition] = useState('All');
  const [sortBy, setSortBy] = useState<SortKey>('currentPrice');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [view, setView] = useState<ViewMode>('grid');
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = MOCK_CARDS
    .filter(c => {
      const q = search.toLowerCase();
      return (
        (c.name.toLowerCase().includes(q) || c.set.toLowerCase().includes(q)) &&
        (rarity === 'All' || c.rarity === rarity) &&
        (condition === 'All' || c.condition === condition)
      );
    })
    .sort((a, b) => {
      const v = (sortDir === 'desc' ? -1 : 1) * (a[sortBy] - b[sortBy]);
      return v;
    });

  function toggleCompare(id: string) {
    setCompare(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev,
    );
  }

  function toggleSort(key: SortKey) {
    if (sortBy === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(key); setSortDir('desc'); }
  }

  const compareCards = MOCK_CARDS.filter(c => compare.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Card Database</h1>
          <p className="text-sm text-slate-400 mt-0.5">{MOCK_CARDS.length} cards · AI-scored and priced</p>
        </div>
        <div className="flex gap-1 p-0.5 bg-navy-800 border border-slate-700 rounded-lg">
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                'p-1.5 rounded transition-colors',
                view === v ? 'bg-electric-500/20 text-electric-400' : 'text-slate-400 hover:text-white',
              )}
            >
              {v === 'grid' ? <LayoutGrid size={16} /> : <List size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or set..."
            className="w-full bg-navy-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500/50"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-slate-400" />
          <select
            value={rarity}
            onChange={e => setRarity(e.target.value)}
            className="bg-navy-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-electric-500/50"
          >
            {RARITIES.map(r => <option key={r}>{r}</option>)}
          </select>
          <select
            value={condition}
            onChange={e => setCondition(e.target.value)}
            className="bg-navy-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-electric-500/50"
          >
            {CONDITIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          Sort:
          {(['currentPrice', 'priceChange30d', 'aiScore', 'rarityScore'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={clsx(
                'px-2 py-1 rounded border transition-colors',
                sortBy === key
                  ? 'border-electric-500/40 bg-electric-500/10 text-electric-400'
                  : 'border-slate-700 text-slate-400 hover:text-white',
              )}
            >
              {key === 'currentPrice' ? 'Price' : key === 'priceChange30d' ? '30D' : key === 'aiScore' ? 'AI' : 'Rarity'}
              {sortBy === key && (sortDir === 'desc' ? ' ↓' : ' ↑')}
            </button>
          ))}
        </div>
      </div>

      {/* Compare panel */}
      {compare.length > 0 && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-white">Comparing {compare.length} cards</span>
            <button onClick={() => setCompare([])} className="ml-auto text-xs text-slate-400 hover:text-white">Clear</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {compareCards.map(card => (
              <div key={card.id} className="bg-navy-900/60 rounded-lg p-3">
                <div className="flex gap-2 items-start mb-2">
                  <CardThumbnail card={card} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">{card.name}</p>
                    <p className="text-[10px] text-slate-500">{card.set}</p>
                    <ConditionBadge condition={card.condition} size="sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div><span className="text-slate-500">Price</span><p className="tabular font-bold text-white">{fmt(card.currentPrice)}</p></div>
                  <div><span className="text-slate-500">30D</span><p className={clsx('tabular font-bold', card.priceChange30d >= 0 ? 'text-emerald-400' : 'text-rose-400')}>{card.priceChange30d >= 0 ? '+' : ''}{card.priceChange30d}%</p></div>
                  <div><span className="text-slate-500">AI Score</span><p className="tabular font-bold text-blue-400">{card.aiScore}</p></div>
                  <div><span className="text-slate-500">Pop</span><p className="tabular font-bold text-white">{card.population.toLocaleString()}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-slate-500">{filtered.length} cards found</p>

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(card => (
            <div
              key={card.id}
              className={clsx(
                'bg-navy-800/60 rounded-xl border p-3 cursor-pointer transition-all hover:border-slate-600',
                compare.includes(card.id) ? 'border-violet-500/50 bg-violet-500/10' : 'border-slate-800/60',
              )}
              onClick={() => toggleCompare(card.id)}
            >
              <div className="flex justify-center mb-2.5">
                <CardThumbnail card={card} size="md" />
              </div>
              <p className="text-xs font-semibold text-white truncate">{card.name}</p>
              <p className="text-[10px] text-slate-500 truncate mb-1.5">{card.set}</p>
              <ConditionBadge condition={card.condition} size="sm" />
              <div className="flex items-center justify-between mt-2">
                <p className="tabular text-sm font-bold text-white">{fmt(card.currentPrice)}</p>
                <AIScoreBadge score={card.aiScore} label="" size="sm" />
              </div>
              <div className={clsx('flex items-center gap-1 text-[10px] font-medium mt-1', card.priceChange30d >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                {card.priceChange30d >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                <span className="tabular">{card.priceChange30d >= 0 ? '+' : ''}{card.priceChange30d}% 30d</span>
              </div>
              {compare.includes(card.id) && (
                <div className="mt-2 text-[10px] text-violet-300 font-medium">✓ Selected for compare</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60">
                {['', 'Card', 'Set', 'Rarity', 'Condition', 'Price', '30D', 'AI', 'Pop', ''].map((h, i) => (
                  <th key={i} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.map(card => (
                <tr key={card.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-3 py-2.5">
                    <CardThumbnail card={card} size="sm" className="w-8 h-11" />
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-white">{card.name}</p>
                    <p className="text-[10px] text-slate-500">{card.number}</p>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-300 max-w-[140px]">
                    <span className="truncate block">{card.set}</span>
                    <span className="text-slate-500">{card.year}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs text-slate-300">{card.rarity}</span>
                  </td>
                  <td className="px-3 py-2.5"><ConditionBadge condition={card.condition} size="sm" /></td>
                  <td className="px-3 py-2.5 tabular text-sm font-bold text-white">{fmt(card.currentPrice)}</td>
                  <td className="px-3 py-2.5">
                    <span className={clsx('tabular text-sm font-medium', card.priceChange30d >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                      {card.priceChange30d >= 0 ? '+' : ''}{card.priceChange30d}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <AIScoreBadge score={card.aiScore} label="" size="sm" />
                  </td>
                  <td className="px-3 py-2.5 tabular text-xs text-slate-400">{card.population.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => toggleCompare(card.id)}
                      className={clsx(
                        'text-[10px] px-2 py-1 rounded border transition-colors',
                        compare.includes(card.id)
                          ? 'border-violet-500/40 text-violet-300 bg-violet-500/10'
                          : 'border-slate-700 text-slate-400 hover:text-white',
                      )}
                    >
                      {compare.includes(card.id) ? '✓' : '+'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
