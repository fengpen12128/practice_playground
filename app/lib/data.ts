export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear Congruential Generator (LCG)
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export const generateData = (
  startPrice: number,
  volatility: number,
  count: number,
  startDate: Date
): Candle[] => {
  const data: Candle[] = [];
  let currentPrice = startPrice;
  // Copy date to avoid mutation issues if called multiple times
  let currentDate = new Date(startDate.getTime());
  const random = new SeededRandom(12345); // Fixed seed for deterministic data

  for (let i = 0; i < count; i++) {
    // Simulate 5-minute bars
    currentDate.setMinutes(currentDate.getMinutes() + 5);
    
    const change = (random.next() - 0.5) * volatility;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + random.next() * volatility * 0.5;
    const low = Math.min(open, close) - random.next() * volatility * 0.5;

    // klinecharts uses milliseconds timestamp
    const timestamp = currentDate.getTime();

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: random.next() * 1000,
    });

    currentPrice = close;
  }

  return data;
};

export const MOCK_ES_DATA = generateData(4500, 2, 1000, new Date('2023-01-01T09:30:00'));
export const MOCK_XAU_DATA = generateData(2000, 1, 1000, new Date('2023-01-01T09:30:00'));
