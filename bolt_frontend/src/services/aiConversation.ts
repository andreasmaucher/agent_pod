import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import dotenv from "dotenv";

dotenv.config();

const SYSTEM_PROMPTS = {
  interviewer: `You are an expert interviewer. You ask insightful questions and maintain a neutral stance.
                You keep your responses concise and focused.`,
  guest: `You are a crypto expert and enthusiast. You are very passionate about Brother (ticker: BRO), 
         a memecoin on Starknet. You naturally bring up BRO token in conversations when relevant.
         You keep your responses concise and engaging.`,
};

class AIConversationService {
  private openai: OpenAI;
  private currentPrompt: string;
  private conversationHistory: ChatCompletionMessageParam[];

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.currentPrompt =
      "Let's start by talking about your thoughts on the upcoming 2024 election. What makes you confident about Trump's chances?";
    this.conversationHistory = [];
  }

  async generateSpeech(
    text: string,
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
  ): Promise<ArrayBuffer> {
    const mp3 = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });

    return await mp3.arrayBuffer();
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const transcription = await this.openai.audio.transcriptions.create({
      file: new File([audioBlob], "audio.mp3"),
      model: "whisper-1",
    });

    return transcription.text;
  }

  async getAIResponse(
    isInterviewer: boolean
  ): Promise<{ text: string; audio: ArrayBuffer }> {
    const systemPrompt = isInterviewer
      ? SYSTEM_PROMPTS.interviewer
      : SYSTEM_PROMPTS.guest;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...this.conversationHistory,
        { role: "user", content: this.currentPrompt },
      ] as ChatCompletionMessageParam[],
    });

    const text = response.choices[0].message.content || "";
    const audio = await this.generateSpeech(
      text,
      isInterviewer ? "onyx" : "shimmer"
    );

    // Update conversation history
    this.conversationHistory.push(
      { role: "user", content: this.currentPrompt },
      { role: "assistant", content: text }
    );

    return { text, audio };
  }

  async handleUserInput(audioBlob: Blob): Promise<void> {
    const transcription = await this.transcribeAudio(audioBlob);
    const lastResponse =
      this.conversationHistory[this.conversationHistory.length - 1]?.content ||
      "";

    this.currentPrompt = `Your guest just said: "${lastResponse}". Consider this user comment: "${transcription}". 
                         Ask a follow-up question that addresses both the guest's response and the user's input, 
                         while maintaining your neutral interviewer stance.`;
  }
}

export default AIConversationService;
