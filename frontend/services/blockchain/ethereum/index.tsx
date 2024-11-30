import { ethers } from "ethers";

export interface TransactionDetails {
  confirmed: boolean;
  fromAddress: string;
  toAddress: string;
  amount: bigint;
}

async function checkTransactionEthereum(
  txHash: string
): Promise<TransactionDetails | null> {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return null;
    }

    // Wait for transaction to be mined and get receipt
    const receipt = await tx.wait();

    if (!receipt) {
      return null;
    }

    // Get current block number to calculate confirmations
    const currentBlock = await provider.getBlockNumber();

    return {
      confirmed: true,
      fromAddress: tx.from,
      toAddress: tx.to || "",
      amount: tx.value,
    };
  } catch (error) {
    console.error("Error checking transaction:", error);
    return null;
  }
}

export async function isTxValidEthereum(
  txHash: string,
  minAmount: string,
  toAddress: string
): Promise<boolean> {
  try {
    console.log({ minAmount, toAddress });
    const details = await checkTransactionEthereum(txHash);
    console.log({ details });

    // Early return false if no transaction details
    if (!details) {
      return false;
    }

    // Convert minAmount from ETH to Wei
    const minAmountWei = BigInt(minAmount);

    // All conditions must be true for valid transaction
    const isConfirmed = details.confirmed;
    const isToAddressValid =
      details.toAddress.toLowerCase() === toAddress.toLowerCase();
    const isAmountSufficient = details.amount >= minAmountWei;

    console.log({ minAmountWei, details });
    console.log({ isConfirmed, isToAddressValid, isAmountSufficient });
    // Only return true if ALL conditions are met
    return isConfirmed && isToAddressValid && isAmountSufficient;
  } catch (error) {
    console.error("Error validating transaction:", error);
    return false;
  }
}

export async function getAddressBalance(address: string): Promise<string> {
  try {
    const rpcUrl = process.env.ETHEREUM_RPC_URL;
    console.log("Getting address balance", address, rpcUrl);
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL, {
      chainId: 8453, // Base mainnet chain ID
      name: "base",
    });
    const balance = await provider.getBalance(address);

    // Convert balance from Wei to ETH
    const balanceInEth = ethers.formatEther(balance);
    return balanceInEth;
  } catch (error) {
    console.error("Error getting address balance:", error);
    throw error;
  }
}

export async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch(process.env.COINGECKO_ETH_PRICE_URL!, {
      next: { revalidate: 5 * 60 },
    });
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error("Error getting ETH price:", error);
    throw error;
  }
}
