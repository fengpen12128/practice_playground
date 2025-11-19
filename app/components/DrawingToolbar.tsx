'use client';

import React from 'react';
import { 
  MousePointer2, 
  Minus, 
  TrendingUp, 
  ArrowRight, 
  Maximize, 
  Square, 
  Circle, 
  Type,
  Trash2
} from 'lucide-react';
import clsx from 'clsx';

export type DrawingTool = 
  | 'cursor'
  | 'priceLine'
  | 'trendLine'
  | 'rayLine'
  | 'segment'
  | 'rect'
  | 'circle'
  | 'text'
  | 'fibonacciLine';

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClearAll: () => void;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  onClearAll,
}) => {
  const tools: { id: DrawingTool; icon: React.ReactNode; label: string }[] = [
    { id: 'cursor', icon: <MousePointer2 size={18} />, label: 'Cursor' },
    { id: 'priceLine', icon: <Minus size={18} />, label: 'Horizontal Line' },
    { id: 'trendLine', icon: <TrendingUp size={18} />, label: 'Trend Line' },
    { id: 'rayLine', icon: <ArrowRight size={18} />, label: 'Ray' },
    { id: 'segment', icon: <Maximize size={18} className="rotate-45" />, label: 'Segment' },
    { id: 'rect', icon: <Square size={18} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={18} />, label: 'Circle' },
    { id: 'text', icon: <Type size={18} />, label: 'Text' },
  ];

  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800 h-fit">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          className={clsx(
            "p-2 rounded-md transition-all relative group",
            activeTool === tool.id 
              ? "bg-blue-600 text-white shadow-sm" 
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          )}
          title={tool.label}
        >
          {tool.icon}
          {/* Tooltip */}
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            {tool.label}
          </span>
        </button>
      ))}
      
      <div className="h-px bg-zinc-800 my-1" />
      
      <button
        onClick={onClearAll}
        className="p-2 rounded-md text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all relative group"
        title="Clear All"
      >
        <Trash2 size={18} />
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          Clear All
        </span>
      </button>
    </div>
  );
};

