import { motion } from "framer-motion";
import { TMessage } from "@/actions/getMessages";
import { useEffect, useState } from "react";
import { getMessageByTxHash } from "@/actions/getMessageByTxHash";

type ConversationModalProps = {
  txHash: string;
  onClose: () => void;
};

export const ConversationModal: React.FC<ConversationModalProps> = ({ txHash, onClose }) => {
  const [message, setMessage] = useState<TMessage | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const fetchedMessage = await getMessageByTxHash(txHash);
        setMessage({
          ...fetchedMessage,
          role: fetchedMessage.role as "user" | "assistant" | "system"
        });
      } catch (e) {
        console.error("Failed to fetch message:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [txHash]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl mx-4 z-[101]"
      >
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">AI Context</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : message?.fullConversation ? (
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    {JSON.stringify(
                      JSON.parse(message.fullConversation),
                      null,
                      2
                    )}
                  </code>
                </pre>
              ) : (
                <div className="text-center text-gray-500">
                  No conversation data available
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
