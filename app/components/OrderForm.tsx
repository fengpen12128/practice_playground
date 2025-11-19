import React, { useState } from 'react';
import clsx from 'clsx';

interface OrderFormProps {
  currentPrice: number;
  onPlaceOrder: (side: 'BUY' | 'SELL', size: number) => void;
  symbol: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({ currentPrice, onPlaceOrder, symbol }) => {
  const [size, setSize] = useState<string>('1');
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');

  const handleSubmit = (side: 'BUY' | 'SELL') => {
    const numSize = parseFloat(size);
    if (!isNaN(numSize) && numSize > 0) {
      onPlaceOrder(side, numSize);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-900 border-l border-zinc-800 w-[300px] h-full">
      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          className={clsx(
            "flex-1 py-3 text-sm font-medium transition-colors",
            "text-zinc-100 border-b-2 border-blue-500 bg-zinc-800/50"
          )}
        >
          Trade
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Earn
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Order Type Selector */}
        <div className="flex bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setOrderType('Market')}
            className={clsx(
              "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
              orderType === 'Market' ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('Limit')}
            className={clsx(
              "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
              orderType === 'Limit' ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            )}
            disabled // Only Market for now
          >
            Limit
          </button>
        </div>

        {/* Size Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Size</span>
            <span>USD</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-right text-zinc-100 focus:outline-none focus:border-zinc-700"
              placeholder="0.00"
            />
            <span className="absolute left-3 top-2 text-zinc-500 text-sm">Sz</span>
          </div>
        </div>

        {/* Price Display (Market) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Price</span>
            <span>USD</span>
          </div>
          <div className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-md px-3 py-2 text-right text-zinc-400 cursor-not-allowed">
            {currentPrice.toFixed(2)}
          </div>
        </div>

        {/* Order Value Estimate */}
        <div className="flex justify-between text-xs text-zinc-500 mt-2">
          <span>Est. Value</span>
          <span>${(parseFloat(size || '0') * currentPrice).toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleSubmit('BUY')}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
          >
            Buy / Long
          </button>
          <button
            onClick={() => handleSubmit('SELL')}
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-rose-900/20"
          >
            Sell / Short
          </button>
        </div>

        {/* Account Info Mockup */}
        <div className="mt-auto pt-6 border-t border-zinc-800/50 flex flex-col gap-2 text-xs text-zinc-500">
          <div className="flex justify-between">
            <span>Margin Usage</span>
            <span className="text-zinc-300">0.00%</span>
          </div>
          <div className="flex justify-between">
            <span>Buying Power</span>
            <span className="text-zinc-300">$100,000.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

