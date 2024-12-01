import React, { useEffect, useRef, useState } from 'react';
import { AudioRecorder } from '../utils/audioRecorder';
import { AudioPlaybackAnalyzer } from '../utils/audioPlaybackAnalyzer';

interface AudioButtonProps {
  isPlaying: boolean;
  audioElement?: HTMLAudioElement;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ isPlaying, audioElement }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const playbackAnalyzerRef = useRef<AudioPlaybackAnalyzer>(new AudioPlaybackAnalyzer());
  const animationFrameRef = useRef<number>();
  const recordingStartTimeRef = useRef<number>(0);
  const MAX_RECORDING_DURATION = 120000; // 2 minutes in milliseconds

  useEffect(() => {
    if (audioElement) {
      playbackAnalyzerRef.current.initialize(audioElement);
    }
    return () => {
      playbackAnalyzerRef.current.cleanup();
      recorderRef.current.cleanup();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement]);

  const updateAmplitude = () => {
    if (isRecording) {
      const currentTime = Date.now();
      if (currentTime - recordingStartTimeRef.current >= MAX_RECORDING_DURATION) {
        handleRecordingStop();
        return;
      }
      
      const value = recorderRef.current.getAudioData();
      setAmplitude(value);
    } else if (isPlaying && audioElement) {
      const value = playbackAnalyzerRef.current.getAudioData();
      setAmplitude(value);
    }
    animationFrameRef.current = requestAnimationFrame(updateAmplitude);
  };

  const handleRecordingStart = async () => {
    try {
      await recorderRef.current.initialize();
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
      updateAmplitude();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleRecordingStop = async () => {
    setIsRecording(false);
    const audioBlob = await recorderRef.current.stop();
    // Here you would typically send the audioBlob to your backend
    console.log('Recording stopped, blob size:', audioBlob.size);
  };

  return (
    <div className="relative">
      {/* Ripple effect */}
      <div className="absolute inset-0 -z-10">
        {(isRecording || isPlaying) && [...Array(2)].map((_, i) => (
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

      {/* Main button */}
      <div
        className={`relative w-24 h-24 rounded-full transition-all duration-150 cursor-pointer ${
          isRecording
            ? 'bg-zinc-50'
            : isPlaying
            ? 'bg-zinc-100 scale-105'
            : 'bg-zinc-100 hover:bg-white hover:scale-105'
        }`}
        style={{
          boxShadow: (isRecording || isPlaying)
            ? `0 0 ${30 + amplitude * 20}px ${amplitude * 10}px rgba(255,255,255,0.1)`
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: `scale(${isPlaying ? 1 + amplitude * 0.2 : 1})`,
        }}
        onMouseDown={handleRecordingStart}
        onMouseUp={handleRecordingStop}
        onMouseLeave={handleRecordingStop}
        onTouchStart={handleRecordingStart}
        onTouchEnd={handleRecordingStop}
      >
        {/* Inner circle */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full transition-all duration-150
            ${isRecording || isPlaying ? 'scale-75' : 'scale-100'}`}
          style={{
            background: `radial-gradient(circle, rgba(0,0,0,${isRecording || isPlaying ? 0.1 : 0.05}) 0%, transparent 70%)`,
          }}
        />

        {/* Audio visualization */}
        {(isRecording || isPlaying) && (
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