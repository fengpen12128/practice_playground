'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChartComponent, ChartComponentRef } from './ChartComponent';
import { ControlPanel } from './ControlPanel';
import { DrawingToolbar, DrawingTool } from './DrawingToolbar';
import { OrderForm } from './OrderForm';
import { OrderList } from './OrderList';
import { MOCK_ES_DATA, MOCK_XAU_DATA, Candle } from '../lib/data';
import { Position, Order } from '../types';
import clsx from 'clsx';

type Symbol = 'ES' | 'XAU';

export const Playground: React.FC = () => {
  const [symbol, setSymbol] = useState<Symbol>('ES');
  const [data, setData] = useState<Candle[]>(MOCK_ES_DATA);
  const [currentIndex, setCurrentIndex] = useState<number>(100); // Start with some history
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per bar
  const [activeTool, setActiveTool] = useState<DrawingTool>('cursor');
  
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const chartRef = useRef<ChartComponentRef>(null);

  useEffect(() => {
    if (symbol === 'ES') {
      setData(MOCK_ES_DATA);
    } else {
      setData(MOCK_XAU_DATA);
    }
    setCurrentIndex(100);
    setIsPlaying(false);
    // Clear drawings when symbol changes
    chartRef.current?.clearOverlays();
  }, [symbol]);

  const handleNextBar = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= data.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [data.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(handleNextBar, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNextBar, playbackSpeed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (!isPlaying) {
          handleNextBar();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, handleNextBar]);

  const visibleData = data.slice(0, currentIndex + 1);
  const currentPrice = visibleData[visibleData.length - 1].close;

  const handlePlaceOrder = (side: 'BUY' | 'SELL', size: number) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'MARKET',
      side,
      size,
      price: currentPrice,
      timestamp: Date.now(),
      status: 'FILLED'
    };
    setOrders(prev => [...prev, newOrder]);

    setPositions(prev => {
      const existing = prev.find(p => p.symbol === symbol);
      
      if (!existing) {
        return [...prev, {
          symbol,
          side: side === 'BUY' ? 'LONG' : 'SHORT',
          size,
          entryPrice: currentPrice,
          unrealizedPnl: 0
        }];
      }

      const isSameSide = (existing.side === 'LONG' && side === 'BUY') || (existing.side === 'SHORT' && side === 'SELL');
      
      if (isSameSide) {
        const totalSize = existing.size + size;
        const totalValue = (existing.size * existing.entryPrice) + (size * currentPrice);
        return prev.map(p => p.symbol === symbol ? {
          ...p,
          size: totalSize,
          entryPrice: totalValue / totalSize
        } : p);
      } else {
        if (existing.size > size) {
          // Partial close
          return prev.map(p => p.symbol === symbol ? { ...p, size: existing.size - size } : p);
        } else if (existing.size === size) {
          // Full close
          return prev.filter(p => p.symbol !== symbol);
        } else {
          // Flip
          const remainingSize = size - existing.size;
          return prev.map(p => p.symbol === symbol ? {
            ...p,
            side: side === 'BUY' ? 'LONG' : 'SHORT',
            size: remainingSize,
            entryPrice: currentPrice
          } : p);
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">Price Action Playground</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setSymbol('ES')}
              className={clsx(
                "px-4 py-1 rounded-md text-sm font-medium transition-all",
                symbol === 'ES' ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
              )}
            >
              ES (S&P 500)
            </button>
            <button
              onClick={() => setSymbol('XAU')}
              className={clsx(
                "px-4 py-1 rounded-md text-sm font-medium transition-all",
                symbol === 'XAU' ? "bg-yellow-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
              )}
            >
              XAU/USD (Gold)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-row p-4 gap-4 overflow-hidden">
        {/* Drawing Toolbar */}
        <DrawingToolbar 
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onClearAll={() => chartRef.current?.clearOverlays()}
        />

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Top Section: Chart + OrderForm */}
          <div className="flex-1 flex flex-row gap-4 min-h-0">
             {/* Chart Area */}
            <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden relative flex flex-col">
              <div className="flex-1 relative">
                <ChartComponent 
                  ref={chartRef}
                  data={visibleData} 
                  activeTool={activeTool}
                  onToolCompleted={() => setActiveTool('cursor')}
                />
                <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded-md text-xs font-mono text-zinc-400 pointer-events-none">
                  <span className="font-bold text-zinc-200">{symbol}</span> <span className="mx-1">·</span> 5m
                </div>
              </div>
              
              {/* Control Panel integrated below chart but inside the chart box? Or keep separate? */}
              {/* Let's keep it separate below the chart box for now, or integrated at bottom of chart box */}
            </div>

            {/* Order Form */}
            <div className="w-[300px] flex-shrink-0 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
              <OrderForm 
                currentPrice={currentPrice}
                onPlaceOrder={handlePlaceOrder}
                symbol={symbol}
              />
            </div>
          </div>

          {/* Bottom Section: ControlPanel + OrderList */}
          <div className="flex-shrink-0 flex flex-col gap-4 h-[300px]">
             <ControlPanel
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNextBar={handleNextBar}
                onReset={() => {
                  setIsPlaying(false);
                  setCurrentIndex(100);
                  chartRef.current?.clearOverlays();
                  setPositions([]); // Optional: clear positions on reset
                  setOrders([]);
                }}
                currentBarIndex={currentIndex}
                totalBars={data.length}
              />
              
              <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
                <OrderList 
                  positions={positions}
                  orders={orders}
                  currentPrice={currentPrice}
                />
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};
