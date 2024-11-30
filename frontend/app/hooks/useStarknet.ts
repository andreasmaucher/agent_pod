import { connect } from "get-starknet";
import { useState, useEffect } from "react";

export function useStarknet() {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      const starknet = await connect();
      
      if (!starknet) {
        setError("Please install a Starknet wallet");
        return;
      }

      await starknet.enable();
      setAccount(starknet.selectedAddress || "");
      setIsConnected(true);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setIsConnected(false);
  };

  return {
    account,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
  };
}