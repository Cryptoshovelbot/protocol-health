const DEFILLAMA_BASE_URL = 'https://api.llama.fi';

interface DefiLlamaProtocol {
  id: string;
  name: string;
  address?: string;
  symbol?: string;
  url?: string;
  description?: string;
  chain: string;
  logo?: string;
  audits?: string;
  audit_links?: string[];
  gecko_id?: string;
  category?: string;
  chains: string[];
  module?: string;
  twitter?: string;
  oracles?: string[];
  listedAt?: number;
  tvl: number;
  chainTvls?: Record<string, {
    tvl: number;
    tvlPrevDay?: number;
    tvlPrevWeek?: number;
    tvlPrevMonth?: number;
  }>;
  change_1h?: number;
  change_1d?: number;
  change_7d?: number;
  mcap?: number;
}

interface TVLHistory {
  date: number;
  totalLiquidityUSD: number;
}

export async function fetchProtocols(): Promise<DefiLlamaProtocol[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/protocols`);
    if (!response.ok) throw new Error('Failed to fetch protocols');
    return await response.json();
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return [];
  }
}

export async function fetchProtocol(slug: string): Promise<DefiLlamaProtocol | null> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/protocol/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching protocol:', error);
    return null;
  }
}

export async function fetchTVLHistory(protocol: string): Promise<TVLHistory[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/protocol/${protocol}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.tvl || [];
  } catch (error) {
    console.error('Error fetching TVL history:', error);
    return [];
  }
}

export function calculateTVLVolatility(history: TVLHistory[]): number {
  if (history.length < 2) return 0;
  
  // Get last 90 days of data
  const now = Date.now() / 1000;
  const ninetyDaysAgo = now - (90 * 24 * 60 * 60);
  const recentHistory = history.filter(h => h.date >= ninetyDaysAgo);
  
  if (recentHistory.length < 2) return 0;
  
  // Calculate daily returns
  const returns: number[] = [];
  for (let i = 1; i < recentHistory.length; i++) {
    const prevTVL = recentHistory[i - 1].totalLiquidityUSD;
    const currTVL = recentHistory[i].totalLiquidityUSD;
    if (prevTVL > 0) {
      returns.push((currTVL - prevTVL) / prevTVL);
    }
  }
  
  if (returns.length === 0) return 0;
  
  // Calculate standard deviation
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  // Convert to percentage and cap at 100
  return Math.min(stdDev * 100, 100);
}

export function getProtocolAge(listedAt?: number): number {
  if (!listedAt) return 0;
  const now = Date.now() / 1000;
  const ageInDays = (now - listedAt) / (24 * 60 * 60);
  return Math.floor(ageInDays);
}
