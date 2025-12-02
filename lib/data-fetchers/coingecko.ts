const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
}

export async function fetchTokenData(geckoId: string): Promise<CoinGeckoToken | null> {
  try {
    // Use the public API without key for free tier
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${geckoId}`
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching token data:', error);
    return null;
  }
}

export async function fetchTokenPrice(geckoId: string): Promise<number | null> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${geckoId}&vs_currencies=usd`
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    return data[geckoId]?.usd || null;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}

// Rate limiting helper - CoinGecko free tier allows 10-50 calls/minute
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 1200; // 1.2 seconds between calls to stay safe

export async function rateLimitedFetch<T>(
  fetchFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  
  if (timeSinceLastCall < MIN_CALL_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_CALL_INTERVAL - timeSinceLastCall)
    );
  }
  
  lastCallTime = Date.now();
  return fetchFn();
}
