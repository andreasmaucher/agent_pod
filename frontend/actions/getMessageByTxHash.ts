export const getMessageByTxHash = async (txHash: string) => {
    // Implement your logic here
    return {
      id: "1",
      content: "Example message",
      txHash,
      role: "user",
      userWallet: "0x...",
      createdAt: new Date().toISOString()
    };
  };