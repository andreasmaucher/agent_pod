import React, { useState, useRef, useCallback } from "react";
import { AiConversationService } from "../utils/aiConversationService";
import { AudioRecorder } from '../utils/audioRecorder';

interface AudioButtonProps {
  isPlaying: boolean;
  audioElement?: HTMLAudioElement;
  onAiResponse: (responses: any[]) => void;
  onTranscription: (text: string) => void;
}

export function AudioButton({
  isPlaying,
  audioElement,
  onAiResponse,
  onTranscription,
}: AudioButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRecorder = useRef<AudioRecorder>(new AudioRecorder());
  const aiService = useRef(new AiConversationService()).current;

  const startRecording = useCallback(async () => {
    if (isPlaying || isProcessing || isRecording) return;

    try {
      await audioRecorder.current.initialize();
      audioRecorder.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  }, [isPlaying, isProcessing, isRecording]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
      const audioBlob = await audioRecorder.current.stopRecording();
      const result = await aiService.processAudioRecording(audioBlob);

      if (result.success) {
        if (result.transcription) {
          onTranscription(result.transcription);
        }
        if (result.responses) {
          onAiResponse(result.responses);
        }
      }
    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setIsProcessing(false);
      audioRecorder.current.cleanup();
    }
  }, [isRecording, onAiResponse, onTranscription]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startRecording();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    stopRecording();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startRecording();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stopRecording();
  };

  const getButtonStyle = () => {
    if (isProcessing) return "bg-yellow-500";
    if (isPlaying) return "bg-green-500";
    if (isRecording) return "bg-red-500 scale-110";
    return "bg-blue-500 hover:bg-blue-600";
  };

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (isPlaying) return "Playing...";
    if (isRecording) return "Recording...";
    return "Hold to Record";
  };

  return (
    <button
      className={`w-32 h-32 rounded-full ${getButtonStyle()} text-white font-bold 
        transition-all duration-200 transform 
        flex items-center justify-center text-center px-4
        disabled:opacity-50 disabled:cursor-not-allowed
        select-none cursor-pointer active:scale-95`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      disabled={isPlaying || isProcessing}
    >
      <span className="pointer-events-none">{getButtonText()}</span>
    </button>
  );
}
