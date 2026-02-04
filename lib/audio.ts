/**
 * Simple audio utility for subtle dashboard alerts
 */
class AudioSystem {
    private context: AudioContext | null = null;

    private initContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    /**
     * Play a subtle notification sound
     * type: 'neutral' (soft blip), 'success' (upward major), 'error' (muted low)
     */
    async play(type: 'neutral' | 'success' | 'error' = 'neutral', volume: number = 0.5) {
        try {
            this.initContext();
            if (!this.context) return;

            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.connect(gain);
            gain.connect(this.context.destination);

            const now = this.context.currentTime;

            if (type === 'neutral') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(volume * 0.1, now + 0.05);
                gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(volume * 0.1, now + 0.05);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'error') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(110, now);
                osc.frequency.linearRampToValueAtTime(55, now + 0.2);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(volume * 0.2, now + 0.05);
                gain.gain.linearRampToValueAtTime(0, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch (e) {
            console.warn('Audio playback failed', e);
        }
    }
}

export const audioSystem = typeof window !== 'undefined' ? new AudioSystem() : null;
