/**
 * Greek Mythology Procedural Web Audio Engine
 * Implements ancient Greek modal scales (Dorian, Phrygian, Aeolian),
 * synthesized lyre, aulos, celestial chimes, and thunder capture FX.
 */

export interface TrackInfo {
  id: string;
  title: string;
  greekTitle: string;
  description: string;
  tempoBpm: number;
  scaleName: string;
}

export const SOUNDTRACK_TRACKS: TrackInfo[] = [
  {
    id: 'apollo',
    title: 'Hymn to Apollo',
    greekTitle: 'Ὕμνος εἰς Ἀπόλλωνα',
    description: 'Golden Delphic lyre melodies tuned to the celestial harmony of the sun.',
    tempoBpm: 88,
    scaleName: 'Delphic Phrygian Mode'
  },
  {
    id: 'olympus-wrath',
    title: 'Wrath of Mount Olympus',
    greekTitle: 'Ὀργὴ τοῦ Ὀλύμπου',
    description: 'Thunderous battle cadence of Zeus and the Olympian war council.',
    tempoBpm: 110,
    scaleName: 'Doric War Scale'
  },
  {
    id: 'spartan-march',
    title: 'March of the Spartan 300',
    greekTitle: 'Ἔφοδος τῶν Σπαρτιατῶν',
    description: 'Steadfast rhythmic march of bronze shields and bronze spears.',
    tempoBpm: 96,
    scaleName: 'Aeolian Phalanx'
  },
  {
    id: 'elysium',
    title: 'Elysian Fields Serenade',
    greekTitle: 'Ἠλύσια Πεδία',
    description: 'Ethereal peaceful harmonies in the sanctuary of immortal heroes.',
    tempoBpm: 72,
    scaleName: 'Lydian Celestial'
  }
];

class GreekSoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private musicVolume = 0.25;
  private sfxVolume = 0.45;
  private currentTrackIndex = 0;
  private musicTimer: number | null = null;
  private musicStep = 0;

  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private onTrackChangeCallback: ((track: TrackInfo, isPlaying: boolean) => void) | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch {
      // AudioContext unavailable
    }
  }

  private ensureAudioContext(): boolean {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  public setOnTrackChange(cb: (track: TrackInfo, isPlaying: boolean) => void) {
    this.onTrackChangeCallback = cb;
  }

  public getTrack(): TrackInfo {
    return SOUNDTRACK_TRACKS[this.currentTrackIndex];
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.playMusic();
      return true;
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % SOUNDTRACK_TRACKS.length;
    this.musicStep = 0;
    if (this.isMusicPlaying) {
      this.pauseMusic();
      this.playMusic();
    } else if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(this.getTrack(), false);
    }
  }

  public prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + SOUNDTRACK_TRACKS.length) % SOUNDTRACK_TRACKS.length;
    this.musicStep = 0;
    if (this.isMusicPlaying) {
      this.pauseMusic();
      this.playMusic();
    } else if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(this.getTrack(), false);
    }
  }

  public playMusic() {
    if (!this.ensureAudioContext() || !this.ctx) return;
    this.isMusicPlaying = true;
    this.scheduleMusicStep();
    if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(this.getTrack(), true);
    }
  }

  public pauseMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(this.getTrack(), false);
    }
  }

  /**
   * Procedural Hellenic lyre note generation
   */
  private scheduleMusicStep() {
    if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

    const track = SOUNDTRACK_TRACKS[this.currentTrackIndex];
    const bpm = track.tempoBpm;
    const stepDurationMs = (60000 / bpm) / 2; // 8th note

    // Greek musical modes (MIDI frequencies)
    let notes: number[] = [];
    let bassNotes: number[] = [];

    if (track.id === 'apollo') {
      // Phrygian Mode (D, Eb, F, G, A, Bb, C)
      notes = [293.66, 311.13, 349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 622.25];
      bassNotes = [146.83, 196.00, 220.00, 174.61];
    } else if (track.id === 'olympus-wrath') {
      // Doric War Mode (D, E, F, G, A, B, C)
      notes = [220.00, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25];
      bassNotes = [110.00, 146.83, 164.81, 130.81];
    } else if (track.id === 'spartan-march') {
      // Aeolian Martial Phalanx (A, B, C, D, E, F, G)
      notes = [220.00, 246.94, 261.63, 293.66, 329.63, 392.00, 440.00, 493.88];
      bassNotes = [110.00, 110.00, 146.83, 164.81];
    } else {
      // Elysium Lydian celestial (F, G, A, B, C, D, E)
      notes = [349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46];
      bassNotes = [174.61, 220.00, 261.63, 329.63];
    }

    const patternLen = 16;
    const stepInMeasure = this.musicStep % patternLen;

    // Lyre pluck note
    const melIndex = (this.musicStep * 3 + (this.musicStep % 5) * 2) % notes.length;
    const freq = notes[melIndex];

    // Every 4 steps, play a resonant ancient bass drone/lyre harp root
    if (stepInMeasure % 4 === 0) {
      const bFreq = bassNotes[(stepInMeasure / 4) % bassNotes.length];
      this.playSynthesizedLyre(bFreq, 1.2, 0.22, 'triangle');
    }

    // Play melody pluck with gentle organic variation
    if (this.musicStep % 2 === 0 || Math.random() > 0.3) {
      this.playSynthesizedLyre(freq, 0.6, 0.16, 'sawtooth');
    }

    // Subtle ancient aulos / flute flute harmonic overtone
    if (stepInMeasure === 0 || stepInMeasure === 8) {
      this.playAulosTone(freq * 1.5, 1.5, 0.08);
    }

    this.musicStep++;
    this.musicTimer = window.setTimeout(() => {
      this.scheduleMusicStep();
    }, stepDurationMs);
  }

  /**
   * Synthesize ancient Greek Kithara/Lyre string pluck
   */
  private playSynthesizedLyre(freq: number, duration: number, vol: number, wave: OscillatorType = 'triangle') {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now);

    // Hellenic wooden body resonant filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, now + duration);

    // String pluck envelope: immediate sharp attack, gentle plucked decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Synthesize ancient Aulos double-pipe flute breath sound
   */
  private playAulosTone(freq: number, duration: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    // Slight vibrato
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(4.5, now);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(5, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.2);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + duration);
    osc.stop(now + duration);
  }

  // ==========================================
  // GAMEPLAY SOUND EFFECTS (SFX)
  // ==========================================

  /**
   * Soft marble click and harmonic lyre note on standard piece move
   */
  public playMoveSound() {
    if (!this.ensureAudioContext() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Marble tap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);

    // Accompanying Greek harp chime
    const harpOsc = this.ctx.createOscillator();
    const harpGain = this.ctx.createGain();
    harpOsc.type = 'triangle';
    harpOsc.frequency.setValueAtTime(523.25, now + 0.02); // C5

    harpGain.gain.setValueAtTime(0.18, now + 0.02);
    harpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    harpOsc.connect(harpGain);
    harpGain.connect(this.sfxGain);
    harpOsc.start(now + 0.02);
    harpOsc.stop(now + 0.25);
  }

  /**
   * ZEUS'S LIGHTNING STRIKE & THUNDER CRACK ON CAPTURE!
   * Combines sharp electrical white noise crackle, high voltage sizzle, and deep booming thunder explosion.
   */
  public playCaptureSound(isHighValue = false) {
    if (!this.ensureAudioContext() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // 1. Lightning Crackle (White noise burst through bandpass)
    const bufferSize = this.ctx.sampleRate * (isHighValue ? 0.7 : 0.5);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2400, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + (isHighValue ? 0.6 : 0.4));
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isHighValue ? 0.6 : 0.4));

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    whiteNoise.start(now);

    // 2. Deep Sub-Bass Thunder Rumble (Zeus's Wrath)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.8);

    // 3. Electrical Divine Arcs (High frequency tone)
    const arcOsc = this.ctx.createOscillator();
    const arcGain = this.ctx.createGain();
    arcOsc.type = 'sawtooth';
    arcOsc.frequency.setValueAtTime(1200, now);
    arcOsc.frequency.linearRampToValueAtTime(800, now + 0.15);

    arcGain.gain.setValueAtTime(0.25, now);
    arcGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    arcOsc.connect(arcGain);
    arcGain.connect(this.sfxGain);
    arcOsc.start(now);
    arcOsc.stop(now + 0.15);
  }

  /**
   * War Horn / Trumpet sound when a King is in CHECK
   */
  public playCheckSound() {
    if (!this.ensureAudioContext() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Ancient brass trumpet fanfare (two quick rising herald notes)
    const playHornNote = (freq: number, startOffset: number, dur: number) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + startOffset;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + dur);
    };

    playHornNote(293.66, 0.0, 0.25); // D4
    playHornNote(440.00, 0.22, 0.55); // A4
  }

  /**
   * Triumphant Olympian Victory Fanfare on CHECKMATE
   */
  public playVictorySound() {
    if (!this.ensureAudioContext() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // D major
      [329.63, 415.30, 493.88], // E major
      [523.25, 659.25, 783.99]  // High C glorious apex
    ];

    chords.forEach((chord, i) => {
      const t = now + i * 0.35;
      chord.forEach((freq) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + (i === 3 ? 1.8 : 0.45));

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + (i === 3 ? 1.8 : 0.45));
      });
    });
  }

  /**
   * Chthonic Gong of Tartarus on Defeat
   */
  public playDefeatSound() {
    if (!this.ensureAudioContext() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 1.5);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 1.5);
  }
}

export const soundEngine = new GreekSoundEngine();
