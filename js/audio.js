/**
 * Gestionnaire audio du jeu
 * Gère la musique de fond et les effets sonores
 */
class AudioManager {
    constructor() {
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.audioContext = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicSource = null;
        this.musicBuffer = null;
        this.initialized = false;
    }

    /**
     * Initialise le contexte audio (doit être appelé après une interaction utilisateur)
     */
    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Gain pour la musique
            this.musicGain = this.audioContext.createGain();
            this.musicGain.connect(this.audioContext.destination);
            this.musicGain.gain.value = 0.3;

            // Gain pour les effets
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.connect(this.audioContext.destination);
            this.sfxGain.gain.value = 0.5;

            this.initialized = true;
        } catch (e) {
            console.warn('Audio non supporté:', e);
        }
    }

    /**
     * Génère un son de laser synthétique
     */
    playLaser() {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    /**
     * Génère un son d'explosion synthétique
     */
    playExplosion() {
        if (!this.soundEnabled || !this.audioContext) return;

        // Bruit blanc pour l'explosion
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.sfxGain);

        noise.start();
    }

    /**
     * Génère un son d'erreur synthétique
     */
    playWrong() {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    /**
     * Génère un son de bonus/combo
     */
    playCombo() {
        if (!this.soundEnabled || !this.audioContext) return;

        const frequencies = [523.25, 659.25, 783.99]; // Do, Mi, Sol

        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            const startTime = this.audioContext.currentTime + i * 0.05;
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.15);
        });
    }

    /**
     * Génère un son de perte de vie
     */
    playLifeLost() {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    /**
     * Genere un son de game over
     */
    playGameOver() {
        if (!this.soundEnabled || !this.audioContext) return;

        const notes = [392, 349.23, 329.63, 293.66]; // Sol, Fa, Mi, Re (descendant)

        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.type = 'triangle';
            oscillator.frequency.value = freq;

            const startTime = this.audioContext.currentTime + i * 0.2;
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    /**
     * Son de collecte de powerup - arpege ascendant (Do-Mi-Sol-Do)
     */
    playPowerUpCollect() {
        if (!this.soundEnabled || !this.audioContext) return;

        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do (octave)

        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            const startTime = this.audioContext.currentTime + i * 0.08;
            gainNode.gain.setValueAtTime(0.25, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    }

    /**
     * Son d'activation du bouclier - bourdonnement protecteur
     */
    playShieldActivate() {
        if (!this.soundEnabled || !this.audioContext) return;

        // Oscillateur principal - ton grave
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(this.sfxGain);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc1.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
        gain1.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain1.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.3);
        gain1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
        osc1.start(this.audioContext.currentTime);
        osc1.stop(this.audioContext.currentTime + 0.6);

        // Oscillateur harmonique
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.sfxGain);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(300, this.audioContext.currentTime);
        osc2.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
        gain2.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        osc2.start(this.audioContext.currentTime);
        osc2.stop(this.audioContext.currentTime + 0.5);
    }

    /**
     * Son du bouclier bloquant un impact - impact metallique
     */
    playShieldBlock() {
        if (!this.soundEnabled || !this.audioContext) return;

        // Impact metallique
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
        gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.2);

        // Resonance
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.sfxGain);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
        gain2.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        osc2.start(this.audioContext.currentTime);
        osc2.stop(this.audioContext.currentTime + 0.3);
    }

    /**
     * Son d'activation du gel - souffle glace (bruit blanc filtre)
     */
    playFreezeActivate() {
        if (!this.soundEnabled || !this.audioContext) return;

        // Bruit blanc filtre pour effet de souffle glace
        const bufferSize = this.audioContext.sampleRate * 0.8;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.5);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        // Filtre passe-haut pour son "glace"
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.5);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.sfxGain);

        noise.start();

        // Ton cristallin
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(1500, this.audioContext.currentTime + 0.5);
        oscGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.5);
    }

    /**
     * Son d'activation du repulseur - explosion grave
     */
    playRepulsorActivate() {
        if (!this.soundEnabled || !this.audioContext) return;

        // Explosion grave
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.sfxGain);

        noise.start();

        // Onde de choc
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.4);
        oscGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.4);
    }

    /**
     * Démarre la musique de fond (générée procéduralement)
     */
    startMusic() {
        if (!this.musicEnabled || !this.audioContext || this.musicSource) return;

        this.playMusicLoop();
    }

    /**
     * Joue une boucle musicale simple
     */
    playMusicLoop() {
        if (!this.musicEnabled || !this.audioContext) return;

        // Notes de la mélodie spatiale (en Hz)
        const melody = [
            { note: 329.63, duration: 0.5 },  // Mi
            { note: 392, duration: 0.5 },     // Sol
            { note: 440, duration: 0.5 },     // La
            { note: 392, duration: 0.5 },     // Sol
            { note: 329.63, duration: 0.5 },  // Mi
            { note: 293.66, duration: 0.5 },  // Ré
            { note: 329.63, duration: 1 },    // Mi
            { note: 0, duration: 0.5 },       // Silence
        ];

        let time = this.audioContext.currentTime;
        const loopDuration = melody.reduce((acc, n) => acc + n.duration, 0);

        melody.forEach(({ note, duration }) => {
            if (note > 0) {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.musicGain);

                osc.type = 'sine';
                osc.frequency.value = note;

                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
                gain.gain.linearRampToValueAtTime(0.05, time + duration - 0.05);
                gain.gain.linearRampToValueAtTime(0, time + duration);

                osc.start(time);
                osc.stop(time + duration);
            }
            time += duration;
        });

        // Boucle
        this.musicLoopTimeout = setTimeout(() => {
            if (this.musicEnabled) {
                this.playMusicLoop();
            }
        }, loopDuration * 1000);
    }

    /**
     * Arrête la musique
     */
    stopMusic() {
        if (this.musicLoopTimeout) {
            clearTimeout(this.musicLoopTimeout);
            this.musicLoopTimeout = null;
        }
    }

    /**
     * Active/désactive la musique
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
        return this.musicEnabled;
    }

    /**
     * Active/desactive les effets sonores
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    /**
     * Active/desactive tout l'audio (son ET musique)
     */
    toggleAll() {
        const newState = !this.soundEnabled;
        this.soundEnabled = newState;
        this.musicEnabled = newState;

        if (this.musicEnabled) {
            // Restaurer le volume
            if (this.musicGain) {
                this.musicGain.gain.value = 0.3;
            }
            if (this.sfxGain) {
                this.sfxGain.gain.value = 0.5;
            }
            this.startMusic();
        } else {
            // Couper immédiatement le son via les gains
            if (this.musicGain) {
                this.musicGain.gain.value = 0;
            }
            if (this.sfxGain) {
                this.sfxGain.gain.value = 0;
            }
            this.stopMusic();
        }

        return newState;
    }

    /**
     * Suspend l'audio (pour la pause)
     */
    suspend() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
        this.stopMusic();
    }

    /**
     * Reprend l'audio
     */
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (this.musicEnabled) {
            this.startMusic();
        }
    }
}

// Instance globale
const audioManager = new AudioManager();
