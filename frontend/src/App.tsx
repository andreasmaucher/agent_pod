import React, { useEffect, useRef, useState } from "react";
import { AudioButton } from "./components/AudioButton";
import { WalletButton } from "./components/WalletButton";
import { Balance } from "./components/Balance";
import {
  AiConversationService,
  AIResponse,
} from "./utils/aiConversationService";
import { API_URL } from "./constants";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState<number>(0);
  const [conversationStatus, setConversationStatus] = useState<{
    currentRound: number;
    totalRounds: number;
  }>({ currentRound: 0, totalRounds: 20 });

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const aiService = useRef(new AiConversationService());

  useEffect(() => {
    aiService.current.resetConversation();
  }, []);

  useEffect(() => {
    if (responses.length > 0 && currentResponseIndex < responses.length) {
      const response = responses[currentResponseIndex];
      playResponse(response);
    }
  }, [currentResponseIndex, responses]);

  const playResponse = async (response: AIResponse) => {
    try {
      const audioUrl = `${API_URL}/${response.audioFile}`;
      audioRef.current.src = audioUrl;
      
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentResponseIndex(prev => prev + 1);
      };

      await audioRef.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setCurrentResponseIndex(prev => prev + 1);
    }
  };

  const handleAiResponse = (newResponses: AIResponse[]) => {
    setResponses(prev => [...prev, ...newResponses]);
    setConversationStatus(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
    }));
  };

  const handleResetConversation = async () => {
    const success = await aiService.current.resetConversation();
    if (success) {
      setTranscription("");
      setResponses([]);
      setCurrentResponseIndex(0);
      setConversationStatus(prev => ({
        ...prev,
        currentRound: 0,
      }));
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getSpeakerStyle = (speaker: "interviewer" | "guest", index: number) => ({
    opacity: index === currentResponseIndex ? "100" : "50",
    color: speaker === "interviewer" ? "#60A5FA" : "#F87171"
  });

  const getSpeakerName = (speaker: "interviewer" | "guest") => 
    speaker === "interviewer" ? "Joe Rogan" : "Trump Supporter";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="absolute top-6 right-6">
        <WalletButton />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Balance />

        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-zinc-200">
            Round {conversationStatus.currentRound} of{" "}
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
            <div key={index} style={getSpeakerStyle(response.speaker, index)}>
              <p className="text-sm font-medium">
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
          onAiResponse={handleAiResponse}
          onTranscription={setTranscription}
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
