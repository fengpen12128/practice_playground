'use client';

import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextBar: () => void;
  onReset: () => void;
  currentBarIndex: number;
  totalBars: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  onNextBar,
  onReset,
  currentBarIndex,
  totalBars,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900 text-zinc-100 rounded-xl border border-zinc-800 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-100"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={onNextBar}
          disabled={isPlaying || currentBarIndex >= totalBars - 1}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-zinc-100"
          title="Next Bar"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="text-sm text-zinc-500 font-mono">
        Bar: <span className="text-zinc-300">{currentBarIndex + 1}</span> / {totalBars}
      </div>
    </div>
  );
};

