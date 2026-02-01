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

        // Animation
        this.lastTime = 0;
        this.animationId = null;

        // Scientifique/Canon position
        this.scientist = {
            x: 0,
            y: 0,
            width: 80,
            height: 100
        };

        // Initialisation
        this.resize();
        window.addEventListener('resize', () => this.resize());

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
            onToggleSplitMode: (enabled) => this.splitMode = enabled
        });

        // Event listener pour la touche Espace (activation powerup)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isRunning && !this.isPaused) {
                e.preventDefault();
                this.activatePowerUp();
            }
        });

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
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Mettre à jour la position du scientifique
        this.scientist.x = this.canvas.width / 2;
        this.scientist.y = this.canvas.height - 60;

        // Régénérer les étoiles
        this.generateStars();
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
        ui.updatePowerUpIcon(null);
        ui.removeShieldEffect();
        if (ui.freezeOverlay) {
            ui.freezeOverlay.remove();
            ui.freezeOverlay = null;
        }

        // Configurer le mode de jeu
        if (modeConfig) {
            this.gameMode = modeConfig.mode;
            this.remainingTime = modeConfig.time || 0;
            this.targetAsteroids = modeConfig.count || 0;
        } else {
            this.gameMode = 'infinite';
            this.remainingTime = 0;
            this.targetAsteroids = 0;
        }

        // Nettoyer le timer précédent
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        // Mise à jour UI
        ui.updateScore(0);
        ui.updateCombo(1);
        ui.resetLives();
        ui.setupModeDisplay(this.gameMode, this.remainingTime, this.targetAsteroids);
        ui.showScreen('game');

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

        // Nettoyer le timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        cancelAnimationFrame(this.animationId);
        audioManager.stopMusic();

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

        // Spawn de nouveaux asteroides (sauf si gele)
        const maxAst = this.maxAsteroids[this.difficulty];
        const delay = this.spawnDelay[this.difficulty];

        if (!this.freezeActive && this.asteroids.length < maxAst && currentTime - this.lastSpawn > delay) {
            this.spawnAsteroid();
            this.lastSpawn = currentTime;
        }

        // Mise a jour des asteroides (sauf si geles)
        if (!this.freezeActive) {
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
                const asteroid = this.asteroids[i];
                const hitEarth = asteroid.update(deltaTime);

                if (hitEarth) {
                    // Effet d'impact sur la Terre
                    const center = asteroid.getCenter();
                    ui.createEarthImpact(center.x, this.canvas.height - 100, asteroid.size);
                    // Afficher la bonne reponse manquee
                    ui.showMissedAnswer(center.x, this.canvas.height - 150, asteroid.question, asteroid.answer);
                    audioManager.playExplosion();

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
        return answers;
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
                this.tables,
                this.difficulty
            );
            attempts++;
        } while (existingAnswers.has(asteroid.answer) && attempts < maxAttempts);

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

        // Asteroides
        this.asteroids.forEach(asteroid => asteroid.draw(ctx));

        // PowerUp actif
        if (this.activePowerUp) {
            this.activePowerUp.draw(ctx);
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
        } else if (this.asteroids.length > 0 || this.activePowerUp) {
            // Mauvaise reponse (aucun asteroide n'a cette reponse)
            this.handleWrongAnswer();
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

        // Si on a deja un powerup stocke, on le remplace
        this.storedPowerUp = type;

        // Effets visuels et sonores
        ui.showPowerUpCollected(center.x, center.y, type);
        ui.updatePowerUpIcon(type);
        audioManager.playPowerUpCollect();
        ui.showSuccess();

        // Supprimer le powerup de l'ecran
        this.activePowerUp = null;
    }

    /**
     * Gere une bonne reponse
     * @param {Asteroid} asteroid
     */
    handleCorrectAnswer(asteroid) {
        const center = asteroid.getCenter();

        // Effet laser oriente vers l'asteroide - retourne le temps de voyage
        const laserTravelTime = ui.createLaser(this.scientist.x, this.scientist.y - 70, center.x, center.y);
        audioManager.playLaser();

        // Marquer l'astéroïde comme "touché" pour le rendre visuellement différent
        asteroid.isHit = true;

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
                const fragments = asteroid.createFragments(this.tables, this.difficulty);
                fragments.forEach(fragment => this.asteroids.push(fragment));
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
        this.activePowerUp = new PowerUp(
            this.canvas.width,
            this.canvas.height,
            this.tables,
            this.difficulty,
            type
        );
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

        // Effet visuel
        ui.createRepulsorEffect(centerX, centerY);
        audioManager.playRepulsorActivate();

        // Repousser tous les asteroides pendant 3 secondes
        const repulsionDuration = 3000;
        for (const asteroid of this.asteroids) {
            asteroid.applyRepulsion(repulsionDuration);
        }
    }

    /**
     * Gère une mauvaise réponse
     */
    handleWrongAnswer() {
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

        // Nettoyer le timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        cancelAnimationFrame(this.animationId);
        audioManager.stopMusic();
        audioManager.playGameOver();

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

        // Afficher l'écran game over
        ui.showGameOver({
            score: this.score,
            maxCombo: this.maxCombo,
            destroyed: this.asteroidsDestroyed,
            isNewRecord: isNewRecord
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
        ui.updatePowerUpIcon(null);
        ui.removeShieldEffect();
        if (ui.freezeOverlay) {
            ui.freezeOverlay.remove();
            ui.freezeOverlay = null;
        }

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
}

// Lancer le jeu au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
