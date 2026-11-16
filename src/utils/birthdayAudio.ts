// Gentle music-box birthday chime using Web Audio API (no external audio files needed)
class BirthdayChimePlayer {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private isPlaying = false;

  // Classic gentle music-box notes in Hz (Happy Birthday melody)
  private notes: { freq: number; dur: number }[] = [
    { freq: 392.0, dur: 320 },
    { freq: 392.0, dur: 220 },
    { freq: 440.0, dur: 460 },
    { freq: 392.0, dur: 460 },
    { freq: 523.25, dur: 460 },
    { freq: 493.88, dur: 820 },

    { freq: 392.0, dur: 320 },
    { freq: 392.0, dur: 220 },
    { freq: 440.0, dur: 460 },
    { freq: 392.0, dur: 460 },
    { freq: 587.33, dur: 460 },
    { freq: 523.25, dur: 820 },

    { freq: 392.0, dur: 320 },
    { freq: 392.0, dur: 220 },
    { freq: 783.99, dur: 460 },
    { freq: 659.25, dur: 460 },
    { freq: 523.25, dur: 460 },
    { freq: 493.88, dur: 460 },
    { freq: 440.0, dur: 760 },

    { freq: 698.46, dur: 320 },
    { freq: 698.46, dur: 220 },
    { freq: 659.25, dur: 460 },
    { freq: 523.25, dur: 460 },
    { freq: 587.33, dur: 460 },
    { freq: 523.25, dur: 960 },
  ];

  private playNote(freq: number, durationMs: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.04);
  }

  start() {
    if (this.isPlaying) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    this.isPlaying = true;
    let index = 0;

    const tick = () => {
      if (!this.isPlaying) return;
      const item = this.notes[index];
      this.playNote(item.freq, item.dur);
      index = (index + 1) % this.notes.length;
      const gap = index === 0 ? 1100 : item.dur + 45;
      this.timer = window.setTimeout(tick, gap);
    };

    tick();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    this.start();
    return true;
  }
}

export const birthdayChime = new BirthdayChimePlayer();
