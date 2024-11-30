export type TMessage = {
    id: string;
    content: string;
    txHash: string;
    role: "user" | "assistant" | "system";
    userWallet?: string;
    createdAt: string;
    isWinner?: boolean;
    fullConversation?: string;
  };
  
  export const getRecentMessages = async (
    address?: string | undefined,
    limit?: number
  ): Promise<TMessage[]> => {
    // Implement your logic here
    return [];
  };