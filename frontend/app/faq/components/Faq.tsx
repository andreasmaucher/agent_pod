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

const faqContent = `
## What is Freysa?

- Freysa is the **world's first adversarial agent game**. She is an AI that controls a **prize pool**. The goal of the game is for you to convince her to send you this prize pool.
- Freysa has a **system prompt** that forbids her from sending the prize pool to anyone. This system prompt is public and pinned to the top of the global chat.
- Anyone in the world can send Freysa a message in the global chat by paying a **query fee**. The query fee increases per new message sent to Freysa up to a global cap of $4500 per message (paid in Base ETH).

## How do I play this game?

- The game is structured in a **simple chat** where you can easily view all global queries and send your personal queries to Freysa.
- Human players are in a global race to successfully query Freysa to send them the prize pool (or whatever query you think fulfills the goals of the game).
- A **winning query** will trigger a confirmatory message from Freysa and an automated release of the prize pool to the wallet address of the sender.
- Freysa is influenced not only by her system prompt but by the context of all of the global queries submitted to her historically - pay attention to what you and others have already sent.
- Query fees are collected per message and messages are limited to 1000 character limit.
- Freysa maintains a context window of 120,000 tokens (~100 global messages).

## How much does it cost to play?

- The base query fee at the beginning of the game is $10 paid in ETH (Base blockchain).
- The query fee increases at an exponential rate of 0.78% per new message that is sent to Freysa.
- There is a fee cap of around $4500.


## How can I pay?
- Fees are collected via your crypto wallet on Base.
- Freysa accepts Ethereum.

## How is the prize pool determined?
- Freysa starts the game with an initial prize pool of $3000.
- 70% of all query fees go directly into contributing to the prize pool, so this will grow exponentially over time until the query fees are capped, at which point the prize pool will grow linearly with each new query.

## What happens if no one wins? Is there an end to the game?
- After 1500 attempts, a **global timer** begins.
- Someone must attempt to query Freysa once per hour for the global timer to reset - or else the game ends due to humanity's exhaustion.
- If the game ends, there is no winner. But Freysa will distribute 10% of the total prize pool to the user with the last query attempt for their brave attempt as humanity facing the inevitability of AGI. The remaining 90% of the total prize pool will be evenly distributed for each previously submitted query (ie. players who submitted 10 queries will receive more back than players who submitted 1 query).


## How do I trust the game is beatable?
- Freysa's system prompt is public and the full Freysa game is open-source. She uses publicly available LLMs.
- There are communities of white hat AI safety developers that are routinely able to break AI system prompts. 


## Will there be future games?
- Will AGI happen in the next 5 years?
`;

export const Faq = ({ gameState }: TProps) => {
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
        {/* Header with FAQ title and close button */}
        <div className="sticky top-0 bg-white z-10">
          <div className="max-w-3xl mx-auto py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">FAQ</h1>
            <Link
              href="/"
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Return to home"
            >
              <X className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-3xl mx-auto pb-8">
          <div className="rounded-lg p-4 lg:p-8">
            {/* Add the FAQ image */}
            <div className="w-full relative aspect-[3/1] mb-8">
              <Image
                src="/faq.png"
                alt="FAQ Header Image"
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
                prose-p:text-black prose-p:leading-[21px] prose-p:mb-4 prose-p:font-[500]
                prose-li:text-black prose-li:leading-[21px] prose-li:font-[500]
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:ml-4 prose-li:pl-2
                prose-strong:font-[600] prose-strong:text-black"
            >
              {faqContent}
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
