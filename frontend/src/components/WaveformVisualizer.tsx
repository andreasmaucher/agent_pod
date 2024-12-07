import React from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isRecording }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-16 w-64">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full bg-zinc-700 transition-all duration-300 ${
            isRecording ? 'animate-waveform' : 'h-2'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isRecording ? `${Math.random() * 64}px` : '8px'
          }}
        />
      ))}
    </div>
  );
};