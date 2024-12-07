import React, { useState } from 'react';
import { Mic } from 'lucide-react';

interface RecordButtonProps {
  onRecordingStart: () => void;
  onRecordingStop: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ onRecordingStart, onRecordingStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  
  const handleMouseDown = () => {
    setIsRecording(true);
    onRecordingStart();
  };
  
  const handleMouseUp = () => {
    setIsRecording(false);
    onRecordingStop();
  };
  
  return (
    <button
      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
        isRecording 
          ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50' 
          : 'bg-zinc-800 hover:bg-zinc-700'
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Mic 
        className={`w-10 h-10 transition-colors ${
          isRecording ? 'text-white' : 'text-zinc-100'
        }`}
      />
    </button>
  );
};