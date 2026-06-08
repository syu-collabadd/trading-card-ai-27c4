import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Bell, Activity } from 'lucide-react';
import { MOCK_CARDS, generatePriceHistory } from '../data/mockCards';
import CardThumbnail from '../components/CardThumbnail';
import clsx from 'clsx';

const TIMEFRAMES = ['7D', '30D', '90D', '1Y'];

const MARKET_MOVERS = MOCK_CARDS.slice(0, 6).map(c => ({
  ...c,
  priceChange: c.priceChange30d,
}));

const SECTOR_DATA = [
  { name: 'Base Set', value: 38400, change: 14.2 },
  { name: 'Neo Series', value: 21200, change: 22.8 },
  { name: 'EX Series', value: 18900, change: 8.1 },
  { name: 'Promo Cards', value: 14700, change: 31.4 },
  { name: 'WOTC Era', value: 29100, change: 11.6 },
];

const VOLUME_DATA = [
  { day: 'Mon', volume: 82000, avgPrice: 1240 },
  { day: 'Tue', volume: 96000, avgPrice: 1380 },
  { day: 'Wed', volume: 71000, avgPrice: 1290 },
  { day: 'Thu', volume: 118000, avgPrice: 1540 },
  { day: 'Fri', volume: 145000, avgPrice: 1820 },
  { day: 'Sat', volume: 198000, avgPrice: 2100 },
  { day: 'Sun', volume: 162000, avgPrice: 1960 },
];

const ALERTS = [
  { card: 'Charizard Base', type: 'price', message: 'Price crossed $40,000 threshold', time: '2m ago', color: 'emerald' },
  { card: 'Mew Best of Game', type: 'volume', message: 'Volume spike — 340% above 7-day avg', time: '18m ago', color: 'yellow' },
  { card: 'Pikachu WBSP', type: 'price', message: 'New 30-day high reached', time: '1h ago', color: 'blue' },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function MarketIntelligence() {
  const [activeCard, setActiveCard] = useState(MOCK_CARDS[1]);
  const [timeframe, setTimeframe] = useState('30D');

  const days = timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : timeframe === '90D' ? 90 : 365;
  const chartData = generatePriceHistory(activeCard.currentPrice, days);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Market Intelligence</h1>
        <p className="text-sm text-slate-400 mt-0.5">Real-time price data, volume analysis, and market trends</p>
      </div>

      {/* Market pulse row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Market Index', value: '4,821', change: 6.2, sub: '30-day avg' },
          { label: 'Active Listings', value: '12,440', change: 2.1, sub: 'this week' },
          { label: 'Avg Sale Price', value: '$1,840', change: 8.7, sub: '30-day' },
          { label: 'Total Volume', value: '$2.1M', change: -3.4, sub: '24h' },
        ].map(({ label, value, change, sub }) => (
          <div key={label} className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
            <p className="tabular text-xl font-bold text-white">{value}</p>
            <div className={clsx('flex items-center gap-1 text-xs mt-1', change >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
              {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span className="tabular">{change >= 0 ? '+' : ''}{change}%</span>
              <span className="text-slate-500">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Price chart */}
        <div className="lg:col-span-2 bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">{activeCard.name} — {activeCard.set}</h2>
              <p className="text-xs text-slate-500">{activeCard.condition} · #{activeCard.number}</p>
            </div>
            <div className="flex gap-1">
              {TIMEFRAMES.map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={clsx(
                    'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                    timeframe === tf
                      ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30'
                      : 'text-slate-400 hover:text-white border border-transparent',
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="text-right mb-2">
            <span className="tabular text-2xl font-bold text-white">{fmt(activeCard.currentPrice)}</span>
            <span className={clsx('ml-2 tabular text-sm', activeCard.priceChange30d >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
              {activeCard.priceChange30d >= 0 ? '+' : ''}{activeCard.priceChange30d}%
            </span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="mkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false}
                interval={Math.floor(chartData.length / 5)} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false}
                tickFormatter={v => activeCard.currentPrice > 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} width={42} />
              <Tooltip
                contentStyle={{ background: '#0f1128', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [fmt(v), 'Price']}
              />
              <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2}
                fill="url(#mkGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Card selector row */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {MOCK_CARDS.slice(0, 5).map(card => (
              <button
                key={card.id}
                onClick={() => setActiveCard(card)}
                className={clsx(
                  'flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all',
                  activeCard.id === card.id
                    ? 'border-violet-500/40 bg-violet-500/10 text-white'
                    : 'border-slate-700 text-slate-400 hover:text-slate-200',
                )}
              >
                <CardThumbnail card={card} size="sm" className="w-6 h-8" />
                {card.name}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={14} className="text-electric-400" />
              <h2 className="text-sm font-semibold text-white">Live Alerts</h2>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {ALERTS.map((alert, i) => (
                <div key={i} className={clsx(
                  'rounded-lg p-3 border',
                  alert.color === 'emerald' && 'bg-emerald-500/5 border-emerald-500/20',
                  alert.color === 'yellow' && 'bg-yellow-500/5 border-yellow-500/20',
                  alert.color === 'blue' && 'bg-blue-500/5 border-blue-500/20',
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-white">{alert.card}</p>
                    <p className="text-[10px] text-slate-500">{alert.time}</p>
                  </div>
                  <p className="text-[11px] text-slate-400">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sector performance */}
          <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Sector Performance</h2>
            </div>
            <div className="space-y-2.5">
              {SECTOR_DATA.map(sector => (
                <div key={sector.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{sector.name}</span>
                    <span className={clsx('tabular font-medium', sector.change >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                      {sector.change >= 0 ? '+' : ''}{sector.change}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-electric-500"
                      style={{ width: `${Math.min(sector.change * 2.5, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Volume chart + movers */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
          <h2 className="text-sm font-semibold text-white mb-4">Weekly Trading Volume</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={VOLUME_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={40} />
              <Tooltip
                contentStyle={{ background: '#0f1128', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [fmt(v), 'Volume']}
              />
              <Bar dataKey="volume" fill="#3b82f6" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
          <h2 className="text-sm font-semibold text-white mb-4">Top Market Movers (30D)</h2>
          <div className="space-y-2">
            {MARKET_MOVERS.map(card => (
              <div key={card.id} className="flex items-center gap-3">
                <CardThumbnail card={card} size="sm" className="w-8 h-11" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{card.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{card.set}</p>
                </div>
                <div className="text-right">
                  <p className="tabular text-sm font-bold text-white">{fmt(card.currentPrice)}</p>
                  <p className={clsx('tabular text-xs font-medium', card.priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                    {card.priceChange >= 0 ? '+' : ''}{card.priceChange}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
