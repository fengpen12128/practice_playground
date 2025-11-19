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
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white rounded-lg shadow-lg mt-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={onNextBar}
          disabled={isPlaying || currentBarIndex >= totalBars - 1}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Bar"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="text-sm text-gray-400">
        Bar: {currentBarIndex + 1} / {totalBars}
      </div>
    </div>
  );
};

