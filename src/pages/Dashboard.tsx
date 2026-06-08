import { TrendingUp, TrendingDown, Sparkles, Activity, Star, ChevronRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import CardThumbnail from '../components/CardThumbnail';
import ConditionBadge from '../components/ConditionBadge';
import { MOCK_CARDS, generatePriceHistory, getPortfolioSummary } from '../data/mockCards';
import clsx from 'clsx';

const portfolio = getPortfolioSummary();
const charizard = MOCK_CARDS.find(c => c.id === 'charizard-base-1')!;
const chartData = generatePriceHistory(42000, 30);

const TRENDING_CARDS = MOCK_CARDS.filter(c => c.priceChange7d > 5).slice(0, 4);

const AI_INSIGHTS = [
  {
    type: 'bullish',
    card: 'Charizard Base Set PSA 10',
    insight: 'Population report shows 820 copies — historically low supply driving +18% this month. Strong buy signal.',
    confidence: 94,
  },
  {
    type: 'alert',
    card: 'Mew Best of Game Promo',
    insight: 'Unusual volume spike (+340%) detected. Social media sentiment at 6-month high. Watch for entry.',
    confidence: 81,
  },
  {
    type: 'bullish',
    card: 'Lugia Neo Genesis PSA 9',
    insight: 'Undervalued vs. historical ratio to Charizard. 38% monthly gain suggests momentum continuation.',
    confidence: 76,
  },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio Overview</h1>
        <p className="text-sm text-slate-400 mt-0.5">Live AI-powered market intelligence</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          label="Portfolio Value"
          value={fmt(portfolio.totalValue)}
          change={portfolio.dayChangePct}
          changeLabel="today"
          accent="blue"
        />
        <StatCard
          label="Total Gain"
          value={fmt(portfolio.totalGain)}
          change={portfolio.totalGainPct}
          changeLabel="all-time"
          accent="emerald"
        />
        <StatCard
          label="7-Day Change"
          value={fmt(portfolio.weekChange)}
          change={4.8}
          changeLabel="7d"
          accent="violet"
        />
        <StatCard
          label="Cards Tracked"
          value={portfolio.cardCount.toString()}
          accent="blue"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Portfolio chart */}
        <div className="lg:col-span-2 bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Charizard Base Set — 30-Day Price</h2>
              <p className="text-xs text-slate-500">PSA 10 · #4/102</p>
            </div>
            <div className="text-right">
              <p className="tabular text-lg font-bold text-white">{fmt(charizard.currentPrice)}</p>
              <p className={clsx('text-xs tabular font-medium', charizard.priceChange30d >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                {charizard.priceChange30d >= 0 ? '+' : ''}{charizard.priceChange30d}% this month
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false}
                interval={Math.floor(chartData.length / 6)}
                tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={45} />
              <Tooltip
                contentStyle={{ background: '#0f1128', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(v: number) => [fmt(v), 'Price']}
              />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2}
                fill="url(#priceGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Sparkles size={13} className="text-violet-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">AI Insights</h2>
            <span className="ml-auto text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">LIVE</span>
          </div>

          <div className="space-y-3">
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} className={clsx(
                'rounded-lg p-3 border',
                insight.type === 'bullish'
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-yellow-500/5 border-yellow-500/20',
              )}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Activity size={11} className={insight.type === 'bullish' ? 'text-emerald-400' : 'text-yellow-400'} />
                  <span className="text-[11px] font-semibold text-white">{insight.card}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{insight.insight}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', insight.type === 'bullish' ? 'bg-emerald-500' : 'bg-yellow-500')}
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 tabular">{insight.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending cards */}
      <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={15} className="text-yellow-400" />
            <h2 className="text-sm font-semibold text-white">Trending This Week</h2>
          </div>
          <button className="text-xs text-electric-400 hover:text-electric-300 flex items-center gap-1">
            View all <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TRENDING_CARDS.map(card => (
            <div key={card.id} className="bg-navy-900/60 rounded-lg border border-slate-800/60 p-3 flex gap-3 items-start hover:border-slate-700 transition-colors cursor-pointer">
              <CardThumbnail card={card} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{card.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{card.set}</p>
                <ConditionBadge condition={card.condition} size="sm" />
                <p className="tabular text-sm font-bold text-white mt-1.5">${card.currentPrice.toLocaleString()}</p>
                <div className={clsx('flex items-center gap-1 text-[11px] font-medium', card.priceChange7d >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {card.priceChange7d >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  <span className="tabular">{card.priceChange7d >= 0 ? '+' : ''}{card.priceChange7d}%</span>
                  <span className="text-slate-500">7d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
