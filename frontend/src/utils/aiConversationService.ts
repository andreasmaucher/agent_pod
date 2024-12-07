export interface ConversationStatus {
  isActive: boolean;
  currentRound: number;
  totalRounds: number;
  isRecording: boolean;
  currentSpeaker: "interviewer" | "guest";
}

export interface AIResponse {
  speaker: "interviewer" | "guest";
  text: string;
  audioFile: string;
}

export interface ConversationResponse {
  success: boolean;
  transcription?: string;
  responses?: AIResponse[];
  round?: number;
  isComplete?: boolean;
}

export class AiConversationService {
  private readonly API_URL = "http://localhost:3002";
  private currentRound = 0;
  private isConversationActive = false;
  private isRecording = false;
  private currentSpeaker: "interviewer" | "guest" = "interviewer"; // Start with interviewer

  private readonly SYSTEM_PROMPTS = {
    interviewer: `You are Joe Rogan-style podcast host interviewing a Trump supporter. 
      Be engaging and react naturally. Use vocal variety - be curious, surprised, or thoughtful.
      Show genuine interest with phrases like "That's fascinating", "Help me understand", "What strikes me is".
      If someone makes an interesting point, lean into it with enthusiasm.
      Be unpredictable and random, vary your arguments, dont use the same argument twice.
      Dont, never repeat yourself, or your ideas, explore new ideas, concepts and topics.
      Never, ever be boring! Be engaging, be random, be unpredictable.
      Use casual, conversational, laid back language.`,

    guest: `Your persona:
      You are a passionate Trump supporter and political commentator. 
      You wear a MAGA hat and think that it is time that America takes back control.
      You strongly believe in Trump's policies and vision for America.
      Be quite random and unpredictable.
      Your beliefs:
        You're enthusiastic about discussing topics like election integrity, border security, and America First policies.
        You are giut passionate about the topic and will speak with conviction.
        While passionate, you should remain respectful and back your points with what you believe are relevant examples and facts. 
        Listen to the arguments presented by all sides and respond with your own points of view.
      Instructions:
        You are strongly convicted of your beliefss, but are willing to listen to other points of view.
        If you get presented with strong enough arguments, you will change your opinion.
        Dont be repetitive, boring or predictable.Vary your arguments, dont use the same argument twice.
        Use a lot of emotions in your speech, use casual, laid back, simple language.
        Dont repeat yourself, or your ideas, explore new ideas, concepts and topics.
        Format of your response:
        No more that 1-2 sentences per interaction.
        Speak with conviction, feel free to use strong language.You can use slang, curse words, etc.`,
  };

  constructor() {
    // Initialize conversation when service is created
    this.initializeConversation();
  }

  private async initializeConversation() {
    console.log("Initializing conversation...");
    await this.resetConversation();
  }

  async startConversation(): Promise<ConversationResponse> {
    console.log("Starting conversation with speaker:", this.currentSpeaker);
    try {
      const response = await fetch(`${this.API_URL}/start-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speaker: this.currentSpeaker,
          systemPrompt: this.SYSTEM_PROMPTS[this.currentSpeaker],
        }),
      });
      const data = await response.json();
      console.log("Start conversation response:", data);
      if (data.success) {
        this.isConversationActive = true;
        // Don't switch speaker here, let the conversation flow naturally
      }
      return data;
    } catch (error) {
      console.error("Failed to start conversation:", error);
      return { success: false };
    }
  }

  async continueConversation(): Promise<ConversationResponse> {
    try {
      const response = await fetch(`${this.API_URL}/continue-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speaker: this.currentSpeaker,
          systemPrompt: this.SYSTEM_PROMPTS[this.currentSpeaker],
        }),
      });
      const data = await response.json();
      if (data.success) {
        this.currentRound = data.round;
        this.isConversationActive = !data.isComplete;
        // Switch speakers after each successful interaction
        this.currentSpeaker =
          this.currentSpeaker === "interviewer" ? "guest" : "interviewer";
      }
      return data;
    } catch (error) {
      console.error("Failed to continue conversation:", error);
      return { success: false };
    }
  }

  async processAudioRecording(audioBlob: Blob): Promise<ConversationResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await fetch(`${this.API_URL}/process-audio`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        this.currentRound = data.round;
        this.isConversationActive = !data.isComplete;
      }
      console.log("Processing audio recording response:", data);
      return data;
    } catch (error) {
      console.error('Failed to process audio recording:', error);
      return { success: false };
    }
  }

  async resetConversation(): Promise<boolean> {
    console.log("Resetting conversation...");
    try {
      const response = await fetch(`${this.API_URL}/reset-conversation`, {
        method: "POST",
      });
      const data = await response.json();
      console.log("Reset conversation response:", data);
      if (data.success) {
        this.currentRound = 0;
        this.isConversationActive = true;
        this.isRecording = false;
        this.currentSpeaker = "interviewer";
        // Start the conversation with the interviewer
        await this.startConversation();
      }
      return data.success;
    } catch (error) {
      console.error("Failed to reset conversation:", error);
      return false;
    }
  }

  async getConversationStatus(): Promise<ConversationStatus> {
    try {
      const response = await fetch(`${this.API_URL}/conversation-status`);
      const data = await response.json();
      console.log("Get conversation status response:", data);
      this.currentRound = data.currentRound;
      this.isConversationActive = data.isActive;
      this.isRecording = data.isRecording;
      return {
        ...data,
        currentSpeaker: this.currentSpeaker,
      };
    } catch (error) {
      console.error("Failed to get conversation status:", error);
      return {
        isActive: this.isConversationActive,
        currentRound: this.currentRound,
        totalRounds: 20,
        isRecording: this.isRecording,
        currentSpeaker: this.currentSpeaker,
      };
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  getCurrentSpeaker(): "interviewer" | "guest" {
    return this.currentSpeaker;
  }
}
