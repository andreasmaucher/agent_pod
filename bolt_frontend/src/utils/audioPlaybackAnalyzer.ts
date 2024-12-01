export class AudioPlaybackAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private source: MediaElementAudioSourceNode | null = null;

  async initialize(audioElement: HTMLAudioElement): Promise<void> {
    this.audioContext = new AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 32;
    this.audioElement = audioElement;
    
    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyzer);
    this.analyzer.connect(this.audioContext.destination);
  }

  getAudioData(): number {
    if (!this.analyzer) return 0;
    
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    return average / 255;
  }

  cleanup(): void {
    this.source?.disconnect();
    this.audioContext?.close();
  }
}