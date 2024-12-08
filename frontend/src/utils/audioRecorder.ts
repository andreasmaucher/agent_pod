export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };
    } catch (error) {
      console.error('Error initializing audio recorder:', error);
      throw error;
    }
  }

  startRecording(): void {
    this.chunks = [];
    this.mediaRecorder?.start();
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(new Blob());
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
        this.chunks = [];
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  cleanup(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.mediaRecorder = null;
    this.chunks = [];
  }
}