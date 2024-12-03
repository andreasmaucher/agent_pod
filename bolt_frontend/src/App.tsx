import React, { useEffect, useRef, useState } from "react";
import { AudioButton } from "./components/AudioButton";
import { WalletButton } from "./components/WalletButton";
import { Balance } from "./components/Balance";
import {
  AiConversationService,
  AIResponse,
} from "./utils/aiConversationService";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState<number>(0);
  const [conversationStatus, setConversationStatus] = useState<{
    currentRound: number;
    totalRounds: number;
  }>({ currentRound: 0, totalRounds: 20 });

  const audioRef = useRef<HTMLAudioElement>(null);
  const aiServiceRef = useRef<AiConversationService>(
    new AiConversationService()
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("play", () => setIsPlaying(true));
      audioRef.current.addEventListener("pause", () => setIsPlaying(false));
      audioRef.current.addEventListener("ended", handleAudioEnded);
      audioRef.current.addEventListener("error", handleAudioError);
    }

    handleResetConversation();

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", () => setIsPlaying(true));
        audioRef.current.removeEventListener("pause", () =>
          setIsPlaying(false)
        );
        audioRef.current.removeEventListener("ended", handleAudioEnded);
        audioRef.current.removeEventListener("error", handleAudioError);
      }
    };
  }, []);

  useEffect(() => {
    if (responses.length > 0 && currentResponseIndex < responses.length) {
      const response = responses[currentResponseIndex];
      playResponse(response);
    }
  }, [currentResponseIndex, responses]);

  const handleResetConversation = async () => {
    const success = await aiServiceRef.current.resetConversation();
    if (success) {
      const status = await aiServiceRef.current.getConversationStatus();
      setConversationStatus({
        currentRound: status.currentRound,
        totalRounds: status.totalRounds,
      });
      setTranscription("");
      setResponses([]);
      setCurrentResponseIndex(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleAiResponse = (newResponses: AIResponse[]) => {
    setResponses((prev) => [...prev, ...newResponses]); // Append responses in sequence
    setCurrentResponseIndex(0); // Reset to the first response
  };

  const playResponse = async (response: AIResponse) => {
    if (!audioRef.current) {
      console.log("No audio element found for response");
      return;
    }
    console.log("Playing response:", response);

    try {
      if (responses[currentResponseIndex] !== response) return;

      const audioUrl = `http://localhost:3001/${response.audioFile}`;
      const testAudio = new Audio(audioUrl);

      await new Promise((resolve, reject) => {
        testAudio.addEventListener("loadeddata", resolve);
        testAudio.addEventListener("error", reject);
      });

      audioRef.current.src = audioUrl;
      await audioRef.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      moveToNextResponse();
    }
  };

  const handleTranscription = (text: string) => {
    setTranscription(text);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    moveToNextResponse();
    if (currentResponseIndex < responses.length - 1) {
      setCurrentResponseIndex((prev) => prev + 1);
    }
  };

  const handleAudioError = () => {
    console.error("Audio playback error occurred");
    moveToNextResponse();
  };

  const moveToNextResponse = () => {
    if (currentResponseIndex < responses.length - 1) {
      setCurrentResponseIndex((prev) => prev + 1);
    }
  };

  const getSpeakerColor = (speaker: "interviewer" | "guest") => {
    return speaker === "interviewer" ? "text-blue-400" : "text-red-400";
  };

  const getSpeakerName = (speaker: "interviewer" | "guest") => {
    return speaker === "interviewer" ? "Joe Rogan" : "Trump Supporter";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <audio ref={audioRef} className="hidden" />

      <div className="absolute top-6 right-6">
        <WalletButton />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Balance />

        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-zinc-200">
            Round {conversationStatus.currentRound + 1} of{" "}
            {conversationStatus.totalRounds}
          </p>

          {transcription && (
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-400">Your message:</p>
              <p className="text-sm text-zinc-400 max-w-md">
                "{transcription}"
              </p>
            </div>
          )}

          {responses.map((response, index) => (
            <div
              key={index}
              className={`mt-4 ${
                index === currentResponseIndex ? "opacity-100" : "opacity-50"
              }`}
            >
              <p
                className={`text-sm font-medium ${getSpeakerColor(
                  response.speaker
                )}`}
              >
                {getSpeakerName(response.speaker)}:
              </p>
              <p className="text-sm text-zinc-400 max-w-md">
                "{response.text}"
              </p>
            </div>
          ))}
        </div>

        <AudioButton
          isPlaying={isPlaying}
          audioElement={audioRef.current ?? undefined}
          onAiResponse={handleAiResponse}
          onTranscription={handleTranscription}
        />

        <p className="mt-8 text-sm font-medium text-zinc-400">
          Hold to record (max 2 mins)
        </p>

        <button
          className="mt-4 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          onClick={handleResetConversation}
        >
          Reset Conversation
        </button>
      </div>
    </div>
  );
}

export default App;
