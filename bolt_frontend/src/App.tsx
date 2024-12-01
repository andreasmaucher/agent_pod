import React, { useEffect, useRef, useState } from 'react';
import { AudioButton } from './components/AudioButton';
import { WalletButton } from './components/WalletButton';
import { Balance } from './components/Balance';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      {/* Audio element for podcast playback */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Wallet button */}
      <div className="absolute top-6 right-6">
        <WalletButton />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Balance />
        
        <AudioButton 
          isPlaying={isPlaying}
          audioElement={audioRef.current ?? undefined}
        />

        <p className="mt-8 text-sm font-medium text-zinc-400">
          Hold to record (max 2 mins)
        </p>
      </div>
    </div>
  );
}

export default App;