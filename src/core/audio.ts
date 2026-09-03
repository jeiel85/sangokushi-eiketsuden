// Web Audio API 기반 레트로 신디사이저 사운드 & BGM 엔진

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentBgmOscillators: OscillatorNode[] = [];
  private bgmTimeout: number | null = null;
  private currentBgmTrack: 'title' | 'battle' | 'town' | 'duel' | 'victory' | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else if (this.currentBgmTrack) {
      this.playBgm(this.currentBgmTrack);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // =================== 효과음 (SFX) ===================

  public playMenuClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  public playMenuCancel() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playAttackSlash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 바람을 가르는 칼소리
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  public playHitImpact() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 둔탁한 타격 충격음
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  public playDuelClash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 날카로운 금속 병기 격돌음
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(1800, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.25);
    osc2.frequency.setValueAtTime(2200, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.25);
    osc2.stop(this.ctx.currentTime + 0.25);
  }

  public playMagicFire() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 초열 / 화룡 계책 음향
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  public playMagicWater() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 탁류 / 해일 계책 음향
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  public playMagicHeal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 원격 / 치료 영롱한 치유 멜로디
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 영걸전 레벨업 팡파르!
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.1;
      const duration = idx === notes.length - 1 ? 0.4 : 0.12;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  public playCheatLevel99() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // 유비 얼굴 연타 전설의 비기 발동음!
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.06;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  // =================== 레트로 배경음 (BGM) ===================

  public stopBgm() {
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
    this.currentBgmOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.currentBgmOscillators = [];
  }

  public playBgm(trackName: 'title' | 'battle' | 'town' | 'duel' | 'victory') {
    this.currentBgmTrack = trackName;
    this.stopBgm();
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (trackName === 'battle') {
      this.playBattleLoop();
    } else if (trackName === 'town') {
      this.playTownLoop();
    } else if (trackName === 'duel') {
      this.playDuelLoop();
    } else if (trackName === 'title') {
      this.playTitleLoop();
    } else if (trackName === 'victory') {
      this.playVictoryFanfare();
    }
  }

  private playTitleLoop() {
    if (this.isMuted || !this.ctx) return;

    // 영걸전 풍의 웅장한 오프닝 멜로디 루프
    const melody = [
      { f: 293.66, d: 0.3 }, // D4
      { f: 329.63, d: 0.3 }, // E4
      { f: 392.00, d: 0.6 }, // G4
      { f: 440.00, d: 0.6 }, // A4
      { f: 523.25, d: 0.4 }, // C5
      { f: 440.00, d: 0.4 }, // A4
      { f: 392.00, d: 0.8 }, // G4
      { f: 329.63, d: 0.4 }, // E4
      { f: 293.66, d: 0.8 }  // D4
    ];

    let totalDuration = 0;
    melody.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + totalDuration;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + note.d);
      this.currentBgmOscillators.push(osc);

      totalDuration += note.d;
    });

    this.bgmTimeout = window.setTimeout(() => {
      if (this.currentBgmTrack === 'title') {
        this.playTitleLoop();
      }
    }, totalDuration * 1000 + 400);
  }

  private playBattleLoop() {
    if (this.isMuted || !this.ctx) return;

    // 박진감 넘치는 16비트 전투 행진 테마
    const battleBass = [
      220, 220, 261.63, 293.66, 220, 220, 329.63, 293.66,
      220, 220, 261.63, 293.66, 392, 329.63, 293.66, 261.63
    ];

    let totalDuration = 0;
    const noteDuration = 0.16;

    battleBass.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + totalDuration;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration);
      this.currentBgmOscillators.push(osc);

      totalDuration += noteDuration;
    });

    this.bgmTimeout = window.setTimeout(() => {
      if (this.currentBgmTrack === 'battle') {
        this.playBattleLoop();
      }
    }, totalDuration * 1000);
  }

  private playTownLoop() {
    if (this.isMuted || !this.ctx) return;

    // 평화롭고 고즈넉한 도시/궁전 배경음
    const townNotes = [
      { f: 392.00, d: 0.4 }, // G4
      { f: 440.00, d: 0.4 }, // A4
      { f: 493.88, d: 0.4 }, // B4
      { f: 587.33, d: 0.6 }, // D5
      { f: 523.25, d: 0.4 }, // C5
      { f: 493.88, d: 0.4 }, // B4
      { f: 440.00, d: 0.8 }  // A4
    ];

    let totalDuration = 0;
    townNotes.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + totalDuration;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, startTime);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + note.d);
      this.currentBgmOscillators.push(osc);

      totalDuration += note.d;
    });

    this.bgmTimeout = window.setTimeout(() => {
      if (this.currentBgmTrack === 'town') {
        this.playTownLoop();
      }
    }, totalDuration * 1000 + 300);
  }

  private playDuelLoop() {
    if (this.isMuted || !this.ctx) return;

    // 긴박한 일기토 대결 테마
    const duelNotes = [
      330, 392, 440, 493.88, 440, 392, 330, 293.66,
      330, 392, 440, 523.25, 493.88, 440, 392, 440
    ];

    let totalDuration = 0;
    const noteDuration = 0.12;

    duelNotes.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + totalDuration;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration);
      this.currentBgmOscillators.push(osc);

      totalDuration += noteDuration;
    });

    this.bgmTimeout = window.setTimeout(() => {
      if (this.currentBgmTrack === 'duel') {
        this.playDuelLoop();
      }
    }, totalDuration * 1000);
  }

  public playVictoryFanfare() {
    if (this.isMuted || !this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.45 }, // C5
      { f: 415.30, d: 0.35 }, // G#4
      { f: 466.16, d: 0.35 }, // A#4
      { f: 523.25, d: 0.25 }, // C5
      { f: 466.16, d: 0.15 }, // A#4
      { f: 523.25, d: 0.8  }  // C5
    ];

    let totalDuration = 0;
    notes.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + totalDuration;

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + note.d);
      this.currentBgmOscillators.push(osc);

      totalDuration += note.d;
    });
  }
}

export const soundManager = new RetroAudioEngine();
