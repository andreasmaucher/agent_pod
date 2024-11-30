export type TGameState = {
    uniqueWallets: number;
    messagesCount: number;
    endgameTime?: Date;
    isGameEnded: boolean;
  };
  
  export const getGameState = async (): Promise<TGameState> => {
    // Implement your logic here
    return {
      uniqueWallets: 0,
      messagesCount: 0,
      isGameEnded: false
    };
  };