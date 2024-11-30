export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StructuredMessage {
  explanation: string;
  decision: boolean;
}
