'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChartComponent } from './ChartComponent';
import { ControlPanel } from './ControlPanel';
import { MOCK_ES_DATA, MOCK_XAU_DATA, Candle } from '../lib/data';
import clsx from 'clsx';

type Symbol = 'ES' | 'XAU';

export const Playground: React.FC = () => {
  const [symbol, setSymbol] = useState<Symbol>('ES');
  const [data, setData] = useState<Candle[]>(MOCK_ES_DATA);
  const [currentIndex, setCurrentIndex] = useState<number>(100); // Start with some history
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per bar

  useEffect(() => {
    if (symbol === 'ES') {
      setData(MOCK_ES_DATA);
    } else {
      setData(MOCK_XAU_DATA);
    }
    setCurrentIndex(100);
    setIsPlaying(false);
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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold">Price Action Playground</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSymbol('ES')}
              className={clsx(
                "px-4 py-1 rounded-md text-sm font-medium transition-colors",
                symbol === 'ES' ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              )}
            >
              ES (S&P 500)
            </button>
            <button
              onClick={() => setSymbol('XAU')}
              className={clsx(
                "px-4 py-1 rounded-md text-sm font-medium transition-colors",
                symbol === 'XAU' ? "bg-yellow-600 text-white" : "text-gray-400 hover:text-white"
              )}
            >
              XAU/USD (Gold)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <div className="flex-1 bg-gray-800 rounded-lg shadow-inner overflow-hidden relative">
          <ChartComponent data={visibleData} />
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-sm font-mono">
            {symbol} - 5m
          </div>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onNextBar={handleNextBar}
          onReset={() => {
            setIsPlaying(false);
            setCurrentIndex(100);
          }}
          currentBarIndex={currentIndex}
          totalBars={data.length}
        />
      </main>
    </div>
  );
};

