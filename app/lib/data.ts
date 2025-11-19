import { Time } from 'lightweight-charts';

export interface Candle {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const generateData = (
  startPrice: number,
  volatility: number,
  count: number,
  startDate: Date
): Candle[] => {
  const data: Candle[] = [];
  let currentPrice = startPrice;
  let currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    // Simulate 5-minute bars
    currentDate.setMinutes(currentDate.getMinutes() + 5);
    
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    // Unix timestamp for intraday
    const time = Math.floor(currentDate.getTime() / 1000) as Time; 

    data.push({
      time,
      open,
      high,
      low,
      close,
    });

    currentPrice = close;
  }

  return data;
};

export const MOCK_ES_DATA = generateData(4500, 2, 1000, new Date('2023-01-01T09:30:00'));
export const MOCK_XAU_DATA = generateData(2000, 1, 1000, new Date('2023-01-01T09:30:00'));

