import React, { useState, useRef, useCallback } from "react";
import { AiConversationService } from "../utils/aiConversationService";

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
  const aiService = useRef(new AiConversationService()).current;

  const startRecording = useCallback(async () => {
    if (isPlaying || isProcessing || isRecording) return;

    console.log("Starting recording...");
    setIsRecording(true);

    try {
      const success = await aiService.startRecording();
      if (!success) {
        console.error("Failed to start recording");
        setIsRecording(false);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  }, [isPlaying, isProcessing, isRecording]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    console.log("Stopping recording...");
    setIsRecording(false);
    setIsProcessing(true);

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Processing timeout")), 10000)
      );

      const result = await Promise.race([
        aiService.stopRecording(),
        timeoutPromise,
      ]);

      if (result.success) {
        if (result.transcription) {
          onTranscription(result.transcription);
        }
        if (result.responses) {
          onAiResponse(result.responses);
        }
      } else {
        console.error("Failed to process recording");
      }
    } catch (error) {
      console.error("Error processing recording:", error);
    } finally {
      setIsProcessing(false);
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
