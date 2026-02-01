/**
 * Classe representant un PowerUp collectible
 * Types: shield (bouclier), freeze (gel), repulsor (repulseur)
 */
class PowerUp {
    /**
     * @param {number} canvasWidth - Largeur du canvas
     * @param {number} canvasHeight - Hauteur du canvas
     * @param {number[]} tables - Tables de multiplication a utiliser
     * @param {string} difficulty - Niveau de difficulte
     * @param {string} type - Type de powerup (shield, freeze, repulsor)
     */
    constructor(canvasWidth, canvasHeight, tables, difficulty, type = null) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Type de powerup (aleatoire si non specifie)
        const types = ['shield', 'freeze', 'repulsor'];
        this.type = type || types[Math.floor(Math.random() * types.length)];

        // Generer la multiplication
        this.table = tables[Math.floor(Math.random() * tables.length)];
        this.multiplier = Math.floor(Math.random() * 10) + 1;
        this.answer = this.table * this.multiplier;
        this.question = `${this.table} x ${this.multiplier}`;

        // Taille et position
        this.size = 45;
        this.x = Math.random() * (canvasWidth - this.size * 2) + this.size;
        this.y = -this.size;

        // Vitesse (un peu plus lent que les asteroides)
        const speeds = {
            easy: 0.6,
            medium: 1.0,
            hard: 1.8
        };
        this.baseSpeed = speeds[difficulty] || speeds.medium;

        // Direction vers la Terre
        this.targetX = canvasWidth / 2;
        this.targetY = canvasHeight;
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / distance) * this.baseSpeed;
        this.velocityY = (dy / distance) * this.baseSpeed;

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
        const earthZone = this.canvasHeight - 120;
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
