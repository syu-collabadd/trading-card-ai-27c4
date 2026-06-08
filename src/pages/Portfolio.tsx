import { TrendingUp, TrendingDown, Plus, Briefcase } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { MOCK_CARDS, generatePriceHistory, getPortfolioSummary } from '../data/mockCards';
import CardThumbnail from '../components/CardThumbnail';
import ConditionBadge from '../components/ConditionBadge';
import AIScoreBadge from '../components/AIScoreBadge';
import clsx from 'clsx';

const portfolio = getPortfolioSummary();
const ownedCards = MOCK_CARDS.filter(c => c.inPortfolio);

const portfolioHistory = generatePriceHistory(portfolio.totalValue, 90).map((d, i) => ({
  ...d,
  cost: portfolio.totalCost * (1 + (i / 180)),
}));

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];

const allocation = ownedCards.map((c, i) => ({
  name: c.name,
  value: c.currentPrice * (c.quantity || 1),
  color: PIE_COLORS[i % PIE_COLORS.length],
}));

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function Portfolio() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Manager</h1>
          <p className="text-sm text-slate-400 mt-0.5">Track and optimize your card collection</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric-600 hover:bg-electric-500 text-white text-sm font-medium transition-colors">
          <Plus size={16} />
          Add Card
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Value', value: fmt(portfolio.totalValue), change: portfolio.dayChangePct, changeLabel: '24h', color: 'text-white' },
          { label: 'Total Cost Basis', value: fmt(portfolio.totalCost), color: 'text-white' },
          { label: 'Unrealized Gain', value: fmt(portfolio.totalGain), change: portfolio.totalGainPct, changeLabel: 'all-time', color: portfolio.totalGain >= 0 ? 'text-emerald-400' : 'text-rose-400' },
          { label: 'Cards Owned', value: ownedCards.reduce((s, c) => s + (c.quantity || 1), 0).toString(), color: 'text-white' },
        ].map(({ label, value, change, changeLabel, color }) => (
          <div key={label} className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
            <p className={clsx('tabular text-xl font-bold', color)}>{value}</p>
            {change !== undefined && (
              <div className={clsx('flex items-center gap-1 text-xs mt-1', change >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                <span className="tabular">{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span>
                <span className="text-slate-500">{changeLabel}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Performance chart */}
        <div className="lg:col-span-2 bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
          <h2 className="text-sm font-semibold text-white mb-4">Portfolio Performance — 90 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={portfolioHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false}
                interval={Math.floor(portfolioHistory.length / 5)} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={45} />
              <Tooltip
                contentStyle={{ background: '#0f1128', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number, name: string) => [fmt(v), name === 'price' ? 'Value' : 'Cost Basis']}
              />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Value" />
              <Line type="monotone" dataKey="cost" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Cost" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation pie */}
        <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Allocation</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={allocation} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                dataKey="value" paddingAngle={3}>
                {allocation.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f1128', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [fmt(v), 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {allocation.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: a.color }} />
                <span className="text-slate-400 flex-1 truncate">{a.name}</span>
                <span className="tabular text-white font-medium">
                  {((a.value / portfolio.totalValue) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card table */}
      <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60">
          <Briefcase size={15} className="text-electric-400" />
          <h2 className="text-sm font-semibold text-white">My Cards</h2>
          <span className="ml-2 text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {ownedCards.length} positions
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60">
                {['Card', 'Condition', 'Qty', 'Avg Cost', 'Current', 'Gain/Loss', 'AI Score', '30D'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {ownedCards.map(card => {
                const qty = card.quantity || 1;
                const cost = card.purchasePrice || card.currentPrice;
                const gain = (card.currentPrice - cost) * qty;
                const gainPct = ((card.currentPrice - cost) / cost) * 100;
                return (
                  <tr key={card.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <CardThumbnail card={card} size="sm" className="w-8 h-11 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{card.name}</p>
                          <p className="text-xs text-slate-500 truncate">{card.set}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><ConditionBadge condition={card.condition} size="sm" /></td>
                    <td className="px-4 py-3 tabular text-sm text-white">{qty}</td>
                    <td className="px-4 py-3 tabular text-sm text-slate-300">{fmt(cost)}</td>
                    <td className="px-4 py-3 tabular text-sm font-semibold text-white">{fmt(card.currentPrice)}</td>
                    <td className="px-4 py-3">
                      <p className={clsx('tabular text-sm font-medium', gain >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                        {gain >= 0 ? '+' : ''}{fmt(gain)}
                      </p>
                      <p className={clsx('tabular text-[10px]', gain >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
                        {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <AIScoreBadge score={card.aiScore} label="" size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <p className={clsx('tabular text-sm font-medium', card.priceChange30d >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                        {card.priceChange30d >= 0 ? '+' : ''}{card.priceChange30d}%
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
