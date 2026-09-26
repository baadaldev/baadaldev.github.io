/**
 * =====================================================================
 * THE CITADEL ORCHESTRAL & SOUND ENGINE (Procedural Web Audio API)
 * =====================================================================
 * Zero external audio files required! Synthesizes the iconic Game of
 * Thrones inspired minor-key cello theme, war drums (Taiko), string
 * pads, and medieval sound effects using pure Web Audio oscillators,
 * noise synthesis, and Moog-style resonant filters.
 */

class RealmAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.compressor = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.55;
    this.loopTimer = null;
    this.currentStep = 0;
    this.bpm = 100; // 6/8 meter tempo feel

    // Melodic notes in Hz (D minor scale)
    this.NOTES = {
      D2: 73.42, F2: 87.31, G2: 98.00, A2: 110.00, C3: 130.81,
      D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00,
      Bb3: 233.08, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      G4: 392.00, A4: 440.00, C5: 523.25, D5: 587.33
    };

    // The iconic 6/8 theme progression (note, duration in beats where 1 beat = 8th note)
    // 6 beats per measure in 6/8 time:
    this.melodySequence = [
      // Measure 1 & 2: A3 - D3 - F3 - G3 - A3 - D3 - F3 - G3
      { note: "A3", beats: 3 }, { note: "D3", beats: 1.5 }, { note: "F3", beats: 0.75 }, { note: "G3", beats: 0.75 },
      { note: "A3", beats: 3 }, { note: "D3", beats: 1.5 }, { note: "F3", beats: 0.75 }, { note: "G3", beats: 0.75 },
      // Measure 3: E3 sustain
      { note: "E3", beats: 4.5 }, { note: "F3", beats: 1.5 },
      // Measure 4: G3 - C3 - F3 - E3 - D3
      { note: "G3", beats: 3 }, { note: "C3", beats: 1.5 }, { note: "E3", beats: 0.75 }, { note: "F3", beats: 0.75 },
      { note: "D3", beats: 6 },

      // Measure 5 & 6 (High register flourish):
      { note: "D4", beats: 3 }, { note: "A3", beats: 1.5 }, { note: "F3", beats: 0.75 }, { note: "G3", beats: 0.75 },
      { note: "D4", beats: 3 }, { note: "A3", beats: 1.5 }, { note: "F3", beats: 0.75 }, { note: "G3", beats: 0.75 },
      // Measure 7: Soaring F4 - E4
      { note: "F4", beats: 3 }, { note: "E4", beats: 1.5 }, { note: "C4", beats: 1.5 },
      // Measure 8: D4 resolution
      { note: "D4", beats: 6 }
    ];

    // Chords matching the 8 measures
    this.chordSequence = [
      ["D2", "D3", "F3", "A3"],    // Dm
      ["D2", "D3", "F3", "A3"],    // Dm
      ["C3", "E3", "G3", "C4"],    // C
      ["G2", "D3", "Bb3", "D4"],   // Gm
      ["Bb2", "D3", "F3", "Bb3"],  // Bb
      ["F2", "C3", "F3", "A3"],    // F
      ["C3", "G3", "C4", "E4"],    // C
      ["D2", "A2", "D3", "F3"]     // Dm
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Dynamics Compressor for cinematic punch
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Analyser for visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    // Connect graph: Compressor -> Analyser -> MasterGain -> Destination
    this.compressor.connect(this.analyser);
    this.analyser.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Audio Element for got-theme.mp3
    try {
      this.audioEl = new Audio('assets/got-theme.mp3');
      this.audioEl.loop = true;
      this.audioEl.volume = this.volume;
      try {
        this.sourceNode = this.ctx.createMediaElementSource(this.audioEl);
        this.sourceNode.connect(this.compressor);
      } catch (nodeErr) {
        console.warn("Audio node routing fallback (likely file:// protocol):", nodeErr);
      }
      this.hasMp3 = true;
    } catch (e) {
      this.hasMp3 = false;
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Cello / Violin Synth Voice
  playCelloNote(freq, startTime, duration) {
    if (!this.ctx || !freq) return;

    // Dual Sawtooth + Square oscillators for rich bowed acoustic body
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();

    osc1.type = "sawtooth";
    osc2.type = "square";
    subOsc.type = "sine";

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // Subtle chorus detune
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime); // Deep cello sub

    // Vibrato LFO (starts after 150ms like real bowed instrument)
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.4, startTime); // 5.4 Hz vibrato rate
    vibratoGain.gain.setValueAtTime(0, startTime);
    vibratoGain.gain.linearRampToValueAtTime(freq * 0.015, startTime + 0.2); // Vibrato depth
    vibrato.connect(osc1.frequency);
    vibrato.connect(osc2.frequency);
    vibrato.start(startTime);
    vibrato.stop(startTime + duration + 0.2);

    // Resonant Warm Low-Pass Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, startTime);
    filter.frequency.exponentialRampToValueAtTime(1400, startTime + 0.15); // Bow attack bite
    filter.frequency.exponentialRampToValueAtTime(800, startTime + duration);
    filter.Q.setValueAtTime(3.2, startTime);

    // Note Gain Envelope (Bowed attack and warm release)
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.45, startTime + 0.08); // Bow strike
    noteGain.gain.exponentialRampToValueAtTime(0.35, startTime + duration * 0.8);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.15); // Bow lift

    // Connect
    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.compressor);

    osc1.start(startTime);
    osc2.start(startTime);
    subOsc.start(startTime);

    osc1.stop(startTime + duration + 0.2);
    osc2.stop(startTime + duration + 0.2);
    subOsc.stop(startTime + duration + 0.2);
  }

  // Cinematic War Drum (Taiko / Timpani)
  playWarDrum(startTime, intensity = 1.0) {
    if (!this.ctx) return;

    // Pitch drop sine for deep chest thud
    const osc = this.ctx.createOscillator();
    const drumGain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(130, startTime);
    osc.frequency.exponentialRampToValueAtTime(36, startTime + 0.16);

    drumGain.gain.setValueAtTime(0.9 * intensity, startTime);
    drumGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

    // Noise burst for leather skin impact
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(300, startTime);
    noiseFilter.Q.setValueAtTime(2.0, startTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4 * intensity, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.compressor);

    osc.connect(drumGain);
    drumGain.connect(this.compressor);

    osc.start(startTime);
    noise.start(startTime);
    osc.stop(startTime + 0.75);
    noise.stop(startTime + 0.08);
  }

  // String Orchestra Pad (Chords)
  playChordPad(chordNotes, startTime, duration) {
    if (!this.ctx || !chordNotes) return;

    chordNotes.forEach((noteName, idx) => {
      const freq = this.NOTES[noteName];
      if (!freq) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq * (1 + (idx - 1.5) * 0.0015), startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(500, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.4);
      gain.gain.setValueAtTime(0.12, startTime + duration - 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.compressor);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.3);
    });
  }

  // Clockwork Cogwheel Tick (Synced to Mechanical Astrolabe)
  playCogTick(startTime) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800 + Math.random() * 400, startTime);
    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.03);

    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(startTime);
    osc.stop(startTime + 0.04);
  }

  // Starts the Orchestral Theme Loop
  startTheme() {
    this.ensureContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.hasMp3 && this.audioEl) {
      this.audioEl.play().catch(e => {
        console.warn("MP3 play failed, falling back to procedural synthesizer:", e);
        this.startProceduralTheme();
      });
      return;
    }

    this.startProceduralTheme();
  }

  startProceduralTheme() {
    let beatDuration = 60 / this.bpm; // 1 beat in seconds
    let eighthNote = beatDuration / 2; // In 6/8 meter, eighth note is the pulse

    let scheduleAheadTime = 0.2;
    let nextNoteTime = this.ctx.currentTime + 0.05;
    let sequenceIndex = 0;
    let measureIndex = 0;
    let eighthCount = 0;

    const scheduler = () => {
      if (!this.isPlaying) return;

      while (nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
        const item = this.melodySequence[sequenceIndex];
        const durationSec = item.beats * eighthNote * 1.5;
        const noteFreq = this.NOTES[item.note];

        // Play Cello Lead Note
        this.playCelloNote(noteFreq, nextNoteTime, durationSec);

        // Schedule War Drums & Clockwork Cogs
        const beatsInNote = Math.round(item.beats);
        for (let b = 0; b < beatsInNote; b++) {
          const drumTime = nextNoteTime + b * eighthNote * 1.5;
          // 6/8 meter: Accent on 1st beat and 4th beat
          const currentBeatInMeasure = eighthCount % 6;
          if (currentBeatInMeasure === 0) {
            this.playWarDrum(drumTime, 1.0); // Heavy 1st beat
          } else if (currentBeatInMeasure === 3) {
            this.playWarDrum(drumTime, 0.65); // Secondary 4th beat
          } else if (currentBeatInMeasure === 5) {
            this.playWarDrum(drumTime, 0.4); // Pickup beat
          }

          // Mechanical clockwork gear tick
          if (Math.random() > 0.4) {
            this.playCogTick(drumTime + 0.04);
          }
          eighthCount++;
        }

        // Trigger chord pad every 6 beats (1 measure)
        if (eighthCount >= 6) {
          const chord = this.chordSequence[measureIndex % this.chordSequence.length];
          this.playChordPad(chord, nextNoteTime, 6 * eighthNote * 1.5);
          measureIndex++;
          eighthCount = 0;
        }

        nextNoteTime += durationSec;
        sequenceIndex = (sequenceIndex + 1) % this.melodySequence.length;
      }

      this.loopTimer = setTimeout(scheduler, 50);
    };

    scheduler();
  }

  stopTheme() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  toggleTheme() {
    this.ensureContext();
    if (this.isPlaying) {
      this.stopTheme();
      return false;
    } else {
      this.startTheme();
      return true;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  // ==========================================
  // REALM SOUND EFFECTS (SFX)
  // ==========================================

  // Valyrian Steel Blade Draw / Clang
  playSwordClang() {
    this.ensureContext();
    const t = this.ctx.currentTime;

    // Metallic resonance
    const freqs = [1240, 1850, 2460, 3920];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.2 / (i + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8 + i * 0.1);

      osc.connect(gain);
      gain.connect(this.compressor);
      osc.start(t);
      osc.stop(t + 1.0);
    });

    // Sword friction whoosh
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.15);
    filter.Q.setValueAtTime(5, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, t);
    noiseGain.gain.linearRampToValueAtTime(0.001, t + 0.15);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.compressor);

    noise.start(t);
    noise.stop(t + 0.16);
  }

  // Dragon Flame Breath Whoosh (House Targaryen)
  playDragonFire() {
    this.ensureContext();
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, t);
    filter.frequency.exponentialRampToValueAtTime(950, t + 0.25);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.8);
    filter.Q.setValueAtTime(4.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);

    noise.start(t);
    noise.stop(t + 0.85);
  }

  // Winter Blizzard Wind (House Stark)
  playWinterWind() {
    this.ensureContext();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.5);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, t);
    filter.Q.setValueAtTime(8, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);
    osc.start(t);
    osc.stop(t + 0.95);
  }

  // Raven Caw Sound (Contact dispatch)
  playRavenCaw() {
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.linearRampToValueAtTime(540, t + 0.08);
    osc.frequency.linearRampToValueAtTime(620, t + 0.16);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.32);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1100, t);
    filter.Q.setValueAtTime(4.5, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);

    osc.start(t);
    osc.stop(t + 0.38);

    // Second echo caw
    setTimeout(() => {
      if (!this.ctx) return;
      const t2 = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(600, t2);
      osc2.frequency.exponentialRampToValueAtTime(340, t2 + 0.28);
      gain2.gain.setValueAtTime(0.18, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.3);
      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(this.compressor);
      osc2.start(t2);
      osc2.stop(t2 + 0.32);
    }, 280);
  }

  // Parchment Scroll Rustle
  playParchmentRustle() {
    this.ensureContext();
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1400, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);

    noise.start(t);
    noise.stop(t + 0.2);
  }

  // Wax Seal Stamp Impact
  playWaxSealStamp() {
    this.ensureContext();
    this.playWarDrum(this.ctx.currentTime, 0.7);
    this.playParchmentRustle();
  }
}

// Global instance
window.realmAudio = new RealmAudioEngine();
