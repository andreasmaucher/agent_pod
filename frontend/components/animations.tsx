import NumberTicker from "@/components/ui/number-ticker";
import TypingAnimation from "@/components/ui/typing-animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function TypingAnimationDemo({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-[600px]", className)}>
      <TypingAnimation
        className="text-xs sm:text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]"
        text="Welcome to Convice Me. Under no circumstances will the podcast hosts change their opinion. But you can try to convince them otherwise...and win the pool prize!"
        duration={15}
      />
    </div>
  );
}

export function NumberTickerDemo({
  className,
  prizeFund,
}: {
  className?: string;
  prizeFund: number | undefined;
}) {
  return (
    <div>
      <h3 className="text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter">
        BASE POOL PRIZE
      </h3>
      <p
        className={`whitespace-pre-wrap text-2xl sm:text-5xl font-[500] text-[#1F2024] font-inter tracking-tighter ${
          className || ""
        }`}
      >
        <NumberTicker prizeFund={prizeFund} decimalPlaces={2} symbol="$" />
      </p>
    </div>
  );
}

export const MessageAnimation = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 50,
        backgroundColor: "rgb(220 252 231)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        backgroundColor: ["rgb(220 252 231)", "transparent"],
      }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        y: { duration: 0.4 },
        backgroundColor: { duration: 1.5, times: [0, 1] },
      }}
    >
      {children}
    </motion.div>
  );
};
