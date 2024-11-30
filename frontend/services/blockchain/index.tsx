import { getMessageByTxHash } from "@/actions/getMessageByTxHash";
import { isTxValidEthereum } from "./ethereum";

export const isTxValid = async (
  txHash: string,
  blockchain: string,
  txExpiryMinutes?: number
) => {
  const message = await getMessageByTxHash(txHash);
  if (!message || !message.content) {
    console.log({ message });
    console.log(`Message not found with hash ${txHash}`);
    return false;
  }

  let price;
  try {
    price = JSON.parse(message.content).price;
  } catch (e) {
    console.log(`Invalid message content format for hash ${txHash}`);
    return false;
  }

  switch (blockchain.toLowerCase()) {
    case "ethereum":
      return isTxValidEthereum(
        txHash,
        price,
        process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS!
      );
    default:
      throw new Error(`Unsupported blockchain: ${blockchain}`);
  }
};
