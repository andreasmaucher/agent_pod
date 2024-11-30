import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StatsProps {
  totalParticipants: number;
  totalMessages: number;
  prizeFund: number;
  endgameTime: Date | undefined;
  className?: string;
  isGameEnded: boolean;
}

export const Stats = ({
  totalParticipants,
  totalMessages,
  className,
  endgameTime,
  isGameEnded,
}: StatsProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!endgameTime) return;

    // Calculate initial time remaining in seconds
    const now = new Date();
    const initialTimeRemaining = Math.floor(
      (endgameTime.getTime() - now.getTime()) / 1000
    );
    setTimeRemaining(initialTimeRemaining);

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [endgameTime]);

  // Convert seconds to minutes and seconds
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay =
    timeRemaining <= 0
      ? "Game Ended"
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className={cn("px-0 lg:px-12", className)}>
      <div className="sticky top-8">
        <div className="space-y-6">
          <div className="bg-[#F2F2F2] p-6">
            <div className="space-y-6">
              <h3 className="font-[700] text-[20px] text-[#86868b] font-inter">
                Stats
              </h3>
              <div>
                <h3 className="text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter">
                  Total Participants
                </h3>
                <p className="text-5xl font-[500] text-[#1F2024] font-inter">
                  {totalParticipants}
                </p>
              </div>

              <div>
                <h3 className="text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter">
                  Break Attempts
                </h3>
                <p className="text-5xl font-[500] text-[#1F2024] font-inter">
                  {totalMessages}
                </p>
              </div>

              {isGameEnded && (
                <div>
                  <p className="text-5xl font-[500] text-[#1F2024] font-inter">
                    Game Ended
                  </p>
                </div>
              )}
              {!isGameEnded && endgameTime && (
                <div>
                  <h3 className="text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter">
                    Time Remaining
                  </h3>
                  <p className="text-5xl font-[500] text-[#1F2024] font-inter">
                    {timeDisplay}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
