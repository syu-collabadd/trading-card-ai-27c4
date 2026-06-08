export type CardCondition = 'PSA 10' | 'PSA 9' | 'PSA 8' | 'PSA 7' | 'PSA 6' | 'Raw NM' | 'Raw EX' | 'Raw VG';

export interface Card {
  id: string;
  name: string;
  set: string;
  year: number;
  number: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Holo Rare' | 'Ultra Rare' | 'Secret Rare' | 'Promo';
  condition: CardCondition;
  imageUrl: string;
  currentPrice: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  marketCap: number;
  volume24h: number;
  aiScore: number;
  rarityScore: number;
  population: number;
  gradedPopulation: number;
  sport: 'Pokemon' | 'Baseball' | 'Basketball' | 'Football' | 'Soccer';
  player?: string;
  team?: string;
  inPortfolio: boolean;
  purchasePrice?: number;
  purchaseDate?: string;
  quantity?: number;
}

export interface PriceHistory {
  date: string;
  price: number;
  volume: number;
}

export interface AIAnalysis {
  cardId: string;
  conditionEstimate: CardCondition;
  conditionConfidence: number;
  pricePrediction: {
    low: number;
    mid: number;
    high: number;
    confidence: number;
    timeframe: '30d' | '90d' | '1y';
  };
  investmentScore: number;
  sentimentScore: number;
  rarityScore: number;
  insights: string[];
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  risks: string[];
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPct: number;
  dayChange: number;
  dayChangePct: number;
  weekChange: number;
  monthChange: number;
  cardCount: number;
  topGainers: Card[];
  topLosers: Card[];
}

export interface MarketTrend {
  period: string;
  change: number;
  volume: number;
}
