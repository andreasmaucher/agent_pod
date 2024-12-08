import React, { useState, useRef, useCallback } from "react";
import { AiConversationService } from "../utils/aiConversationService";
import { AudioRecorder } from '../utils/audioRecorder';

interface AudioButtonProps {
  isPlaying: boolean;
  onAiResponse: (responses: any[]) => void;
  onTranscription: (text: string) => void;
}

export function AudioButton({
  isPlaying,
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
        result.transcription && onTranscription(result.transcription);
        result.responses && onAiResponse(result.responses);
      }
    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setIsProcessing(false);
      audioRecorder.current.cleanup();
    }
  }, [isRecording, onAiResponse, onTranscription]);

  const buttonStyle = isProcessing ? "bg-yellow-500" : 
                     isPlaying ? "bg-green-500" : 
                     isRecording ? "bg-red-500 scale-110" : 
                     "bg-blue-500 hover:bg-blue-600";

  const buttonText = isProcessing ? "Processing..." : 
                    isPlaying ? "Playing..." : 
                    isRecording ? "Recording..." : 
                    "Hold to Record";

  return (
    <button
      className={`w-32 h-32 rounded-full ${buttonStyle} text-white font-bold 
        transition-all duration-200 transform 
        flex items-center justify-center text-center px-4
        disabled:opacity-50 disabled:cursor-not-allowed
        select-none cursor-pointer active:scale-95`}
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onMouseLeave={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      disabled={isPlaying || isProcessing}
    >
      <span className="pointer-events-none">{buttonText}</span>
    </button>
  );
}
