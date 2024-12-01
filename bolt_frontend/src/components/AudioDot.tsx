import React, { useEffect, useRef } from 'react';

interface AudioDotProps {
  isRecording: boolean;
  amplitude: number;
}

export const AudioDot: React.FC<AudioDotProps> = ({ isRecording, amplitude }) => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dotRef.current && isRecording) {
      const scale = 1 + amplitude * 0.3;
      dotRef.current.style.transform = `scale(${scale})`;
    } else if (dotRef.current) {
      dotRef.current.style.transform = 'scale(1)';
    }
  }, [amplitude, isRecording]);

  return (
    <div className="relative">
      {/* Ripple effect */}
      <div className="absolute inset-0 -z-10">
        {isRecording && [...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full animate-ripple opacity-5"
            style={{
              animationDelay: `${i * 500}ms`,
              background: 'radial-gradient(circle, rgb(255, 255, 255) 0%, transparent 70%)',
            }}
          />
        ))}
      </div>

      {/* Main dot */}
      <div
        ref={dotRef}
        className={`relative w-24 h-24 rounded-full transition-all duration-150 cursor-pointer ${
          isRecording
            ? 'bg-zinc-50'
            : 'bg-zinc-100 hover:bg-white hover:scale-105'
        }`}
        style={{
          boxShadow: isRecording
            ? `0 0 ${30 + amplitude * 20}px ${amplitude * 10}px rgba(255,255,255,0.1)`
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Inner circle */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full transition-all duration-150
            ${isRecording ? 'scale-75' : 'scale-100'}`}
          style={{
            background: `radial-gradient(circle, rgba(0,0,0,${isRecording ? 0.1 : 0.05}) 0%, transparent 70%)`,
          }}
        />

        {/* Audio wave indicator */}
        {isRecording && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, rgba(0,0,0,${0.05 + amplitude * 0.1}) 0%, transparent ${amplitude * 360}deg)`,
            }}
          />
        )}
      </div>
    </div>
  );
};