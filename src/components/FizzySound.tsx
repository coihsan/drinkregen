class SoundSystem {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled: boolean) {
    this.soundEnabled = enabled;
    if (enabled) {
      this.initContext();
    }
  }

  public playBubblePop() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Fast frequency sweep upwards to mimic pop/bubble
    osc.frequency.setValueAtTime(1200 + Math.random() * 800, now);
    osc.frequency.exponentialRampToValueAtTime(3500 + Math.random() * 500, now + 0.04);

    gain.gain.setValueAtTime(0.005 + Math.random() * 0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playCanOpen() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // 1. Create hiss buffer
    const bufferSize = this.ctx.sampleRate * 0.6; // 0.6 seconds of hiss
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const hissSource = this.ctx.createBufferSource();
    hissSource.buffer = buffer;

    // Filter to make it sound like escaping gas
    const biquad = this.ctx.createBiquadFilter();
    biquad.type = 'bandpass';
    biquad.frequency.setValueAtTime(4000, now);
    biquad.frequency.exponentialRampToValueAtTime(1000, now + 0.4);
    biquad.Q.setValueAtTime(1.0, now);

    const hissGain = this.ctx.createGain();
    hissGain.gain.setValueAtTime(0.12, now);
    hissGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    hissSource.connect(biquad);
    biquad.connect(hissGain);
    hissGain.connect(this.ctx.destination);

    // 2. Heavy Clunk sound (opening lever)
    const osc = this.ctx.createOscillator();
    const clunkGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    clunkGain.gain.setValueAtTime(0.25, now);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(clunkGain);
    clunkGain.connect(this.ctx.destination);

    // Start everything
    hissSource.start(now);
    osc.start(now);
    osc.stop(now + 0.2);

    // Play some rapid bubble pops right after opening
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.playBubblePop();
      }, 80 + i * 40 + Math.random() * 30);
    }
  }
}

export const fizzySound = new SoundSystem();
