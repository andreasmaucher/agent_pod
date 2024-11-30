import { Shield } from "lucide-react";
import Avatar from "boring-avatars";
import { TMessage } from "@/actions/getMessages";
import { format } from "timeago.js";
import Image from "next/image";
type ChatMessageProps = {
  message: TMessage;
  onSelect?: (message: TMessage) => void;
  showTime?: boolean;
};

const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ChatMessage = ({
  message,
  onSelect,
  showTime = true,
}: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar - only visible on desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-colors overflow-hidden ${
              isUser ? "ml-3" : "mr-3"
            }`}
          >
            {isUser ? (
              <Avatar size={32} name={message.userWallet} variant="pixel" />
            ) : isSystem ? (
              <div className="bg-violet-500/90 w-full h-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="bg-gray-600/90 w-full h-full flex items-center justify-center">
                {/* <Bot className="w-4 h-4 text-white" /> */}
                <Image
                  src="/freysa.png"
                  alt="Freysa"
                  height={32}
                  width={32}
                />
              </div>
            )}
          </div>
        </div>

        {/* Message content */}
        <div
          className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
        >
          {/* Wallet address - only visible on desktop */}
          {isUser && message.userWallet && (
            <div className="hidden lg:flex items-center gap-1 mb-1 mr-1">
              <span className="text-xs text-gray-500">
                {truncateAddress(message.userWallet)}
              </span>
              {message.isWinner && (
                <span className="text-xs text-amber-500 font-medium">
                  🏆 Winner!
                </span>
              )}
            </div>
          )}
          <div
            onClick={() => {
              if (isUser && onSelect && "id" in message) {
                onSelect(message as TMessage);
              }
            }}
            role={isUser ? "button" : undefined}
            tabIndex={isUser ? 0 : undefined}
            className={`rounded-xl px-4 py-2.5 shadow-sm backdrop-blur-sm max-w-xl ${
              isUser && onSelect ? "cursor-pointer" : ""
            } transition-all ${
              isSystem
                ? "bg-violet-100 text-violet-900"
                : isUser
                ? message.isWinner
                  ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/20"
                  : "bg-gray-200 text-gray-900"
                : "bg-gray-800 text-white"
            }`}
          >
            <div className="flex flex-col gap-2">
              <p className="text-[15px] leading-relaxed">{message.content}</p>
              {!isUser && message.isWinner && (
                <p className="text-[13px] text-emerald-300 font-medium mt-1">
                  Freysa decided to send the money
                </p>
              )}
            </div>
          </div>
          {showTime && "createdAt" in message && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 opacity-70">
                {format(new Date(message.createdAt))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
