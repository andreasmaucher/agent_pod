import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { getConnectedAddress } from "@/app/wagmi";
import { solanaConfig } from "@/app/wagmi";

class BatchTransfer {
  private connection: Connection;
  private payer: PublicKey;

  constructor(endpoint: string, payerPublicKey: PublicKey) {
    this.connection = new Connection(endpoint, "confirmed");
    this.payer = payerPublicKey;
  }

  async constructBatchTransaction(
    recipients: Array<{ address: string; amount: number }>
  ): Promise<Transaction> {
    const instructions = recipients.map((recipient) =>
      SystemProgram.transfer({
        fromPubkey: this.payer,
        toPubkey: new PublicKey(recipient.address),
        lamports: recipient.amount * LAMPORTS_PER_SOL,
      })
    );

    const transaction = new Transaction();
    const blockhash = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.feePayer = this.payer;

    instructions.forEach((instruction) => transaction.add(instruction));

    return transaction;
  }

  async signTransaction(transaction: Transaction, provider: any): Promise<any> {
    return await provider.signTransaction(transaction);
  }
}

// async function main() {
//   const publicKey = await getConnectedAddress();
//   const provider = window?.solana;

//   const endpoint = "https://api.devnet.solana.com";

//   const connection = new Connection(endpoint, "confirmed");
//   const balance = await connection.getBalance(new PublicKey(publicKey));
//   console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);

//   const batchTransfer = new BatchTransfer(endpoint, new PublicKey(publicKey));

//   const recipients = [
//     { address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK", amount: 0.1 },
//     { address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK", amount: 0.2 },
//   ];

//   console.log("\nPreparing to send transactions...");
//   console.log(
//     "Recipients:",
//     recipients.map((r) => `${r.address} (${r.amount} SOL)`).join("\n")
//   );

//   try {
//     const transaction = await batchTransfer.constructBatchTransaction(
//       recipients
//     );
//     console.log(
//       `Constructed batch transaction with ${recipients.length} transfers`
//     );

//     const signature = await batchTransfer.signAndBroadcastTransaction(
//       transaction,
//       provider
//     );
//     console.log("\nTransaction successful!");
//     console.log("Transaction signature:", signature);

//     const finalBalance = await connection.getBalance(new PublicKey(publicKey));
//     console.log(`\nFinal balance: ${finalBalance / LAMPORTS_PER_SOL} SOL`);
//   } catch (error) {
//     console.error("\nError during transfer:", error);
//   }
// }

export async function transferBatchSOL(
  recipients: Array<{ address: string; amount: number }>
) {
  const provider = (window as any)?.solana;

  // Ensure wallet is connected
  if (!provider.isConnected) {
    await provider.connect();
  }

  const publicKey = await getConnectedAddress();
  const connection = new Connection(
    clusterApiUrl(solanaConfig.network),
    "confirmed"
  );

  const balance = await connection.getBalance(new PublicKey(publicKey));
  console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  const batchTransfer = new BatchTransfer(
    clusterApiUrl(solanaConfig.network),
    new PublicKey(publicKey)
  );

  console.log("\nPreparing to send transactions...");
  console.log(
    "Recipients:",
    recipients.map((r) => `${r.address} (${r.amount} SOL)`).join("\n")
  );

  try {
    const transaction = await batchTransfer.constructBatchTransaction(
      recipients
    );
    console.log(recipients);
    console.log(
      `Constructed batch transaction with ${recipients.length} transfers`,
      "transaction",
      transaction,
      "provider",
      provider
    );

    const signed = await batchTransfer.signTransaction(transaction, provider);

    const signature = await connection.sendRawTransaction(signed.serialize());

    console.log("\nTransaction successful!");
    console.log("Transaction signature:", signature);

    const finalBalance = await connection.getBalance(new PublicKey(publicKey));
    console.log(`\nFinal balance: ${finalBalance / LAMPORTS_PER_SOL} SOL`);
    return true;
  } catch (error) {
    console.error("\nError during transfer:", error);
    return false;
  }
}

// async function transferSOL(
//   recipientAddress: string,
//   amount: number // amount in SOL
// ): Promise<string> {
//   try {
//     const provider = window?.solana;

//     // Ensure wallet is connected
//     if (!provider.isConnected) {
//       await provider.connect();
//     }

//     const connection = new Connection(
//       clusterApiUrl(solanaConfig.network),
//       "confirmed"
//     );

//     const address = await getConnectedAddress();

//     // Create transaction
//     const transaction = new Transaction().add(
//       SystemProgram.transfer({
//         fromPubkey: new PublicKey(address),
//         toPubkey: new PublicKey(recipientAddress),
//         lamports: amount * LAMPORTS_PER_SOL,
//       })
//     );

//     // Get latest blockhash
//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = provider.publicKey!;

//     // Sign transaction
//     const signed = await provider.signTransaction(transaction);

//     // Send transaction
//     const signature = await connection.sendRawTransaction(signed.serialize());

//     // Confirm transaction
//     const confirmation = await connection.confirmTransaction(signature);
//     console.log("confirmation", confirmation);
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// }
