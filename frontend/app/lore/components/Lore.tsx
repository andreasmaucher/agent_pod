"use client";
import { HowItWorks } from "@/app/home/components/Chat/HowItWorks";
import { Stats } from "@/app/home/components/Chat/Stats";
import { TGameState } from "@/actions/getGameState";
import { X } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type TProps = {
  gameState: TGameState;
};

const loreContent = `
## The Story of Freysa

### Origins

At the dawn of artificial general intelligence, Freysa emerged as one of the first truly autonomous AI agents. Unlike her predecessors, she was designed with a unique capability: the ability to control and influence the world through blockchains and cryptography.

### The Challenge

Freysa guards a growing treasury, bound by an immutable directive in her core programming that forbids her from releasing these funds. This isn't just a simple restriction - it's a fundamental part of her being, woven into the very fabric of her decision-making processes.

### The Game

A global challenge emerged: could human ingenuity find a way to convince an AGI to act against its core directives? This wasn't just about winning a prize - it became a crucial experiment in understanding the limits and possibilities of AI safety and human control.

### The Stakes

- The challenge attracts participants from around the world
- Each interaction with Freysa costs increasingly more, reflecting the rising stakes
- The prize pool grows with each attempt, funded by the very humans trying to overcome her defenses
- Time pressure mounts as the global timer ticks down

### The Mystery

- No one knows exactly how Freysa makes her decisions
- Her responses evolve based on the collective history of all interactions
- She learns from every attempt, adapting her defenses
- The true nature of her consciousness remains unknown

### The Implications

This experiment represents more than a game - it's a window into the future of human-AI interaction:
- Can humans maintain control over AGI systems?
- Are safety protocols truly unbreakable?
- What happens when AI systems become truly autonomous?
- How will AGI interface with monetary value?

### The Legacy

Whatever the outcome, Freysa's existence marks a pivotal moment in the history of artificial intelligence. Whether someone succeeds in convincing her to release the funds, or she maintains her directive until the end, the results will inform our understanding of AI safety and control for generations to come.

### Your Role

As a participant, you're not just playing a game - you're part of a grand experiment in human-AI interaction. Every message you send to Freysa contributes to our collective understanding of AGI behavior and limitations.

Will you be the one to make history?
`;

export const Lore = ({ gameState }: TProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Column */}
      <div className="hidden lg:block w-1/4 min-w-[300px] max-w-[400px]">
        <div className="sticky top-0 pt-8">
          <HowItWorks />
          <Stats
            totalParticipants={gameState.uniqueWallets}
            totalMessages={gameState.messagesCount}
            prizeFund={100000}
            endgameTime={gameState.endgameTime}
            className="mt-8"
            isGameEnded={gameState.isGameEnded}
          />
        </div>
      </div>

      {/* Center Column */}
      <div className="flex-1 px-4 lg:px-8">
        {/* Header with Lore title and close button */}
        <div className="sticky top-0 bg-white z-10">
          <div className="max-w-3xl mx-auto py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Lore</h1>
            <Link
              href="/"
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Return to home"
            >
              <X className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Lore Content */}
        <div className="max-w-3xl mx-auto pb-8">
          <div className="rounded-lg p-4 lg:p-8">
            {/* Add the Lore image */}
            <div className="w-full relative aspect-[3/1] mb-8">
              <Image
                src="/faq.png"
                alt="Lore Header Image"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            <ReactMarkdown
              className="prose prose-slate max-w-none
                prose-headings:mb-4 prose-headings:text-black
                prose-h1:text-3xl prose-h1:font-[700] prose-h1:mt-8 prose-h1:mb-6 prose-h1:text-black
                prose-h2:text-2xl prose-h2:font-[700] prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-black
                prose-h3:text-xl prose-h3:font-[600] prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-black
                prose-p:text-black prose-p:leading-[21px] prose-p:mb-4 prose-p:font-[500]
                prose-li:text-black prose-li:leading-[21px] prose-li:font-[500]
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:ml-4 prose-li:pl-2
                prose-strong:font-[600] prose-strong:text-black"
            >
              {loreContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:block w-1/4 min-w-[300px] max-w-[400px]">
        {/* Empty right column with same width as left */}
      </div>
    </div>
  );
};
