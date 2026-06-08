import { useState } from 'react';
import { Upload, Search, Sparkles, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle } from 'lucide-react';
import CardThumbnail from '../components/CardThumbnail';
import ConditionBadge from '../components/ConditionBadge';
import AIScoreBadge from '../components/AIScoreBadge';
import { MOCK_CARDS, MOCK_AI_ANALYSES } from '../data/mockCards';
import type { Card } from '../data/types';
import clsx from 'clsx';

const RECOMMENDATION_COLORS = {
  'Strong Buy': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Buy': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'Hold': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'Sell': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Strong Sell': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function CardAnalysis() {
  const [selectedCard, setSelectedCard] = useState<Card>(MOCK_CARDS[1]);
  const [search, setSearch] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysis = MOCK_AI_ANALYSES[selectedCard.id];
  const filtered = MOCK_CARDS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.set.toLowerCase().includes(search.toLowerCase()),
  );

  function selectCard(card: Card) {
    setSelectedCard(card);
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1200);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Card Analysis</h1>
        <p className="text-sm text-slate-400 mt-0.5">AI-powered condition grading, valuation, and investment signals</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: card selector */}
        <div className="space-y-4">
          {/* Upload zone */}
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-5 text-center hover:border-electric-500/50 hover:bg-electric-500/5 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-electric-500/10 flex items-center justify-center mx-auto mb-2 transition-colors">
              <Upload size={18} className="text-slate-400 group-hover:text-electric-400 transition-colors" />
            </div>
            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Upload card image</p>
            <p className="text-xs text-slate-500 mt-0.5">AI will identify and grade automatically</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cards..."
              className="w-full bg-navy-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500/50"
            />
          </div>

          {/* Card list */}
          <div className="space-y-1.5 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
            {filtered.map(card => (
              <button
                key={card.id}
                onClick={() => selectCard(card)}
                className={clsx(
                  'w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all',
                  selectedCard.id === card.id
                    ? 'bg-electric-500/10 border-electric-500/30 '
                    : 'bg-navy-800/50 border-slate-800/60 hover:border-slate-700',
                )}
              >
                <CardThumbnail card={card} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{card.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{card.set} · {card.number}</p>
                  <ConditionBadge condition={card.condition} size="sm" />
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="tabular text-sm font-bold text-white">${card.currentPrice.toLocaleString()}</p>
                  <p className={clsx('tabular text-[10px]', card.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                    {card.priceChange24h >= 0 ? '+' : ''}{card.priceChange24h}%
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: analysis panel */}
        <div className="lg:col-span-2 space-y-4">
          {isAnalyzing ? (
            <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 rounded-full border-2 border-electric-500 border-t-transparent animate-spin mb-4" />
              <p className="text-sm font-medium text-white">Running AI Analysis...</p>
              <p className="text-xs text-slate-400 mt-1">Checking population data, price history, sentiment</p>
            </div>
          ) : (
            <>
              {/* Card hero */}
              <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-5">
                <div className="flex gap-5 items-start">
                  <CardThumbnail card={selectedCard} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedCard.name}</h2>
                        <p className="text-sm text-slate-400">{selectedCard.set} · {selectedCard.number} · {selectedCard.year}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <ConditionBadge condition={selectedCard.condition} />
                          <span className={clsx(
                            'text-xs px-2 py-0.5 rounded border font-medium',
                            selectedCard.rarity === 'Secret Rare' || selectedCard.rarity === 'Promo'
                              ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                              : 'bg-violet-500/15 text-violet-300 border-violet-500/30',
                          )}>
                            {selectedCard.rarity}
                          </span>
                        </div>
                      </div>
                      {analysis && (
                        <span className={clsx(
                          'text-sm font-bold px-3 py-1 rounded-lg border',
                          RECOMMENDATION_COLORS[analysis.recommendation],
                        )}>
                          {analysis.recommendation}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Current Price</p>
                        <p className="tabular text-xl font-bold text-white">{fmt(selectedCard.currentPrice)}</p>
                        <p className={clsx('tabular text-xs', selectedCard.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                          {selectedCard.priceChange24h >= 0 ? '+' : ''}{selectedCard.priceChange24h}% 24h
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Pop Report</p>
                        <p className="tabular text-xl font-bold text-white">{selectedCard.population.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">graded copies</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">24h Volume</p>
                        <p className="tabular text-xl font-bold text-white">{fmt(selectedCard.volume24h)}</p>
                        <p className="text-xs text-slate-500">traded</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI score row */}
              {analysis && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { score: analysis.investmentScore, label: 'Investment' },
                      { score: analysis.sentimentScore, label: 'Sentiment' },
                      { score: analysis.rarityScore, label: 'Rarity' },
                    ].map(({ score, label }) => (
                      <div key={label} className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4 flex flex-col items-center">
                        <AIScoreBadge score={score} label={label} size="lg" />
                      </div>
                    ))}
                  </div>

                  {/* Price prediction */}
                  <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={15} className="text-electric-400" />
                      <h3 className="text-sm font-semibold text-white">90-Day Price Prediction</h3>
                      <span className="ml-auto text-xs text-slate-400">
                        <span className="tabular text-electric-400 font-semibold">{analysis.pricePrediction.confidence}%</span> confidence
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center px-1">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-500/40 via-emerald-500/40 to-emerald-600/60"
                            style={{
                              marginLeft: `${((analysis.pricePrediction.low / (analysis.pricePrediction.high * 1.1)) * 100)}%`,
                              width: `${(((analysis.pricePrediction.high - analysis.pricePrediction.low) / (analysis.pricePrediction.high * 1.1)) * 100)}%`,
                            }}
                          />
                        </div>
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white/80 rounded"
                          style={{
                            left: `${((analysis.pricePrediction.mid / (analysis.pricePrediction.high * 1.1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: 'Bear case', value: analysis.pricePrediction.low, color: 'text-rose-400' },
                        { label: 'Mid target', value: analysis.pricePrediction.mid, color: 'text-white' },
                        { label: 'Bull case', value: analysis.pricePrediction.high, color: 'text-emerald-400' },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
                          <p className={clsx('tabular font-bold text-base', color)}>{fmt(value)}</p>
                          <p className={clsx('tabular text-[10px]', color)}>
                            {value >= selectedCard.currentPrice ? '+' : ''}{(((value - selectedCard.currentPrice) / selectedCard.currentPrice) * 100).toFixed(1)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition estimate */}
                  <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck size={15} className="text-violet-400" />
                      <h3 className="text-sm font-semibold text-white">AI Condition Estimate</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <ConditionBadge condition={analysis.conditionEstimate} />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Confidence</span>
                          <span className="tabular text-white font-medium">{analysis.conditionConfidence}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-electric-500"
                            style={{ width: `${analysis.conditionConfidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insights & risks */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-emerald-400" />
                        <h3 className="text-sm font-semibold text-white">Key Insights</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.insights.map((insight, i) => (
                          <li key={i} className="flex gap-2 text-xs text-slate-300">
                            <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={14} className="text-yellow-400" />
                        <h3 className="text-sm font-semibold text-white">Risk Factors</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.risks.map((risk, i) => (
                          <li key={i} className="flex gap-2 text-xs text-slate-300">
                            <span className="text-yellow-400 mt-0.5 flex-shrink-0">⚠</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {!analysis && (
                <div className="bg-navy-800/60 rounded-xl border border-slate-800/60 p-6 text-center">
                  <Sparkles size={24} className="text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Full AI analysis available for featured cards.</p>
                  <p className="text-xs text-slate-500 mt-1">Select Charizard or Pikachu to see a detailed analysis.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
