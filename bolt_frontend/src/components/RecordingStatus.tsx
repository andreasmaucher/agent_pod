import React from 'react';

interface RecordingStatusProps {
  isRecording: boolean;
}

export const RecordingStatus: React.FC<RecordingStatusProps> = ({ isRecording }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'
      }`} />
      <span className="text-zinc-400 text-sm">
        {isRecording ? 'Recording...' : 'Hold to record'}
      </span>
    </div>
  );
};