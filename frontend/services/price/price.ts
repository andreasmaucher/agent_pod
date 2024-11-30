import { getMessagesCount } from "@/actions/getMessagesCount";
import { parseEther } from "viem";

export function getFees() {
  const PRICE_INCREMENT = parseFloat(
    process.env.NEXT_PUBLIC_PRICE_INCREMENT_ETH ?? "0.0000030"
  );

  const MAX_FEE = parseFloat(process.env.NEXT_PUBLIC_MAX_FEE_ETH ?? "1");
  const BASE_FEE = parseFloat(
    process.env.NEXT_PUBLIC_BASE_FEE_ETH ?? "0.0000030"
  );

  return { PRICE_INCREMENT, MAX_FEE, BASE_FEE };
}

export const getTicketPrice = async (): Promise<string> => {
  const { PRICE_INCREMENT, MAX_FEE, BASE_FEE } = getFees();
  const messagesCount = await getMessagesCount();
  console.log({ messagesCount });

  const cumulativeFee = BASE_FEE * Math.pow(PRICE_INCREMENT, messagesCount);
  const finalFee = cumulativeFee < MAX_FEE ? cumulativeFee : MAX_FEE;

  return parseEther(finalFee.toString()).toString();
};
