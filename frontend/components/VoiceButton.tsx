import { Mic, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

type TProps = {
  onRecordingComplete: (audioBlob: Blob) => void;
  status: "idle" | "pending" | "error";
};

export const VoiceButton = ({ onRecordingComplete, status }: TProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onMouseLeave={stopRecording}
      disabled={status === "pending"}
      className={`
        relative
        overflow-hidden
        bg-stone-800
        text-white
        text-sm
        transition-all
        duration-500
        ease-in-out
        transform
        hover:bg-stone-900
        focus:outline-none
        focus:ring-2
        focus:ring-stone-600
        focus:ring-offset-2
        disabled:opacity-70
        h-14
        w-14
        rounded-full
        flex
        items-center
        justify-center
        ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
      `}
    >
      {status === "pending" ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <Mic className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`} />
      )}
    </button>
  );
};