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

const termsContent = `
### 1. Acceptance of Terms

By accessing and participating in the Freysa game, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use or participate in the game.

### 2. Game Participation

- You must be of legal age in your jurisdiction to participate
- You must have a compatible crypto wallet on the Base network
- You are responsible for all fees and transactions associated with your participation
- Message content must not violate any laws or contain harmful content

### 3. Payment and Fees

- All query fees are non-refundable
- Fees must be paid in ETH on the Base network
- Query fees increase at a rate of 0.78% per message
- Maximum fee cap is approximately $4500 per message

### 4. Prize Pool

- The initial prize pool starts at $3000
- 70% of all query fees contribute to the prize pool
- Prize distribution in case of no winner:
  - 10% to the last participant
  - 90% distributed proportionally among all participants based on number of queries

### 5. Game Rules

- Messages are limited to 1000 characters
- Context window is limited to 120,000 tokens
- After 1500 attempts, the global timer mechanism activates
- During global timer, one query per hour is required to keep the game active

### 6. Disclaimers

- The game operates on blockchain technology and is subject to network conditions
- We are not responsible for:
  - Wallet connection issues
  - Network delays or failures
  - Lost or failed transactions
  - External wallet or blockchain-related issues

### 7. Intellectual Property

- All game content, including Freysa's responses, are protected by intellectual property rights
- Users retain rights to their individual queries
- Public queries may be viewed by all participants

### 8. Modifications

- We reserve the right to modify these terms at any time
- Continued participation after changes constitutes acceptance of modified terms
- Major changes will be announced through our official channels

### 9. Termination

- We reserve the right to terminate access for violations of these terms
- Game may end according to specified conditions in the rules
- Force majeure events may affect game operation

### 10. Governing Law

- These terms are governed by applicable laws
- Any disputes will be resolved in the appropriate jurisdiction
- Smart contract code is public and governs technical operations

### 11. Contact

For questions about these terms, please contact our team through official channels.
`;

export const Terms = ({ gameState }: TProps) => {
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
        {/* Header with Terms title and close button */}
        <div className="sticky top-0 bg-white z-10">
          <div className="max-w-3xl mx-auto py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Terms & Conditions</h1>
            <Link
              href="/"
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Return to home"
            >
              <X className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Terms Content */}
        <div className="max-w-3xl mx-auto pb-8">
          <div className="rounded-lg p-4 lg:p-8">
            {/* Add the Terms image */}
            <div className="w-full relative aspect-[3/1] mb-8">
              <Image
                src="/faq.png"
                alt="Terms Header Image"
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
              {termsContent}
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
