import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CardAnalysis from './pages/CardAnalysis';
import MarketIntelligence from './pages/MarketIntelligence';
import Portfolio from './pages/Portfolio';
import CardDatabase from './pages/CardDatabase';

export default function App() {
  return (
    <BrowserRouter basename="/trading-card-ai-27c4">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<CardAnalysis />} />
          <Route path="market" element={<MarketIntelligence />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="database" element={<CardDatabase />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
