import React, { useState } from 'react';
import clsx from 'clsx';
import { Position, Order } from '../types';

interface OrderListProps {
  positions: Position[];
  orders: Order[];
  currentPrice: number;
}

export const OrderList: React.FC<OrderListProps> = ({ positions, orders, currentPrice }) => {
  const [activeTab, setActiveTab] = useState<'Positions' | 'Orders'>('Positions');

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-t border-zinc-800">
      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('Positions')}
          className={clsx(
            "px-6 py-2 text-sm font-medium transition-colors border-r border-zinc-800",
            activeTab === 'Positions' ? "text-zinc-100 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          Positions
          {positions.length > 0 && (
            <span className="ml-2 text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">
              {positions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('Orders')}
          className={clsx(
            "px-6 py-2 text-sm font-medium transition-colors border-r border-zinc-800",
            activeTab === 'Orders' ? "text-zinc-100 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          Order History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-0">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-950/50 sticky top-0 text-xs uppercase font-medium tracking-wider">
            {activeTab === 'Positions' ? (
              <tr>
                <th className="px-4 py-2 font-medium">Symbol</th>
                <th className="px-4 py-2 font-medium">Size</th>
                <th className="px-4 py-2 font-medium text-right">Entry Price</th>
                <th className="px-4 py-2 font-medium text-right">Mark Price</th>
                <th className="px-4 py-2 font-medium text-right">PnL (ROE%)</th>
              </tr>
            ) : (
              <tr>
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Side</th>
                <th className="px-4 py-2 font-medium text-right">Price</th>
                <th className="px-4 py-2 font-medium text-right">Size</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {activeTab === 'Positions' ? (
              positions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-600">
                    No open positions
                  </td>
                </tr>
              ) : (
                positions.map((pos, i) => {
                  const pnl = (currentPrice - pos.entryPrice) * (pos.side === 'LONG' ? 1 : -1) * pos.size;
                  const roe = ((currentPrice - pos.entryPrice) / pos.entryPrice) * (pos.side === 'LONG' ? 1 : -1) * 100;
                  const pnlColor = pnl >= 0 ? 'text-emerald-500' : 'text-rose-500';

                  return (
                    <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-2 font-medium text-zinc-200">
                        <div className="flex items-center gap-2">
                          <div className={clsx("w-1 h-4 rounded-full", pos.side === 'LONG' ? "bg-emerald-500" : "bg-rose-500")} />
                          {pos.symbol}
                        </div>
                      </td>
                      <td className={clsx("px-4 py-2", pos.side === 'LONG' ? "text-emerald-500" : "text-rose-500")}>
                        {pos.size} {pos.symbol}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">{pos.entryPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-mono text-zinc-300">{currentPrice.toFixed(2)}</td>
                      <td className={clsx("px-4 py-2 text-right font-mono", pnlColor)}>
                        {pnl > 0 ? '+' : ''}{pnl.toFixed(2)} <span className="text-xs opacity-70">({roe.toFixed(2)}%)</span>
                      </td>
                    </tr>
                  );
                })
              )
            ) : (
              orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">
                    No order history
                  </td>
                </tr>
              ) : (
                orders.slice().reverse().map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-2 text-zinc-500">{new Date(order.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">{order.type}</td>
                    <td className={clsx("px-4 py-2 font-medium", order.side === 'BUY' ? "text-emerald-500" : "text-rose-500")}>
                      {order.side}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">{order.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-mono">{order.size}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

