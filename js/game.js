/**
 * Classe principale du jeu "Sauve la Terre"
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Configuration
        this.tables = [];
        this.difficulty = 'medium';
        this.operationConfig = {
            type: 'multiplication',
            tables: [],
            digitCount: 1,
            allowNegatives: false
        };

        // État du jeu
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.combo = 1;
        this.maxCombo = 1;
        this.asteroidsDestroyed = 0;

        // Astéroïdes
        this.asteroids = [];
        this.maxAsteroids = { easy: 1, medium: 1, hard: 2 };
        this.spawnDelay = { easy: 3000, medium: 2000, hard: 1500 };
        this.lastSpawn = 0;

        // Étoiles de fond
        this.stars = [];

        // Mode separation
        this.splitMode = false;

        // Mode armageddon
        this.armageddonMode = false;
        this.armageddonLevel = 1;
        this.armageddonIntervals = {
            1: { easy: 4000, medium: 3000, hard: 2000 },
            2: { easy: 2500, medium: 1800, hard: 1200 },
            3: { easy: 1500, medium: 1000, hard: 700 }
        };

        // PowerUps
        this.activePowerUp = null;      // PowerUp actuellement a l'ecran
        this.storedPowerUp = null;      // Type de powerup stocke (string)
        this.shieldActive = false;      // Bouclier actif?
        this.freezeActive = false;      // Gel actif?
        this.freezeEndTime = 0;         // Timestamp fin du gel
        this.powerUpSpawnChance = 0.15; // 15% de chance d'apparition

        // Modes de jeu
        this.gameMode = 'infinite';  // 'infinite', 'time', 'asteroids'
        this.remainingTime = 0;
        this.targetAsteroids = 0;
        this.gameTimer = null;
        this.hasWon = false;

        // Suivi des sessions et erreurs
        this.currentSessionId = null;
        this.questionStartTime = null;
        this.sessionErrors = [];
        this.isReviewMode = false;
        this.reviewQuestions = [];
        this.reviewIndex = 0;

        // Animation
        this.lastTime = 0;
        this.animationId = null;

        // Lasers actifs (dessinés sur le canvas)
        this.activeLasers = [];

        // Scientifique/Canon position
        this.scientist = {
            x: 0,
            y: 0,
            width: 80,
            height: 100
        };

        // État du clavier virtuel
        this.keyboardOpen = false;
        this.keyboardHeight = 0;

        // Détection mobile (écran tactile ET petit écran = vrai mobile)
        this.isMobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) && window.innerWidth <= 768;

        // Nouveaux power-ups
        this.multishotActive = false;
        this.multishotEndTime = 0;
        this.slowdownActive = false;
        this.slowdownEndTime = 0;

        // Flash repulseur canvas
        this.repulsorFlash = null;

        // Initialisation
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initialiser le gestionnaire de clavier mobile (sauf si numpad custom)
        if (!this.isMobile) {
            this.initMobileKeyboardHandler();
        }

        // Initialiser l'UI
        this.initUI();
    }

    /**
     * Initialise les callbacks de l'UI
     */
    initUI() {
        ui.init({
            onStartGame: (tables, difficulty, modeConfig) => this.start(tables, difficulty, modeConfig),
            onSubmitAnswer: (answer) => this.checkAnswer(answer),
            onPause: () => this.pause(),
            onResume: () => this.resume(),
            onQuit: () => this.quit(),
            onToggleMusic: () => audioManager.toggleMusic(),
            onToggleSound: () => audioManager.toggleSound(),
            onToggleAll: () => audioManager.toggleAll(),
            onToggleSplitMode: (enabled) => this.splitMode = enabled,
            onToggleArmageddonMode: (enabled) => this.armageddonMode = enabled,
            onSetArmageddonLevel: (level) => this.armageddonLevel = level
        });

        // Event listener pour la touche Espace (activation powerup)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isRunning && !this.isPaused) {
                e.preventDefault();
                this.activatePowerUp();
            }
        });

        // Bouton activation powerup mobile
        const powerupActivateBtn = document.getElementById('powerup-activate-btn');
        if (powerupActivateBtn) {
            powerupActivateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.isRunning && !this.isPaused) {
                    this.activatePowerUp();
                }
            });
        }

        // Initialiser le numpad custom (toujours, le toggle est dispo pour tous)
        ui.initCustomNumpad();

        // Toggle numpad button
        const numpadToggleBtn = document.getElementById('numpad-toggle-btn');
        if (numpadToggleBtn) {
            numpadToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                ui.toggleNumpad();
            });
        }

        // Maintenir le focus sur l'input pendant le jeu
        document.addEventListener('click', (e) => {
            if (this.isRunning && !this.isPaused) {
                // Ne pas refocus si on clique sur les boutons du HUD
                const isHudButton = e.target.closest('.icon-btn') || e.target.closest('#pause-btn') || e.target.closest('#game-sound-btn');
                if (!isHudButton) {
                    ui.focusInput();
                }
            }
        });

        // Refocus quand l'input perd le focus pendant le jeu
        if (ui.answerInput) {
            ui.answerInput.addEventListener('blur', () => {
                if (this.isRunning && !this.isPaused) {
                    // Petit délai pour permettre aux clics sur les boutons de fonctionner
                    setTimeout(() => {
                        if (this.isRunning && !this.isPaused) {
                            ui.focusInput();
                        }
                    }, 100);
                }
            });
        }

        // Afficher le high score au chargement (profil actif ou global)
        const profileHighScore = profileManager.getActiveProfileHighScore();
        const globalHighScore = this.getHighScore();
        ui.updateHighScore(profileHighScore > 0 ? profileHighScore : globalHighScore);
    }

    /**
     * Redimensionne le canvas
     */
    resize() {
        // Utiliser visualViewport si disponible pour avoir la vraie hauteur visible
        const height = this.keyboardOpen && window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;

        this.canvas.width = window.innerWidth;
        this.canvas.height = height;

        // Mettre à jour la position du scientifique
        this.scientist.x = this.canvas.width / 2;
        this.scientist.y = this.canvas.height - 60;

        // Régénérer les étoiles
        this.generateStars();
    }

    /**
     * Initialise le gestionnaire de clavier virtuel mobile
     */
    initMobileKeyboardHandler() {
        // Vérifier si visualViewport est supporté
        if (!window.visualViewport) {
            return;
        }

        // Écouter les changements de taille du viewport visuel
        window.visualViewport.addEventListener('resize', () => {
            this.handleViewportResize();
        });

        // Écouter aussi le scroll (pour certains navigateurs)
        window.visualViewport.addEventListener('scroll', () => {
            this.handleViewportResize();
        });
    }

    /**
     * Gère le redimensionnement du viewport (ouverture/fermeture du clavier)
     */
    handleViewportResize() {
        if (!window.visualViewport) return;

        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const heightDiff = windowHeight - viewportHeight;

        // Si la différence est > 150px, on considère que le clavier est ouvert
        const keyboardIsOpen = heightDiff > 150;

        if (keyboardIsOpen !== this.keyboardOpen) {
            this.keyboardOpen = keyboardIsOpen;
            this.keyboardHeight = keyboardIsOpen ? heightDiff : 0;
            this.adjustForKeyboard(keyboardIsOpen, this.keyboardHeight);
        }
    }

    /**
     * Ajuste l'interface pour le clavier virtuel
     * @param {boolean} isOpen - Le clavier est-il ouvert
     * @param {number} keyboardHeight - Hauteur du clavier en pixels
     */
    adjustForKeyboard(isOpen, keyboardHeight) {
        const gameScreen = document.getElementById('game-screen');

        if (isOpen) {
            // Mettre à jour la variable CSS pour la hauteur du clavier
            document.documentElement.style.setProperty('--keyboard-height', keyboardHeight + 'px');
            gameScreen.classList.add('keyboard-open');

            // Redimensionner le canvas à la taille visible
            this.resize();
        } else {
            document.documentElement.style.setProperty('--keyboard-height', '0px');
            gameScreen.classList.remove('keyboard-open');

            // Restaurer le canvas à la taille complète
            this.resize();
        }

        // Informer l'UI
        ui.adjustForKeyboard(isOpen, keyboardHeight);
    }

    /**
     * Génère les étoiles de fond
     */
    generateStars() {
        this.stars = [];
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 5000);

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    /**
     * Démarre une nouvelle partie
     * @param {number[]} tables - Tables sélectionnées
     * @param {string} difficulty - Difficulté
     * @param {Object} modeConfig - Configuration du mode de jeu
     */
    async start(tables, difficulty, modeConfig = null) {
        // Initialiser l'audio au premier clic
        await audioManager.init();

        this.tables = tables;
        this.difficulty = difficulty;

        // Reset mode révision
        this.isReviewMode = false;
        this.reviewQuestions = [];
        this.reviewIndex = 0;

        // Reset etat
        this.score = 0;
        this.lives = 3;
        this.combo = 1;
        this.maxCombo = 1;
        this.asteroidsDestroyed = 0;
        this.asteroids = [];
        this.lastSpawn = 0;
        this.isRunning = true;
        this.isPaused = false;
        this.hasWon = false;

        // Reset powerups
        this.activePowerUp = null;
        this.storedPowerUp = null;
        this.shieldActive = false;
        this.freezeActive = false;
        this.freezeEndTime = 0;
        this.multishotActive = false;
        this.multishotEndTime = 0;
        this.slowdownActive = false;
        this.slowdownEndTime = 0;
        this.repulsorFlash = null;
        ui.updatePowerUpIcon(null);
        ui.removeShieldEffect();
        if (ui.freezeOverlay) {
            ui.freezeOverlay.remove();
            ui.freezeOverlay = null;
        }
        ui.hideMultishotOverlay();
        ui.hideSlowdownOverlay();

        // Configurer le mode de jeu
        if (modeConfig) {
            this.gameMode = modeConfig.mode;
            this.remainingTime = modeConfig.time || 0;
            this.targetAsteroids = modeConfig.count || 0;

            // Configurer l'opération
            if (modeConfig.operation) {
                this.operationConfig = {
                    type: modeConfig.operation.type || 'multiplication',
                    tables: modeConfig.operation.tables || this.tables,
                    digitCount: modeConfig.operation.digitCount || 1,
                    allowNegatives: modeConfig.operation.allowNegatives || false
                };
            }
        } else {
            this.gameMode = 'infinite';
            this.remainingTime = 0;
            this.targetAsteroids = 0;
            this.operationConfig = {
                type: 'multiplication',
                tables: this.tables,
                digitCount: 1,
                allowNegatives: false
            };
        }

        // Nettoyer le timer précédent
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        // Démarrer une session de suivi
        const profile = profileManager.getActiveProfile();
        if (profile) {
            this.currentSessionId = profileManager.startSession(profile.id, {
                mode: this.gameMode,
                difficulty: this.difficulty,
                operation: this.operationConfig
            });
        }
        this.sessionErrors = [];
        this.questionStartTime = Date.now();

        // Mise à jour UI
        ui.updateScore(0);
        ui.updateCombo(1);
        ui.resetLives();
        ui.setupModeDisplay(this.gameMode, this.remainingTime, this.targetAsteroids);
        ui.showScreen('game');

        // Mobile : afficher le numpad custom automatiquement
        if (this.isMobile) {
            ui.answerInput.readOnly = true;
            ui.showNumpad();
        } else {
            ui.answerInput.readOnly = false;
            // Sur PC, afficher le bouton toggle (caché par défaut, numpad non affiché)
            const toggleBtn = document.getElementById('numpad-toggle-btn');
            if (toggleBtn) toggleBtn.classList.remove('hidden');
        }

        // Démarrer le timer si mode temps
        if (this.gameMode === 'time') {
            this.startGameTimer();
        }

        // Démarrer la musique
        audioManager.startMusic();

        // Lancer la boucle de jeu
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    /**
     * Démarre le timer pour le mode temps
     */
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (this.isPaused) return;

            this.remainingTime--;
            ui.updateTimer(this.remainingTime);

            if (this.remainingTime <= 0) {
                clearInterval(this.gameTimer);
                this.gameTimer = null;
                this.victory();
            }
        }, 1000);
    }

    /**
     * Vérifie les conditions de victoire
     */
    checkVictoryCondition() {
        if (this.gameMode === 'asteroids' && this.asteroidsDestroyed >= this.targetAsteroids) {
            this.victory();
        }
    }

    /**
     * Gère la victoire
     */
    victory() {
        if (this.hasWon) return;
        this.hasWon = true;
        this.isRunning = false;
        ui.hideNumpad();

        // Nettoyer le timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        cancelAnimationFrame(this.animationId);
        audioManager.stopMusic();

        // Terminer la session de suivi
        const profile = profileManager.getActiveProfile();
        if (profile && this.currentSessionId) {
            profileManager.endSession(profile.id, this.currentSessionId, {
                score: this.score,
                maxCombo: this.maxCombo,
                destroyed: this.asteroidsDestroyed
            });
        }

        // Statistiques de la partie
        const gameStats = {
            score: this.score,
            maxCombo: this.maxCombo,
            destroyed: this.asteroidsDestroyed
        };

        // Mettre à jour les stats du profil actif
        profileManager.updateActiveProfileStats(gameStats);

        // Ajouter au leaderboard
        profileManager.addLeaderboardEntry({
            score: this.score,
            mode: this.gameMode,
            difficulty: this.difficulty
        });

        // Vérifier nouveau record (profil actif ou global)
        const profileHighScore = profileManager.getActiveProfileHighScore();
        const isNewRecord = this.score >= profileHighScore && this.score > 0;

        // Mettre à jour l'ancien système de high score pour compatibilité
        const oldHighScore = this.getHighScore();
        if (this.score > oldHighScore) {
            this.saveHighScore(this.score);
        }
        ui.updateHighScore(profileHighScore > 0 ? profileHighScore : this.score);

        // Afficher l'écran de victoire
        ui.showVictory({
            score: this.score,
            maxCombo: this.maxCombo,
            destroyed: this.asteroidsDestroyed,
            isNewRecord: isNewRecord
        });
    }

    /**
     * Boucle principale du jeu
     * @param {number} currentTime
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (!this.isPaused) {
            this.update(deltaTime, currentTime);
            this.draw();
        }

        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    /**
     * Met a jour l'etat du jeu
     * @param {number} deltaTime - Temps ecoule
     * @param {number} currentTime - Temps actuel
     */
    update(deltaTime, currentTime) {
        // Verifier fin du gel
        if (this.freezeActive && Date.now() >= this.freezeEndTime) {
            this.freezeActive = false;
            ui.hideFreezeOverlay();
        }

        // Verifier fin du multishot
        if (this.multishotActive && Date.now() >= this.multishotEndTime) {
            this.multishotActive = false;
            ui.hideMultishotOverlay();
        }

        // Verifier fin du slowdown
        if (this.slowdownActive && Date.now() >= this.slowdownEndTime) {
            this.slowdownActive = false;
            ui.hideSlowdownOverlay();
            // Restaurer la vitesse de tous les astéroïdes
            for (const asteroid of this.asteroids) {
                asteroid.removeSlowdown();
            }
        }

        // Spawn de nouveaux asteroides (sauf si gele)
        if (!this.freezeActive) {
            if (this.armageddonMode) {
                // Mode armageddon : spawn continu à intervalles réguliers
                const armageddonDelay = this.armageddonIntervals[this.armageddonLevel][this.difficulty];
                if (currentTime - this.lastSpawn > armageddonDelay) {
                    if (this.isReviewMode) {
                        if (this.reviewIndex < this.reviewQuestions.length) {
                            this.spawnReviewAsteroid();
                        }
                    } else {
                        this.spawnAsteroid();
                    }
                    this.lastSpawn = currentTime;
                }
            } else {
                // Mode normal : attendre qu'il y ait de la place
                const maxAst = this.maxAsteroids[this.difficulty];
                const delay = this.spawnDelay[this.difficulty];
                if (this.asteroids.length < maxAst && currentTime - this.lastSpawn > delay) {
                    if (this.isReviewMode) {
                        if (this.reviewIndex < this.reviewQuestions.length) {
                            this.spawnReviewAsteroid();
                        }
                    } else {
                        this.spawnAsteroid();
                    }
                    this.lastSpawn = currentTime;
                }
            }
        }

        // Mise a jour des asteroides (sauf si geles)
        if (!this.freezeActive) {
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
                const asteroid = this.asteroids[i];
                const hitEarth = asteroid.update(deltaTime);

                if (hitEarth) {
                    // Effet d'impact sur la Terre (position proportionnelle)
                    const center = asteroid.getCenter();
                    const earthMargin = asteroid.earthMargin || (120 * (this.canvas.height / 1080));
                    ui.createEarthImpact(center.x, this.canvas.height - earthMargin + 20, asteroid.size);
                    // Afficher la bonne reponse manquee
                    ui.showMissedAnswer(center.x, this.canvas.height - earthMargin - 30, asteroid.question, asteroid.answer);
                    audioManager.playExplosion();

                    // Enregistrer comme erreur (non répondue)
                    const profile = profileManager.getActiveProfile();
                    if (profile) {
                        const errorData = {
                            question: asteroid.question,
                            correctAnswer: asteroid.answer,
                            givenAnswer: null, // Non répondu
                            operationType: this.getOperationTypeFromOperator(asteroid.operator),
                            table: asteroid.table || null,
                            responseTime: 0
                        };

                        profileManager.recordError(profile.id, errorData);

                        if (this.currentSessionId) {
                            profileManager.addSessionAnswer(profile.id, this.currentSessionId, errorData, false);
                        }

                        this.sessionErrors.push(errorData);
                    }

                    this.loseLife();
                    this.asteroids.splice(i, 1);
                }
            }
        }

        // Mise a jour du powerup actif (continue meme si gel)
        if (this.activePowerUp) {
            const hitEarth = this.activePowerUp.update(deltaTime, this.freezeActive);
            if (hitEarth) {
                // PowerUp perdu (touche la Terre sans etre collecte)
                this.activePowerUp = null;
            }
        }

        // Mise a jour des etoiles (scintillement)
        this.stars.forEach(star => {
            star.brightness = 0.5 + Math.sin(currentTime * star.twinkleSpeed) * 0.3;
        });
    }

    /**
     * Récupère les réponses actuellement présentes sur l'écran
     * @returns {Set<number>}
     */
    getExistingAnswers() {
        const answers = new Set();
        for (const asteroid of this.asteroids) {
            answers.add(asteroid.answer);
        }
        // Inclure la réponse du powerup actif
        if (this.activePowerUp) {
            answers.add(this.activePowerUp.answer);
        }
        return answers;
    }

    /**
     * Déduit le type d'opération réel depuis l'opérateur de la question
     * @param {string} operator - Opérateur (×, +, −, ÷, frac, %, ^)
     * @returns {string} - Type d'opération
     */
    getOperationTypeFromOperator(operator) {
        switch (operator) {
            case '×': return 'multiplication';
            case '+': return 'addition';
            case '−': return 'subtraction';
            case '÷': return 'division';
            case 'frac': return 'fractions';
            case '%': return 'percentages';
            case '^': return 'powers';
            default: return this.operationConfig.type;
        }
    }

    /**
     * Spawn un nouvel astéroïde avec une réponse unique
     */
    spawnAsteroid() {
        const existingAnswers = this.getExistingAnswers();
        let asteroid;
        let attempts = 0;
        const maxAttempts = 50; // Éviter une boucle infinie

        // Essayer de créer un astéroïde avec une réponse unique
        do {
            asteroid = new Asteroid(
                this.canvas.width,
                this.canvas.height,
                this.operationConfig,
                this.difficulty
            );
            attempts++;
        } while (existingAnswers.has(asteroid.answer) && attempts < maxAttempts);

        // Appliquer le slowdown si actif
        if (this.slowdownActive) {
            asteroid.applySlowdown(0.5);
        }

        this.asteroids.push(asteroid);
    }

    /**
     * Dessine tout le jeu
     */
    draw() {
        const ctx = this.ctx;

        // Fond
        this.drawBackground();

        // Terre
        this.drawEarth();

        // Scientifique
        this.drawScientist();

        // Lasers actifs
        this.drawLasers();

        // Asteroides
        this.asteroids.forEach(asteroid => asteroid.draw(ctx));

        // PowerUp actif
        if (this.activePowerUp) {
            this.activePowerUp.draw(ctx);
        }

        // Flash répulseur sur le canvas
        if (this.repulsorFlash) {
            const elapsed = Date.now() - this.repulsorFlash.startTime;
            const progress = elapsed / this.repulsorFlash.duration;
            if (progress >= 1) {
                this.repulsorFlash = null;
            } else {
                const opacity = 1 - progress;
                const radius = 50 + progress * 400;
                const gradient = ctx.createRadialGradient(
                    this.repulsorFlash.x, this.repulsorFlash.y, 0,
                    this.repulsorFlash.x, this.repulsorFlash.y, radius
                );
                gradient.addColorStop(0, `rgba(255, 200, 100, ${opacity * 0.6})`);
                gradient.addColorStop(0.4, `rgba(255, 152, 0, ${opacity * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.repulsorFlash.x, this.repulsorFlash.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /**
     * Dessine le fond étoilé
     */
    drawBackground() {
        const ctx = this.ctx;

        // Gradient de fond
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Étoiles
        this.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            ctx.fill();
        });
    }

    /**
     * Dessine la Terre
     */
    drawEarth() {
        const ctx = this.ctx;
        const earthRadius = 300;
        const earthY = this.canvas.height + earthRadius - 80;

        // Atmosphère (glow)
        const glowGradient = ctx.createRadialGradient(
            this.canvas.width / 2, earthY, earthRadius * 0.8,
            this.canvas.width / 2, earthY, earthRadius * 1.3
        );
        glowGradient.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(this.canvas.width / 2, earthY, earthRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Terre principale
        const earthGradient = ctx.createRadialGradient(
            this.canvas.width / 2 - 50, earthY - 100, 0,
            this.canvas.width / 2, earthY, earthRadius
        );
        earthGradient.addColorStop(0, '#4fc3f7');
        earthGradient.addColorStop(0.3, '#29b6f6');
        earthGradient.addColorStop(0.5, '#0288d1');
        earthGradient.addColorStop(0.7, '#01579b');
        earthGradient.addColorStop(1, '#002f6c');

        ctx.beginPath();
        ctx.arc(this.canvas.width / 2, earthY, earthRadius, 0, Math.PI * 2);
        ctx.fillStyle = earthGradient;
        ctx.fill();

        // Continents (formes simplifiées)
        ctx.fillStyle = '#2e7d32';

        // Continent gauche
        ctx.beginPath();
        ctx.ellipse(
            this.canvas.width / 2 - 100,
            earthY - 180,
            60, 40,
            -0.3, 0, Math.PI * 2
        );
        ctx.fill();

        // Continent droit
        ctx.beginPath();
        ctx.ellipse(
            this.canvas.width / 2 + 80,
            earthY - 150,
            50, 35,
            0.2, 0, Math.PI * 2
        );
        ctx.fill();

        // Nuages
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.ellipse(
            this.canvas.width / 2 - 50,
            earthY - 220,
            40, 15,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(
            this.canvas.width / 2 + 120,
            earthY - 200,
            35, 12,
            0.5, 0, Math.PI * 2
        );
        ctx.fill();
    }

    /**
     * Dessine le scientifique avec son laser
     */
    drawScientist() {
        const ctx = this.ctx;
        const x = this.scientist.x;
        const y = this.scientist.y;

        // Base/plateforme
        ctx.fillStyle = '#455a64';
        ctx.beginPath();
        ctx.ellipse(x, y + 20, 50, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Canon laser
        ctx.fillStyle = '#78909c';
        ctx.fillRect(x - 15, y - 40, 30, 50);

        // Tête du canon (orientée vers le haut)
        ctx.fillStyle = '#90a4ae';
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 40);
        ctx.lineTo(x, y - 70);
        ctx.lineTo(x + 20, y - 40);
        ctx.closePath();
        ctx.fill();

        // Détails du canon
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.arc(x, y - 55, 8, 0, Math.PI * 2);
        ctx.fill();

        // Lueur du canon
        const glow = ctx.createRadialGradient(x, y - 55, 0, x, y - 55, 20);
        glow.addColorStop(0, 'rgba(79, 195, 247, 0.5)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y - 55, 20, 0, Math.PI * 2);
        ctx.fill();

        // Scientifique (petit personnage à côté)
        // Corps
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 35, y - 25, 20, 30);

        // Tête
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(x + 45, y - 35, 12, 0, Math.PI * 2);
        ctx.fill();

        // Cheveux/casque
        ctx.fillStyle = '#5d4037';
        ctx.beginPath();
        ctx.arc(x + 45, y - 40, 10, Math.PI, Math.PI * 2);
        ctx.fill();

        // Lunettes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + 41, y - 35, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 49, y - 35, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 45, y - 35);
        ctx.lineTo(x + 45, y - 35);
        ctx.stroke();
    }

    /**
     * Crée un laser sur le canvas
     * @param {number} startX - Position X de départ
     * @param {number} startY - Position Y de départ
     * @param {number} endX - Position X de fin
     * @param {number} endY - Position Y de fin
     * @param {string} color - Couleur du laser (hex)
     * @returns {number} - Durée du voyage en ms
     */
    createCanvasLaser(startX, startY, endX, endY, color) {
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const travelTime = Math.max(150, Math.min(400, length / 2));

        this.activeLasers.push({
            startX,
            startY,
            endX,
            endY,
            color,
            startTime: Date.now(),
            duration: travelTime,
            length
        });

        return travelTime;
    }

    /**
     * Dessine les lasers actifs sur le canvas
     */
    drawLasers() {
        const ctx = this.ctx;
        const now = Date.now();

        // Filtrer et dessiner les lasers actifs
        this.activeLasers = this.activeLasers.filter(laser => {
            const elapsed = now - laser.startTime;
            const progress = elapsed / laser.duration;

            if (progress >= 1) {
                return false; // Supprimer ce laser
            }

            // Calculer l'opacité (fade in puis fade out)
            let opacity;
            if (progress < 0.15) {
                opacity = progress / 0.15; // Fade in
            } else if (progress > 0.7) {
                opacity = 1 - (progress - 0.7) / 0.3; // Fade out
            } else {
                opacity = 1;
            }

            // Convertir la couleur hex en RGB
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 79, g: 195, b: 247 };
            };
            const rgb = hexToRgb(laser.color);

            ctx.save();

            // Dessiner le laser (ligne épaisse avec glow)
            ctx.beginPath();
            ctx.moveTo(laser.startX, laser.startY);
            ctx.lineTo(laser.endX, laser.endY);

            // Glow externe
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.3})`;
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Glow moyen
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`;
            ctx.lineWidth = 12;
            ctx.stroke();

            // Coeur du laser
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.restore();

            return true; // Garder ce laser
        });
    }

    /**
     * Verifie la reponse du joueur
     * @param {number} answer - Reponse donnee
     */
    checkAnswer(answer) {
        // D'abord verifier si c'est pour un powerup actif
        if (this.checkPowerUpAnswer(answer)) {
            return; // Powerup collecte, pas besoin de verifier les asteroides
        }

        // Trouver l'asteroide correspondant a la reponse
        let matchingAsteroid = null;
        let maxY = -Infinity;

        // Chercher tous les asteroides avec cette reponse, prendre le plus proche de la Terre
        for (const asteroid of this.asteroids) {
            if (asteroid.answer === answer && asteroid.y > maxY) {
                maxY = asteroid.y;
                matchingAsteroid = asteroid;
            }
        }

        if (matchingAsteroid) {
            // Bonne reponse !
            this.handleCorrectAnswer(matchingAsteroid);

            if (this.multishotActive) {
                // Multi-tir : détruire aussi l'astéroïde le plus proche (peu importe sa réponse)
                const remaining = this.asteroids.filter(a => a !== matchingAsteroid && !a.isHit);
                if (remaining.length > 0) {
                    // Trouver le plus proche de la Terre (maxY)
                    let closest = remaining[0];
                    for (const a of remaining) {
                        if (a.y > closest.y) closest = a;
                    }
                    const center = closest.getCenter();
                    const profile = profileManager.getActiveProfile();
                    const laserColor = profile ? profile.accentColor : '#4fc3f7';
                    closest.isHit = true;
                    closest.hitColor = laserColor;
                    const travelTime = this.createCanvasLaser(this.scientist.x, this.scientist.y - 70, center.x, center.y, laserColor);
                    ui.createLaser(this.scientist.x, this.scientist.y - 70, center.x, center.y, laserColor);
                    setTimeout(() => {
                        ui.createExplosion(center.x, center.y);
                        audioManager.playExplosion();
                        ui.showPoints(center.x, center.y, 50);
                        this.score += 50;
                        this.asteroidsDestroyed++;
                        ui.updateScore(this.score);
                        if (this.gameMode === 'asteroids') {
                            ui.updateProgress(this.asteroidsDestroyed, this.targetAsteroids);
                            this.checkVictoryCondition();
                        }
                        const idx = this.asteroids.indexOf(closest);
                        if (idx > -1) this.asteroids.splice(idx, 1);
                        // Fragments si mode séparation
                        if (this.splitMode && closest.canSplit) {
                            const existingAnswers = this.getExistingAnswers();
                            const fragments = closest.createFragments(this.operationConfig, this.difficulty, existingAnswers);
                            fragments.forEach(f => {
                                if (this.slowdownActive) f.applySlowdown(0.5);
                                this.asteroids.push(f);
                            });
                        }
                    }, travelTime);
                }
            }
        } else if (this.asteroids.length > 0 || this.activePowerUp) {
            // Mauvaise reponse (aucun asteroide n'a cette reponse)
            this.handleWrongAnswer(answer);
        }
    }

    /**
     * Verifie si la reponse correspond au powerup actif
     * @param {number} answer - Reponse donnee
     * @returns {boolean} - True si le powerup a ete collecte
     */
    checkPowerUpAnswer(answer) {
        if (!this.activePowerUp || this.activePowerUp.answer !== answer) {
            return false;
        }

        // Collecte le powerup
        this.collectPowerUp();
        return true;
    }

    /**
     * Collecte le powerup actif
     */
    collectPowerUp() {
        if (!this.activePowerUp) return;

        const center = this.activePowerUp.getCenter();
        const type = this.activePowerUp.type;

        // Effets visuels et sonores
        ui.showPowerUpCollected(center.x, center.y, type);
        audioManager.playPowerUpCollect();
        ui.showSuccess();

        // Supprimer le powerup de l'ecran
        this.activePowerUp = null;

        // Extralife s'active immédiatement (pas de stockage)
        if (type === 'extralife') {
            if (this.lives < 4) {
                this.lives++;
                ui.addLife();
                ui.updateLives(this.lives);
            }
            return;
        }

        // Stocker le powerup (remplace le précédent)
        this.storedPowerUp = type;
        ui.updatePowerUpIcon(type);
    }

    /**
     * Gere une bonne reponse
     * @param {Asteroid} asteroid
     */
    handleCorrectAnswer(asteroid) {
        const center = asteroid.getCenter();

        // Enregistrer la bonne réponse pour les statistiques
        const profile = profileManager.getActiveProfile();
        const responseTime = Date.now() - this.questionStartTime;

        if (profile) {
            const answerData = {
                question: asteroid.question,
                correctAnswer: asteroid.answer,
                operationType: this.getOperationTypeFromOperator(asteroid.operator),
                table: asteroid.table || null,
                responseTime: responseTime
            };

            profileManager.recordCorrectAnswer(profile.id, answerData);

            if (this.currentSessionId) {
                profileManager.addSessionAnswer(profile.id, this.currentSessionId, answerData, true);
            }
        }

        // Réinitialiser le timer de question
        this.questionStartTime = Date.now();

        // Effet laser oriente vers l'asteroide
        // Utiliser la couleur du profil actif
        const laserColor = profile ? profile.accentColor : '#4fc3f7';

        // Créer le laser sur le canvas (évite les problèmes de positionnement DOM)
        const laserTravelTime = this.createCanvasLaser(this.scientist.x, this.scientist.y - 70, center.x, center.y, laserColor);

        // Effets DOM (flash, particules)
        ui.createLaser(this.scientist.x, this.scientist.y - 70, center.x, center.y, laserColor);
        audioManager.playLaser();

        // Marquer l'astéroïde comme "touché" pour le rendre visuellement différent
        asteroid.isHit = true;
        asteroid.hitColor = laserColor;

        // L'explosion se déclenche quand le laser atteint la cible
        setTimeout(() => {
            ui.createExplosion(center.x, center.y);
            audioManager.playExplosion();

            // Calcul des points
            const basePoints = 100;
            const timeBonus = asteroid.getTimeBonus();
            const points = Math.floor(basePoints * this.combo * timeBonus);

            // Afficher les points
            ui.showPoints(center.x, center.y, points);

            // Afficher message d'encouragement
            ui.showEncouragement(center.x, center.y - 40, this.combo, timeBonus);

            // Declencher confettis pour combos eleves (x5, x10, x15...)
            if (this.combo > 1 && this.combo % 5 === 0) {
                ui.createConfetti(center.x, center.y);
            }

            // Mise a jour score et combo
            this.score += points;
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            this.asteroidsDestroyed++;

            ui.updateScore(this.score);
            ui.updateCombo(this.combo);
            ui.showSuccess();

            // Mise a jour progression pour mode asteroides
            if (this.gameMode === 'asteroids') {
                ui.updateProgress(this.asteroidsDestroyed, this.targetAsteroids);
                this.checkVictoryCondition();
            }

            // Son combo si > 1
            if (this.combo > 2) {
                audioManager.playCombo();
            }

            // Supprimer l'asteroide de la liste
            const index = this.asteroids.indexOf(asteroid);
            if (index > -1) {
                this.asteroids.splice(index, 1);
            }

            // Mode separation : creer des fragments si l'asteroide peut se diviser
            if (this.splitMode && asteroid.canSplit) {
                const existingAnswers = this.getExistingAnswers();
                const fragments = asteroid.createFragments(this.operationConfig, this.difficulty, existingAnswers);
                fragments.forEach(fragment => {
                    if (this.slowdownActive) {
                        fragment.applySlowdown(0.5);
                    }
                    this.asteroids.push(fragment);
                });
            }

            // Chance de faire apparaitre un powerup (15%)
            this.trySpawnPowerUp();
        }, laserTravelTime);
    }

    /**
     * Tente de faire apparaitre un powerup (15% de chance)
     */
    trySpawnPowerUp() {
        // Ne pas spawn si un powerup est deja present ou si on en a deja un stocke
        if (this.activePowerUp) return;

        if (Math.random() < this.powerUpSpawnChance) {
            this.spawnPowerUp();
        }
    }

    /**
     * Fait apparaitre un powerup
     * @param {string} type - Type specifique (optionnel, aleatoire sinon)
     */
    spawnPowerUp(type = null) {
        const availableTypes = ['shield', 'freeze', 'repulsor', 'slowdown'];
        // Extralife uniquement si le joueur n'est pas à vies pleines (max 4)
        if (this.lives < 4) {
            availableTypes.push('extralife');
        }
        if (this.splitMode || this.armageddonMode) {
            availableTypes.push('multishot');
        }
        const existingAnswers = this.getExistingAnswers();
        let powerUp;
        let attempts = 0;
        do {
            powerUp = new PowerUp(
                this.canvas.width,
                this.canvas.height,
                this.operationConfig,
                this.difficulty,
                type,
                availableTypes
            );
            attempts++;
        } while (existingAnswers.has(powerUp.answer) && attempts < 50);
        this.activePowerUp = powerUp;
    }

    /**
     * Active le powerup stocke (appele avec la touche Espace)
     */
    activatePowerUp() {
        if (!this.storedPowerUp) return;

        const type = this.storedPowerUp;
        this.storedPowerUp = null;
        ui.updatePowerUpIcon(null);

        switch (type) {
            case 'shield':
                this.activateShield();
                break;
            case 'freeze':
                this.activateFreeze();
                break;
            case 'repulsor':
                this.activateRepulsor();
                break;
            case 'multishot':
                this.activateMultishot();
                break;
            case 'slowdown':
                this.activateSlowdown();
                break;
        }
    }

    /**
     * Active le bouclier - bloque le prochain impact
     */
    activateShield() {
        this.shieldActive = true;
        ui.createShieldEffect();
        audioManager.playShieldActivate();
    }

    /**
     * Active le gel - gele tous les asteroides pendant 5 secondes
     */
    activateFreeze() {
        this.freezeActive = true;
        this.freezeEndTime = Date.now() + 5000; // 5 secondes
        ui.createFreezeEffect();
        audioManager.playFreezeActivate();
    }

    /**
     * Active le repulseur - repousse tous les asteroides temporairement
     */
    activateRepulsor() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Effet visuel DOM (anneaux, particules, screen shake)
        ui.createRepulsorEffect(centerX, centerY);
        audioManager.playRepulsorActivate();

        // Flash canvas (radial gradient orange qui s'expand et fade)
        this.repulsorFlash = {
            x: centerX,
            y: centerY,
            startTime: Date.now(),
            duration: 300
        };

        // Repousser tous les asteroides pendant 3 secondes
        const repulsionDuration = 3000;
        for (const asteroid of this.asteroids) {
            asteroid.applyRepulsion(repulsionDuration);
        }
    }

    /**
     * Active le multi-tir — détruit tous les astéroïdes avec la même réponse pendant 10s
     */
    activateMultishot() {
        this.multishotActive = true;
        this.multishotEndTime = Date.now() + 10000;
        ui.showMultishotOverlay();
        audioManager.playShieldActivate(); // Réutiliser un son existant
    }

    /**
     * Active le ralentissement — ralentit tous les astéroïdes pendant 8s
     */
    activateSlowdown() {
        this.slowdownActive = true;
        this.slowdownEndTime = Date.now() + 8000;
        ui.showSlowdownOverlay();
        audioManager.playFreezeActivate(); // Réutiliser un son existant

        // Ralentir tous les astéroïdes existants
        for (const asteroid of this.asteroids) {
            asteroid.applySlowdown(0.5);
        }
    }

    /**
     * Gère une mauvaise réponse
     * @param {number} givenAnswer - Réponse donnée par le joueur
     */
    handleWrongAnswer(givenAnswer = null) {
        // Enregistrer l'erreur si on a des astéroïdes
        if (this.asteroids.length > 0 && givenAnswer !== null) {
            const profile = profileManager.getActiveProfile();
            const responseTime = Date.now() - this.questionStartTime;

            // Trouver l'astéroïde le plus proche de la Terre (celui que le joueur visait probablement)
            const closestAsteroid = this.asteroids.reduce((closest, current) =>
                current.y > closest.y ? current : closest
            );

            if (profile && closestAsteroid) {
                const errorData = {
                    question: closestAsteroid.question,
                    correctAnswer: closestAsteroid.answer,
                    givenAnswer: givenAnswer,
                    operationType: this.getOperationTypeFromOperator(closestAsteroid.operator),
                    table: closestAsteroid.table || null,
                    responseTime: responseTime
                };

                profileManager.recordError(profile.id, errorData);

                if (this.currentSessionId) {
                    profileManager.addSessionAnswer(profile.id, this.currentSessionId, errorData, false);
                }

                // Sauvegarder pour la révision de fin de partie
                this.sessionErrors.push(errorData);
            }
        }

        // Réinitialiser le timer de question
        this.questionStartTime = Date.now();

        this.combo = 1;
        ui.updateCombo(1);
        ui.showError('Mauvaise réponse !');
        audioManager.playWrong();
    }

    /**
     * Perd une vie
     */
    loseLife() {
        // Verifier si le bouclier est actif
        if (this.shieldActive) {
            this.shieldActive = false;
            ui.showShieldBlock();
            ui.removeShieldEffect();
            audioManager.playShieldBlock();
            return; // Le bouclier a absorbe l'impact
        }

        this.lives--;
        this.combo = 1;
        ui.updateLives(this.lives);
        ui.updateCombo(1);
        audioManager.playLifeLost();

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    /**
     * Fin de partie
     */
    gameOver() {
        this.isRunning = false;
        ui.hideNumpad();

        // Nettoyer le timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        cancelAnimationFrame(this.animationId);
        audioManager.stopMusic();
        audioManager.playGameOver();

        // Terminer la session de suivi
        const profile = profileManager.getActiveProfile();
        if (profile && this.currentSessionId) {
            profileManager.endSession(profile.id, this.currentSessionId, {
                score: this.score,
                maxCombo: this.maxCombo,
                destroyed: this.asteroidsDestroyed
            });
        }

        // Statistiques de la partie
        const gameStats = {
            score: this.score,
            maxCombo: this.maxCombo,
            destroyed: this.asteroidsDestroyed
        };

        // Mettre à jour les stats du profil actif
        profileManager.updateActiveProfileStats(gameStats);

        // Ajouter au leaderboard si score > 0
        if (this.score > 0) {
            profileManager.addLeaderboardEntry({
                score: this.score,
                mode: this.gameMode,
                difficulty: this.difficulty
            });
        }

        // Vérifier nouveau record (profil actif)
        const profileHighScore = profileManager.getActiveProfileHighScore();
        const isNewRecord = this.score >= profileHighScore && this.score > 0;

        // Mettre à jour l'ancien système de high score pour compatibilité
        const oldHighScore = this.getHighScore();
        if (this.score > oldHighScore) {
            this.saveHighScore(this.score);
        }
        ui.updateHighScore(profileHighScore > 0 ? profileHighScore : this.score);

        // Afficher l'écran game over avec les erreurs pour révision
        ui.showGameOver({
            score: this.score,
            maxCombo: this.maxCombo,
            destroyed: this.asteroidsDestroyed,
            isNewRecord: isNewRecord,
            errors: this.sessionErrors
        });
    }

    /**
     * Met le jeu en pause
     */
    pause() {
        if (!this.isRunning || this.isPaused) return;
        this.isPaused = true;
        audioManager.suspend();
        ui.showScreen('pause');
    }

    /**
     * Reprend le jeu
     */
    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.lastTime = performance.now();
        audioManager.resume();
        ui.showScreen('game');
        ui.focusInput();
    }

    /**
     * Quitte la partie
     */
    quit() {
        this.isRunning = false;
        this.isPaused = false;

        // Nettoyer le timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        // Nettoyer les powerups
        this.activePowerUp = null;
        this.storedPowerUp = null;
        this.shieldActive = false;
        this.freezeActive = false;
        this.multishotActive = false;
        this.multishotEndTime = 0;
        this.slowdownActive = false;
        this.slowdownEndTime = 0;
        this.repulsorFlash = null;
        ui.updatePowerUpIcon(null);
        ui.removeShieldEffect();
        if (ui.freezeOverlay) {
            ui.freezeOverlay.remove();
            ui.freezeOverlay = null;
        }
        ui.hideMultishotOverlay();
        ui.hideSlowdownOverlay();
        ui.hideNumpad();

        cancelAnimationFrame(this.animationId);
        audioManager.stopMusic();
        ui.showScreen('menu');
    }

    /**
     * Récupère le meilleur score
     * @returns {number}
     */
    getHighScore() {
        return parseInt(localStorage.getItem('mathGameHighScore') || '0');
    }

    /**
     * Sauvegarde le meilleur score
     * @param {number} score
     */
    saveHighScore(score) {
        localStorage.setItem('mathGameHighScore', score.toString());
    }

    /**
     * Démarre le mode révision avec des questions spécifiques
     * @param {Array} errors - Liste des erreurs à retravailler
     */
    async startReviewMode(errors) {
        if (!errors || errors.length === 0) return;

        // Initialiser l'audio au premier clic
        await audioManager.init();

        this.isReviewMode = true;
        this.reviewQuestions = errors.map(e => ({
            question: e.question,
            answer: e.correctAnswer,
            operationType: e.operationType,
            table: e.table
        }));
        this.reviewIndex = 0;

        // Configuration basique pour le mode révision
        this.difficulty = 'medium';
        this.tables = [1, 2, 3, 4, 5];

        // Reset etat
        this.score = 0;
        this.lives = 3;
        this.combo = 1;
        this.maxCombo = 1;
        this.asteroidsDestroyed = 0;
        this.asteroids = [];
        this.lastSpawn = 0;
        this.isRunning = true;
        this.isPaused = false;
        this.hasWon = false;

        // Reset powerups
        this.activePowerUp = null;
        this.storedPowerUp = null;
        this.shieldActive = false;
        this.freezeActive = false;
        this.freezeEndTime = 0;
        this.multishotActive = false;
        this.multishotEndTime = 0;
        this.slowdownActive = false;
        this.slowdownEndTime = 0;
        this.repulsorFlash = null;
        ui.updatePowerUpIcon(null);
        ui.removeShieldEffect();
        ui.hideMultishotOverlay();
        ui.hideSlowdownOverlay();

        // Mode astéroïdes avec le nombre d'erreurs comme cible
        this.gameMode = 'asteroids';
        this.targetAsteroids = errors.length;

        // Nettoyer le timer précédent
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        // Session de suivi
        const profile = profileManager.getActiveProfile();
        if (profile) {
            this.currentSessionId = profileManager.startSession(profile.id, {
                mode: 'review',
                difficulty: this.difficulty,
                operation: { type: 'review' }
            });
        }
        this.sessionErrors = [];
        this.questionStartTime = Date.now();

        // Mise à jour UI
        ui.updateScore(0);
        ui.updateCombo(1);
        ui.resetLives();
        ui.setupModeDisplay('asteroids', 0, errors.length);
        ui.showScreen('game');

        // Mobile : afficher le numpad custom automatiquement
        if (this.isMobile) {
            ui.answerInput.readOnly = true;
            ui.showNumpad();
        } else {
            ui.answerInput.readOnly = false;
            const toggleBtn = document.getElementById('numpad-toggle-btn');
            if (toggleBtn) toggleBtn.classList.remove('hidden');
        }

        // Démarrer la musique
        audioManager.startMusic();

        // Lancer la boucle de jeu
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    /**
     * Spawn un astéroïde avec une question de révision
     */
    spawnReviewAsteroid() {
        if (this.reviewIndex >= this.reviewQuestions.length) {
            // Plus de questions de révision, terminer
            return;
        }

        const reviewQ = this.reviewQuestions[this.reviewIndex];
        this.reviewIndex++;

        // Créer un astéroïde personnalisé avec la question de révision
        const asteroid = new Asteroid(
            this.canvas.width,
            this.canvas.height,
            this.operationConfig,
            this.difficulty
        );

        // Remplacer la question par celle de la révision
        asteroid.question = reviewQ.question;
        asteroid.answer = reviewQ.answer;
        asteroid.table = reviewQ.table;

        this.asteroids.push(asteroid);
    }
}

// Lancer le jeu au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
