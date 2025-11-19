export interface Order {
  id: string;
  type: 'MARKET' | 'LIMIT';
  side: 'BUY' | 'SELL';
  size: number;
  price: number;
  timestamp: number;
  status: 'FILLED' | 'OPEN' | 'CANCELLED';
}

export interface Position {
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  unrealizedPnl: number;
}

