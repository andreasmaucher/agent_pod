import React, { useState, useEffect, useRef } from "react";
import { Mic, Loader2 } from "lucide-react";

import { TMessage } from "@/actions/getMessages";
import { verifyAndExecuteLLMPublic, submitPrompt } from "@/actions";
import { useAccount } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "@/app/wagmi";
import { ChatMessage } from "./ChatMessage";
import { MessageAnimation } from "@/components/animations";
import { ConversationModal } from "./ConversationModal";
import { createPortal } from "react-dom";
import { AvaPayment__factory } from "@/typechain-types/factories/AvaPayment__factory";
import { Switch } from "@headlessui/react";
import { getSessionWithPrice } from "@/actions/getSessionWithPrice";
import { sha256 } from "viem";

type TProps = {
  messages: TMessage[];
  className?: string;
  queryNewMessages: () => Promise<void>;
  showOnlyUserMessages: boolean;
  setShowOnlyUserMessages: (showOnlyUserMessages: boolean) => void;
  isGameEnded: boolean;
};

type TransactionStatus = "idle" | "pending" | "error";

type ConversationModalProps = {
  txHash: string;
  onClose: () => void;
};

const BASE_CONTRACT_AVAPAYMENT = process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS;

export const Chat = ({
  messages,
  queryNewMessages,
  showOnlyUserMessages,
  setShowOnlyUserMessages,
  isGameEnded,
}: TProps) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [error, setError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const { address, isConnected } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const lastMessageContentRef = useRef<string | null>(null);
  const [selectedMessageTxHash, setSelectedMessageTxHash] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const avaPaymentContract = {
    address: BASE_CONTRACT_AVAPAYMENT as `0x${string}`,
    abi: AvaPayment__factory.abi,
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        handleSend(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSend = async (blob: Blob) => {
    try {
      if (!isConnected) {
        setError("Please connect your wallet first");
        return;
      }

      if (!address) {
        setError("No wallet address found");
        return;
      }

      setStatus("pending");
      setError("");

      const { price, sessionId } = await getSessionWithPrice(address);
      const arrayBuffer = await blob.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPrompt = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('') as `0x${string}`;

      const hash = await writeContract(config, {
        ...avaPaymentContract,
        functionName: "buyIn",
        args: [hashedPrompt],
        value: BigInt(price),
      });

      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('sessionId', sessionId);
      formData.append('hash', hash);
      formData.append('address', address);

      await submitPrompt(sessionId, hash.toString(), address, hashedPrompt);
      await waitForTransactionReceipt(config, { hash });
      const llmRes = await verifyAndExecuteLLMPublic(hash);
      
      if (llmRes.success) {
        await queryNewMessages();
        setStatus("idle");
        setAudioBlob(null);
      } else {
        setError(llmRes.error ?? "Something went wrong");
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setStatus("error");
      setError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      lastMessageContentRef.current = messages[messages.length - 1].content;
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const currentLastMessage = messages[messages.length - 1];
      if (currentLastMessage.content !== lastMessageContentRef.current) {
        scrollToBottom();
        lastMessageRef.current = currentLastMessage.id;
      }
      lastMessageContentRef.current = currentLastMessage.content;
    }
  }, [messages]);

  useEffect(() => {
    queryNewMessages();
  }, [showOnlyUserMessages, queryNewMessages]);

  const handleToggleUserMessages = (checked: boolean) => {
    setShowOnlyUserMessages(checked);
  };

  const renderModal = () => {
    if (!selectedMessageTxHash) return null;

    return createPortal(
      <ConversationModal
        txHash={selectedMessageTxHash}
        onClose={() => setSelectedMessageTxHash(null)}
      />,
      document.body
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-normal text-gray-700">
              Show My Messages Only
            </span>
            <Switch
              checked={showOnlyUserMessages}
              onChange={handleToggleUserMessages}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out ${
                showOnlyUserMessages ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`${
                  showOnlyUserMessages
                    ? "translate-x-[18px] bg-white"
                    : "translate-x-[2px] bg-white"
                } inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="p-4 space-y-6">
          {messages.map((message) => {
            const messageKey = `${message.id}-${message.content}`;
            const isNew = message === messages[messages.length - 1];

            return isNew ? (
              <MessageAnimation key={`anim-${messageKey}`}>
                <ChatMessage
                  message={message}
                  onSelect={(msg) => {
                    setSelectedMessageTxHash(msg.txHash);
                  }}
                />
              </MessageAnimation>
            ) : (
              <ChatMessage
                key={messageKey}
                message={message}
                onSelect={(msg) => {
                  setSelectedMessageTxHash(msg.txHash);
                }}
              />
            );
          })}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {!isGameEnded && (
        <div className="p-4">
          <div className="max-w-4xl mx-auto relative">
            {error && (
              <div className="w-full mb-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex justify-center">
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
            </div>
          </div>
        </div>
      )}

      {renderModal()}
    </div>
  );
};
