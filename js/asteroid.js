/**
 * Classe représentant un astéroïde avec une question mathématique
 */
class Asteroid {
    /**
     * @param {number} canvasWidth - Largeur du canvas
     * @param {number} canvasHeight - Hauteur du canvas
     * @param {Object} operationConfig - Configuration de l'opération
     * @param {string} difficulty - Niveau de difficulté (easy, medium, hard)
     */
    constructor(canvasWidth, canvasHeight, operationConfig, difficulty, options = {}) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Stocker la config pour la création de fragments
        this.operationConfig = operationConfig;

        // Générer la question via QuestionGenerator
        const generator = new QuestionGenerator(operationConfig);
        const q = generator.generate();

        this.question = q.question;
        this.answer = q.answer;
        this.operator = q.operator;
        this.table = q.table || null; // Table concernée (pour multiplication/division)

        // Position initiale (en haut, position X aléatoire)
        this.size = options.size || 60;
        this.x = options.x !== undefined ? options.x : Math.random() * (canvasWidth - this.size * 2) + this.size;
        this.y = options.y !== undefined ? options.y : -this.size;

        // Temps cible en secondes par difficulté
        const travelTimes = { easy: 12, medium: 7, hard: 4 };
        this.targetTravelTime = travelTimes[difficulty] || travelTimes.medium;

        // Zone terre proportionnelle
        const REFERENCE_HEIGHT = 1080;
        this.earthMargin = 120 * (canvasHeight / REFERENCE_HEIGHT);

        // Direction vers la Terre (centre-bas de l'écran)
        this.targetX = canvasWidth / 2;
        this.targetY = canvasHeight - this.earthMargin;
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const totalDistance = Math.sqrt(dx * dx + dy * dy);

        // Vitesse = distance / (temps * 60 frames/s)
        this.baseSpeed = totalDistance / (this.targetTravelTime * 60);
        this.speed = this.baseSpeed;
        this.velocityX = (dx / totalDistance) * this.baseSpeed;
        this.velocityY = (dy / totalDistance) * this.baseSpeed;

        // Animation de rotation (réduite pour être plus fluide)
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.015;

        // Mode séparation
        this.canSplit = options.canSplit !== undefined ? options.canSplit : true;
        this.isFragment = options.isFragment || false;

        // Couleurs aléatoires pour variété
        this.colors = this.generateColors();

        // Etat
        this.active = true;
        this.exploding = false;
        this.explosionFrame = 0;
        this.isHit = false; // Touche par le laser (en attente d'explosion)

        // Timestamp pour bonus temps
        this.spawnTime = Date.now();

        // Repulsion (powerup repulseur)
        this.repelled = false;
        this.repulsionEndTime = 0;
        this.originalVelocityX = this.velocityX;
        this.originalVelocityY = this.velocityY;

        // Slowdown (powerup ralentissement)
        this.slowdownFactor = 1;
    }

    /**
     * Active l'effet de repulsion sur cet asteroide
     * @param {number} duration - Duree en ms
     */
    applyRepulsion(duration) {
        this.repelled = true;
        this.repulsionEndTime = Date.now() + duration;
        // Inverser la velocite (recule)
        this.velocityX = -this.originalVelocityX * 1.5;
        this.velocityY = -this.originalVelocityY * 1.5;
    }

    /**
     * Desactive l'effet de repulsion
     */
    endRepulsion() {
        this.repelled = false;
        // Recalculer la direction vers la Terre depuis la position actuelle
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            this.velocityX = (dx / distance) * this.baseSpeed;
            this.velocityY = (dy / distance) * this.baseSpeed;
        }
        this.originalVelocityX = this.velocityX;
        this.originalVelocityY = this.velocityY;
    }

    /**
     * Applique un ralentissement
     * @param {number} factor - Facteur de ralentissement (ex: 0.5)
     */
    applySlowdown(factor) {
        if (this.slowdownFactor !== 1) return; // Déjà ralenti
        this.slowdownFactor = factor;
        this.velocityX *= factor;
        this.velocityY *= factor;
        this.originalVelocityX *= factor;
        this.originalVelocityY *= factor;
    }

    /**
     * Retire le ralentissement
     */
    removeSlowdown() {
        if (this.slowdownFactor === 1) return;
        const inverseFactor = 1 / this.slowdownFactor;
        this.velocityX *= inverseFactor;
        this.velocityY *= inverseFactor;
        this.originalVelocityX *= inverseFactor;
        this.originalVelocityY *= inverseFactor;
        this.slowdownFactor = 1;
    }

    /**
     * Génère des couleurs pour l'astéroïde
     */
    generateColors() {
        const hue = Math.random() * 60 + 15; // Teintes marron/orange
        return {
            main: `hsl(${hue}, 40%, 35%)`,
            light: `hsl(${hue}, 35%, 50%)`,
            dark: `hsl(${hue}, 45%, 20%)`,
            crater: `hsl(${hue}, 50%, 15%)`
        };
    }

    /**
     * Met a jour la position de l'asteroide
     * @param {number} deltaTime - Temps ecoule depuis la derniere frame
     * @returns {boolean} - True si l'asteroide a touche le bas
     */
    update(deltaTime) {
        if (!this.active) return false;

        // Verifier fin de repulsion
        if (this.repelled && Date.now() >= this.repulsionEndTime) {
            this.endRepulsion();
        }

        // Mouvement (direction calculee au spawn ou inversee si repousse)
        const speedFactor = deltaTime * 0.06;
        this.x += this.velocityX * speedFactor;
        this.y += this.velocityY * speedFactor;

        // Limiter la position pendant la repulsion (ne pas sortir de l'ecran)
        if (this.repelled) {
            if (this.y < -this.size) {
                this.y = -this.size;
            }
            if (this.x < this.size) {
                this.x = this.size;
            }
            if (this.x > this.canvasWidth - this.size) {
                this.x = this.canvasWidth - this.size;
            }
        }

        // Rotation
        this.rotation += this.rotationSpeed * deltaTime;

        // Verifier si touche la zone de la Terre (bas de l'ecran)
        const earthZone = this.canvasHeight - this.earthMargin;
        if (this.y + this.size > earthZone) {
            return true;
        }

        return false;
    }

    /**
     * Dessine l'astéroïde sur le canvas
     * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
     */
    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Effet de halo lumineux quand touché par le laser
        if (this.isHit) {
            // Convertir la couleur hex en RGB
            const color = this.hitColor || '#4fc3f7';
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 79, g: 195, b: 247 };
            };
            const rgb = hexToRgb(color);

            // Halo coloré pulsant autour de l'astéroïde
            const hitGlow = ctx.createRadialGradient(0, 0, this.size * 0.5, 0, 0, this.size * 1.8);
            hitGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
            hitGlow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
            hitGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = hitGlow;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Flash blanc au centre
            const flashGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.8);
            flashGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            flashGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            flashGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = flashGlow;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Corps principal de l'astéroïde (forme irrégulière)
        ctx.beginPath();
        const points = 8;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radiusVar = this.size * (0.8 + Math.sin(i * 2.5) * 0.2);
            const px = Math.cos(angle) * radiusVar;
            const py = Math.sin(angle) * radiusVar;
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();

        // Gradient pour effet 3D (plus lumineux si touché)
        const gradient = ctx.createRadialGradient(-10, -10, 0, 0, 0, this.size);
        if (this.isHit) {
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, this.colors.light);
            gradient.addColorStop(0.6, this.colors.main);
            gradient.addColorStop(1, this.colors.dark);
        } else {
            gradient.addColorStop(0, this.colors.light);
            gradient.addColorStop(0.5, this.colors.main);
            gradient.addColorStop(1, this.colors.dark);
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        // Contour (couleur du profil si touché)
        ctx.strokeStyle = this.isHit ? (this.hitColor || '#4fc3f7') : this.colors.dark;
        ctx.lineWidth = this.isHit ? 3 : 2;
        ctx.stroke();

        // Cratères
        this.drawCrater(ctx, -15, -10, 12);
        this.drawCrater(ctx, 20, 5, 8);
        this.drawCrater(ctx, -5, 20, 10);

        ctx.restore();

        // Question (ne tourne pas avec l'astéroïde)
        this.drawQuestion(ctx);
    }

    /**
     * Dessine un cratère
     */
    drawCrater(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colors.crater;
        ctx.fill();

        // Highlight du cratère
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = this.colors.dark;
        ctx.fill();
    }

    /**
     * Dessine la question de multiplication
     */
    drawQuestion(ctx) {
        ctx.save();

        // Fond de la bulle
        const textWidth = ctx.measureText(this.question).width;
        const padding = 15;
        const bubbleWidth = 100;
        const bubbleHeight = 40;
        const bubbleX = this.x - bubbleWidth / 2;
        const bubbleY = this.y - this.size - 50;

        // Bulle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
        ctx.fill();

        // Bordure
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Petite pointe vers l'astéroïde
        ctx.beginPath();
        ctx.moveTo(this.x - 8, bubbleY + bubbleHeight);
        ctx.lineTo(this.x, bubbleY + bubbleHeight + 10);
        ctx.lineTo(this.x + 8, bubbleY + bubbleHeight);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#4fc3f7';
        ctx.stroke();

        // Texte
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.question, this.x, bubbleY + bubbleHeight / 2);

        ctx.restore();
    }

    /**
     * Vérifie si une réponse est correcte
     * @param {number} userAnswer - Réponse du joueur
     * @returns {boolean}
     */
    checkAnswer(userAnswer) {
        return userAnswer === this.answer;
    }

    /**
     * Calcule le bonus de temps (réponse rapide)
     * @returns {number} - Multiplicateur de bonus (1.0 à 2.0)
     */
    getTimeBonus() {
        const elapsed = (Date.now() - this.spawnTime) / 1000;
        if (elapsed < 2) return 2.0;
        if (elapsed < 4) return 1.5;
        if (elapsed < 6) return 1.2;
        return 1.0;
    }

    /**
     * Désactive l'astéroïde (détruit)
     */
    destroy() {
        this.active = false;
    }

    /**
     * Obtient la position centrale de l'astéroïde
     */
    getCenter() {
        return { x: this.x, y: this.y };
    }

    /**
     * Crée 2 fragments à partir de cet astéroïde (mode séparation)
     * @param {Object} operationConfig - Configuration de l'opération
     * @param {string} difficulty - Niveau de difficulté
     * @returns {Asteroid[]} - Les 2 fragments créés
     */
    createFragments(operationConfig, difficulty, existingAnswers = new Set()) {
        const fragments = [];
        const usedAnswers = new Set(existingAnswers);
        for (let i = 0; i < 2; i++) {
            let fragment;
            let attempts = 0;
            do {
                fragment = new Asteroid(
                    this.canvasWidth,
                    this.canvasHeight,
                    operationConfig,
                    difficulty,
                    {
                        x: this.x + (i === 0 ? -30 : 30),
                        y: this.y,
                        size: this.size * 0.6,
                        canSplit: false,
                        isFragment: true
                    }
                );
                attempts++;
            } while (usedAnswers.has(fragment.answer) && attempts < 50);
            usedAnswers.add(fragment.answer);
            fragments.push(fragment);
        }
        return fragments;
    }
}
