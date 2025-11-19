'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { init, dispose, Chart, OverlayCreate } from 'klinecharts';
import { Candle } from '../lib/data';
import { DrawingTool } from './DrawingToolbar';

interface ChartComponentProps {
  data: Candle[];
  activeTool: DrawingTool;
  onToolCompleted?: () => void;
}

export interface ChartComponentRef {
  clearOverlays: () => void;
}

export const ChartComponent = forwardRef<ChartComponentRef, ChartComponentProps>(({ 
  data, 
  activeTool,
  onToolCompleted 
}, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = init(chartContainerRef.current);
    if (!chart) return;
    
    chartInstanceRef.current = chart;

    // Set Dark Theme
    chart.setStyles('dark');
    chart.setStyles({
      grid: {
        horizontal: { color: '#27272a' },
        vertical: { color: '#27272a' }
      },
      candle: {
        bar: {
          upColor: '#26a69a',
          downColor: '#ef5350',
          noChangeColor: '#888888'
        }
      }
    });

    return () => {
      dispose(chartContainerRef.current!);
    };
  }, []);

  // Update Data
  useEffect(() => {
    if (chartInstanceRef.current && data.length > 0) {
      // Cast data to any to bypass strict type check for now, or extend KLineData
      chartInstanceRef.current.applyNewData(data as any);
    }
  }, [data]);

  // Handle Drawing Tools
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    if (activeTool === 'cursor') {
      // Cancel drawing if switching to cursor, but klinecharts handles this by just not creating an overlay
      return;
    }

    // Map our tool names to klinecharts overlay names
    const overlayMapping: Record<string, string> = {
      'priceLine': 'horizontalRayLine', // or horizontalStraightLine
      'trendLine': 'segment', // klinecharts 'segment' is a line segment, 'straightLine' is infinite
      'rayLine': 'rayLine',
      'segment': 'segment',
      'rect': 'rect',
      'circle': 'circle',
      'text': 'simpleAnnotation',
      'fibonacciLine': 'fibonacciLine'
    };

    const overlayName = overlayMapping[activeTool];
    
    if (overlayName) {
      chartInstanceRef.current.createOverlay({
        name: overlayName,
        onDrawEnd: () => {
          if (onToolCompleted) onToolCompleted();
          return true; // Return true to indicate success/allow default behavior
        }
      });
    }

  }, [activeTool, onToolCompleted]);

  useImperativeHandle(ref, () => ({
    clearOverlays: () => {
      chartInstanceRef.current?.removeOverlay();
    }
  }));

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full min-h-[500px]"
    />
  );
});

ChartComponent.displayName = 'ChartComponent';
