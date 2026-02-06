/**
 * Classe representant un PowerUp collectible
 * Types: shield (bouclier), freeze (gel), repulsor (repulseur)
 */
class PowerUp {
    /**
     * @param {number} canvasWidth - Largeur du canvas
     * @param {number} canvasHeight - Hauteur du canvas
     * @param {Object} operationConfig - Configuration de l'opération
     * @param {string} difficulty - Niveau de difficulte
     * @param {string} type - Type de powerup (shield, freeze, repulsor)
     */
    constructor(canvasWidth, canvasHeight, operationConfig, difficulty, type = null, availableTypes = null) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Type de powerup (aleatoire parmi les types disponibles si non specifie)
        const types = availableTypes || ['shield', 'freeze', 'repulsor', 'extralife', 'slowdown'];
        this.type = type || types[Math.floor(Math.random() * types.length)];

        // Generer la question via QuestionGenerator
        const generator = new QuestionGenerator(operationConfig);
        const q = generator.generate();

        this.question = q.question;
        this.answer = q.answer;
        this.operator = q.operator;
        this.table = q.table || null;

        // Taille et position
        this.size = 45;
        this.x = Math.random() * (canvasWidth - this.size * 2) + this.size;
        this.y = -this.size;

        // Temps cible en secondes (un peu plus lent que les astéroïdes)
        const travelTimes = { easy: 14, medium: 9, hard: 5 };
        this.targetTravelTime = travelTimes[difficulty] || travelTimes.medium;

        // Zone terre proportionnelle
        const REFERENCE_HEIGHT = 1080;
        this.earthMargin = 120 * (canvasHeight / REFERENCE_HEIGHT);

        // Direction vers la Terre
        this.targetX = canvasWidth / 2;
        this.targetY = canvasHeight - this.earthMargin;
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const totalDistance = Math.sqrt(dx * dx + dy * dy);

        // Vitesse = distance / (temps * 60 frames/s)
        this.baseSpeed = totalDistance / (this.targetTravelTime * 60);
        this.velocityX = (dx / totalDistance) * this.baseSpeed;
        this.velocityY = (dy / totalDistance) * this.baseSpeed;

        // Animation
        this.rotation = 0;
        this.rotationSpeed = 0.02;
        this.pulsePhase = 0;

        // Couleurs selon le type
        this.colors = this.getTypeColors();

        // Etat
        this.active = true;
        this.spawnTime = Date.now();
    }

    /**
     * Retourne les couleurs selon le type de powerup
     */
    getTypeColors() {
        switch (this.type) {
            case 'shield':
                return {
                    primary: '#00ffff',
                    secondary: '#0088aa',
                    glow: 'rgba(0, 255, 255, 0.5)'
                };
            case 'freeze':
                return {
                    primary: '#69f0ae',
                    secondary: '#00c853',
                    glow: 'rgba(105, 240, 174, 0.5)'
                };
            case 'repulsor':
                return {
                    primary: '#ff9800',
                    secondary: '#e65100',
                    glow: 'rgba(255, 152, 0, 0.5)'
                };
            case 'extralife':
                return {
                    primary: '#ff4081',
                    secondary: '#c51162',
                    glow: 'rgba(255, 64, 129, 0.5)'
                };
            case 'multishot':
                return {
                    primary: '#ffd740',
                    secondary: '#ff6f00',
                    glow: 'rgba(255, 215, 64, 0.5)'
                };
            case 'slowdown':
                return {
                    primary: '#b388ff',
                    secondary: '#6200ea',
                    glow: 'rgba(179, 136, 255, 0.5)'
                };
            default:
                return {
                    primary: '#ffffff',
                    secondary: '#aaaaaa',
                    glow: 'rgba(255, 255, 255, 0.5)'
                };
        }
    }

    /**
     * Met a jour la position du powerup
     * @param {number} deltaTime - Temps ecoule
     * @param {boolean} frozen - Si le jeu est gele (powerups continuent de bouger)
     * @returns {boolean} - True si le powerup a touche la Terre
     */
    update(deltaTime, frozen = false) {
        if (!this.active) return false;

        // Les powerups bougent toujours, meme si le jeu est gele
        const speedFactor = deltaTime * 0.06;
        this.x += this.velocityX * speedFactor;
        this.y += this.velocityY * speedFactor;

        // Animation
        this.rotation += this.rotationSpeed * deltaTime;
        this.pulsePhase += deltaTime * 0.005;

        // Verifier si touche la zone de la Terre
        const earthZone = this.canvasHeight - this.earthMargin;
        if (this.y + this.size > earthZone) {
            return true; // PowerUp perdu
        }

        return false;
    }

    /**
     * Dessine le powerup sur le canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Effet de pulsation
        const pulse = 1 + Math.sin(this.pulsePhase) * 0.1;

        // Lueur externe
        const glowSize = this.size * 1.5 * pulse;
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        glowGradient.addColorStop(0, this.colors.glow);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Corps hexagonal du powerup
        ctx.save();
        ctx.rotate(this.rotation);

        const hexSize = this.size * pulse;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const px = Math.cos(angle) * hexSize;
            const py = Math.sin(angle) * hexSize;
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();

        // Gradient du corps
        const bodyGradient = ctx.createRadialGradient(-10, -10, 0, 0, 0, hexSize);
        bodyGradient.addColorStop(0, this.colors.primary);
        bodyGradient.addColorStop(1, this.colors.secondary);
        ctx.fillStyle = bodyGradient;
        ctx.fill();

        // Bordure
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();

        // Icone au centre
        this.drawIcon(ctx, pulse);

        ctx.restore();

        // Question (au-dessus du powerup)
        this.drawQuestion(ctx);
    }

    /**
     * Dessine l'icone du powerup selon son type
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} pulse - Facteur de pulsation
     */
    drawIcon(ctx, pulse) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        const iconSize = 15 * pulse;

        switch (this.type) {
            case 'shield':
                // Bouclier
                ctx.beginPath();
                ctx.moveTo(0, -iconSize);
                ctx.lineTo(iconSize, -iconSize * 0.3);
                ctx.lineTo(iconSize, iconSize * 0.3);
                ctx.lineTo(0, iconSize);
                ctx.lineTo(-iconSize, iconSize * 0.3);
                ctx.lineTo(-iconSize, -iconSize * 0.3);
                ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
                ctx.fill();
                break;

            case 'freeze':
                // Flocon de neige
                for (let i = 0; i < 6; i++) {
                    ctx.save();
                    ctx.rotate((i / 6) * Math.PI * 2);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -iconSize);
                    ctx.moveTo(0, -iconSize * 0.5);
                    ctx.lineTo(-iconSize * 0.3, -iconSize * 0.7);
                    ctx.moveTo(0, -iconSize * 0.5);
                    ctx.lineTo(iconSize * 0.3, -iconSize * 0.7);
                    ctx.stroke();
                    ctx.restore();
                }
                break;

            case 'repulsor':
                // Ondes d'explosion
                for (let i = 1; i <= 3; i++) {
                    ctx.beginPath();
                    ctx.arc(0, 0, iconSize * i * 0.3, 0, Math.PI * 2);
                    ctx.stroke();
                }
                // Point central
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                break;

            case 'extralife':
                // Coeur
                ctx.beginPath();
                ctx.moveTo(0, iconSize * 0.3);
                ctx.bezierCurveTo(-iconSize, -iconSize * 0.3, -iconSize * 0.5, -iconSize, 0, -iconSize * 0.4);
                ctx.bezierCurveTo(iconSize * 0.5, -iconSize, iconSize, -iconSize * 0.3, 0, iconSize * 0.3);
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 64, 129, 0.6)';
                ctx.fill();
                ctx.stroke();
                break;

            case 'multishot':
                // Éclair
                ctx.beginPath();
                ctx.moveTo(-iconSize * 0.2, -iconSize);
                ctx.lineTo(iconSize * 0.1, -iconSize * 0.15);
                ctx.lineTo(-iconSize * 0.05, -iconSize * 0.15);
                ctx.lineTo(iconSize * 0.2, iconSize);
                ctx.lineTo(-iconSize * 0.1, iconSize * 0.15);
                ctx.lineTo(iconSize * 0.05, iconSize * 0.15);
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 215, 64, 0.6)';
                ctx.fill();
                ctx.stroke();
                break;

            case 'slowdown':
                // Horloge (cercle + aiguilles)
                ctx.beginPath();
                ctx.arc(0, 0, iconSize * 0.8, 0, Math.PI * 2);
                ctx.stroke();
                // Aiguille des heures
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -iconSize * 0.5);
                ctx.stroke();
                // Aiguille des minutes
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(iconSize * 0.4, 0);
                ctx.stroke();
                // Point central
                ctx.beginPath();
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                break;
        }
    }

    /**
     * Dessine la question au-dessus du powerup
     * @param {CanvasRenderingContext2D} ctx
     */
    drawQuestion(ctx) {
        ctx.save();

        const bubbleWidth = 100;
        const bubbleHeight = 40;
        const bubbleX = this.x - bubbleWidth / 2;
        const bubbleY = this.y - this.size - 55;

        // Bulle avec couleur du type
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
        ctx.fill();

        // Bordure coloree selon le type
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Petite pointe vers le powerup
        ctx.beginPath();
        ctx.moveTo(this.x - 8, bubbleY + bubbleHeight);
        ctx.lineTo(this.x, bubbleY + bubbleHeight + 10);
        ctx.lineTo(this.x + 8, bubbleY + bubbleHeight);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fill();
        ctx.strokeStyle = this.colors.primary;
        ctx.stroke();

        // Texte de la question
        ctx.fillStyle = this.colors.primary;
        ctx.font = 'bold 18px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.question, this.x, bubbleY + bubbleHeight / 2);

        // Indicateur de type (petit icone)
        const typeIcon = this.getTypeEmoji();
        ctx.font = '12px sans-serif';
        ctx.fillText(typeIcon, bubbleX + 15, bubbleY + 12);

        ctx.restore();
    }

    /**
     * Retourne un emoji representant le type
     */
    getTypeEmoji() {
        switch (this.type) {
            case 'shield': return '\u{1F6E1}'; // Bouclier
            case 'freeze': return '\u{2744}';  // Flocon
            case 'repulsor': return '\u{1F4A5}'; // Explosion
            case 'extralife': return '\u{2764}'; // Coeur
            case 'multishot': return '\u{26A1}'; // Éclair
            case 'slowdown': return '\u{1F570}'; // Horloge
            default: return '\u{2728}';
        }
    }

    /**
     * Retourne le nom du powerup en francais
     */
    getTypeName() {
        switch (this.type) {
            case 'shield': return 'Bouclier';
            case 'freeze': return 'Gel';
            case 'repulsor': return 'Repulseur';
            case 'extralife': return 'Vie bonus';
            case 'multishot': return 'Multi-tir';
            case 'slowdown': return 'Ralenti';
            default: return 'PowerUp';
        }
    }

    /**
     * Obtient la position centrale du powerup
     */
    getCenter() {
        return { x: this.x, y: this.y };
    }

    /**
     * Desactive le powerup
     */
    destroy() {
        this.active = false;
    }
}
