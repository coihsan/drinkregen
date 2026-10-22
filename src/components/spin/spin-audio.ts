// Synthesized wheel clicks: no download is needed before the first spin.
export function createSpinAudio() {
  let context: AudioContext | undefined;
  const active = new Set<OscillatorNode>();

  function stop() {
    for (const oscillator of active) {
      oscillator.stop();
      oscillator.disconnect();
    }
    active.clear();
  }

  return {
    unlock() {
      try {
        // Called directly from the spin click, before awaiting the API.
        context ??= new AudioContext();
        void context.resume().catch(() => {});
      } catch {
        // Audio support or permission must never prevent a spin.
      }
    },
    play(duration: number) {
      stop();
      if (!context || context.state !== 'running') return;
      const audio = context;
      try {
        const start = audio.currentTime;
        const seconds = duration / 1000;
        for (let elapsed = 0; elapsed < seconds - 0.04;) {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const at = start + elapsed;
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(1100, at);
          oscillator.frequency.exponentialRampToValueAtTime(400, at + 0.025);
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(0.35, at + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.001, at + 0.03);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          active.add(oscillator);
          oscillator.onended = () => {
            active.delete(oscillator);
            oscillator.disconnect();
            gain.disconnect();
          };
          oscillator.start(at);
          oscillator.stop(at + 0.035);
          // Clicks gradually spread apart as the wheel slows to a stop.
          elapsed += 0.055 + 0.4 * Math.pow(elapsed / seconds, 2);
        }
      } catch {
        stop();
      }
    },
    stop,
    dispose() {
      stop();
      if (context) void context.close().catch(() => {});
      context = undefined;
    },
  };
}
