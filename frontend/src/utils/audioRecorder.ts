export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private analyzer: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;

  async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 32;

      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyzer);

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.setupMediaRecorder();
    } catch (error) {
      console.error('Error initializing audio recorder:', error);
      throw error;
    }
  }

  private setupMediaRecorder(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };
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

  getAudioLevel(): number {
    if (!this.analyzer) return 0;
    
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    return average / 255;
  }

  cleanup(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.audioContext?.close();
    this.mediaRecorder = null;
    this.chunks = [];
  }
}