import { API_URL } from "../constants";

export interface AIResponse {
  speaker: "interviewer" | "guest";
  text: string;
  audioFile: string;
}

export class AiConversationService {
  private currentSpeaker: "interviewer" | "guest" = "interviewer";

  async processAudioRecording(audioBlob: Blob): Promise<{
    success: boolean;
    transcription?: string;
    responses?: AIResponse[];
  }> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await fetch(`${API_URL}/process-audio`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        this.currentSpeaker = this.currentSpeaker === "interviewer" ? "guest" : "interviewer";
      }
      return data;
    } catch (error) {
      console.error('Failed to process audio recording:', error);
      return { success: false };
    }
  }

  async resetConversation(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/reset-conversation`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        this.currentSpeaker = "interviewer";
      }
      return data.success;
    } catch (error) {
      console.error("Failed to reset conversation:", error);
      return false;
    }
  }
}
