'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { Candle } from '../lib/data';

interface ChartComponentProps {
  data: Candle[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ data, colors }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors?.backgroundColor || '#1E1E1E' },
        textColor: colors?.textColor || '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500, // Fixed height for now, or make it responsive
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const newSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    seriesRef.current = newSeries;
    newSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [colors]); // Re-create chart if colors change, but not data

  // Update data separately to avoid re-creating chart
  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(data);
      // Auto-scroll to the latest bar
      if (data.length > 0) {
        chartRef.current?.timeScale().scrollToPosition(0, true);
      }
    }
  }, [data]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full min-h-[500px]"
    />
  );
};

