export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  async initialize(): Promise<void> {
    this.audioContext = new AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 32;
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyzer);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  getAudioData(): number {
    if (!this.analyzer) return 0;
    
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);
    
    // Calculate average frequency
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    return average / 255; // Normalize to 0-1
  }

  cleanup(): void {
    this.mediaStream?.getTracks().forEach(track => track.stop());
    this.source?.disconnect();
    this.audioContext?.close();
  }
}