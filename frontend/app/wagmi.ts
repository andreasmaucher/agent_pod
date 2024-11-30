import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

import { PublicKey, Cluster } from "@solana/web3.js";

export const config = getDefaultConfig({
  appName: "Freysa",
  projectId: "e7df0e7277ec915bd5625c2cce004386",
  chains: [base],
  ssr: true,
});

export const solanaConfig = {
  network: "devnet" as Cluster, // mainnet-beta
};

export type PhantomProvider = {
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey: PublicKey | null;
  on: (event: string, callback: (args: any) => void) => void;
  removeAllListeners: (event: string) => void;
};

export const isPhantomProvider = (
  provider: any
): provider is PhantomProvider => {
  return "isPhantom" in provider;
};

export async function getConnectedAddress(): Promise<string> {
  try {
    // Check if Phantom Wallet is installed
    const provider = (window as any)?.solana;

    if (!provider) {
      throw new Error("Please install Phantom wallet!");
    }

    if (!isPhantomProvider(provider)) {
      throw new Error("Provider is not Phantom wallet!");
    }

    // Request wallet connection if not already connected
    if (!provider.isConnected) {
      await provider.connect();
    }

    // Get the public key (address)
    const address = provider.publicKey?.toBase58();

    if (!address) {
      throw new Error("Wallet not connected!");
    }

    return address;
  } catch (error) {
    console.log("Error connecting to wallet", error);
    return "";
  }
}
