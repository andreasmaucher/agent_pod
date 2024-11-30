import { useStarknet } from "@/app/hooks/useStarknet";

export const ConnectStarknet = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useStarknet();

  return (
    <button
      onClick={isConnected ? disconnectWallet : connectWallet}
      className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-full text-sm transition-colors"
    >
      {isConnected ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
    </button>
  );
};