/**
 * Système de répétition espacée — algorithme SM-2 adapté au jeu
 *
 * Chaque "carte" = une question mathématique unique (opérateur + table + réponse).
 * La qualité (0-5) est calculée automatiquement à partir de :
 *   - la correction (juste / faux)
 *   - le temps de réponse comparé à la moyenne historique du joueur
 *
 * Intervalles SM-2 :
 *   répétitions 0 → 1 jour
 *   répétitions 1 → 6 jours
 *   répétitions N → round(intervalle × EF)
 * EF (easiness factor) : démarre à 2.5, descend si difficile, remonte si facile.
 */
class SpacedRepetition {

    /**
     * @param {string} profileId - ID du profil actif
     */
    constructor(profileId) {
        this.profileId = profileId;
        this.storageKey = `sr_cards_${profileId}`;
        this.cards = this._load();
    }

    // ── Persistance ─────────────────────────────────────────────────────────

    _load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    _save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cards));
        } catch (e) {
            console.warn('SpacedRepetition: erreur de sauvegarde', e);
        }
    }

    // ── Carte ────────────────────────────────────────────────────────────────

    _cardKey(operator, table, answer) {
        return `${operator}_${table ?? 'x'}_${answer}`;
    }

    _getOrCreate(question, answer, operator, table) {
        const key = this._cardKey(operator, table, answer);
        if (!this.cards[key]) {
            this.cards[key] = {
                key,
                question,
                answer,
                operator,
                table: table ?? null,
                // SM-2
                interval:    0,         // jours avant la prochaine révision
                repetitions: 0,         // succès consécutifs
                ef:          2.5,       // facteur de facilité
                nextReview:  Date.now(), // due immédiatement (nouvelle carte)
                lastSeen:    null,
                history:     []         // [{date, quality, responseTimeMs, isCorrect}]
            };
        }
        return this.cards[key];
    }

    // ── Algorithme ───────────────────────────────────────────────────────────

    /**
     * Calcule la qualité 0-5 selon correction + rapidité
     */
    _computeQuality(isCorrect, responseTimeMs, avgTimeMs) {
        if (!isCorrect) return 1;
        if (!avgTimeMs || avgTimeMs <= 0) return 3; // pas encore de moyenne

        const ratio = responseTimeMs / avgTimeMs;
        if (ratio < 0.5) return 5;  // ultra rapide
        if (ratio < 0.8) return 4;  // rapide
        if (ratio < 1.5) return 3;  // dans la norme
        return 2;                    // lent mais juste
    }

    /**
     * Temps moyen sur les 10 dernières réponses correctes
     */
    _avgTime(card) {
        const times = card.history
            .filter(h => h.isCorrect)
            .slice(-10)
            .map(h => h.responseTimeMs);
        if (!times.length) return null;
        return times.reduce((a, b) => a + b, 0) / times.length;
    }

    /**
     * Applique l'algorithme SM-2 sur une carte
     */
    _applySmTwo(card, quality) {
        if (quality < 3) {
            // Raté → recommencer l'apprentissage
            card.repetitions = 0;
            card.interval    = 1;
        } else {
            if      (card.repetitions === 0) card.interval = 1;
            else if (card.repetitions === 1) card.interval = 6;
            else card.interval = Math.round(card.interval * card.ef);
            card.repetitions++;
        }

        // Ajuster le facteur de facilité (formule SM-2 originale)
        card.ef = card.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        card.ef = Math.max(1.3, Math.min(2.5, card.ef));

        card.nextReview = Date.now() + card.interval * 86_400_000;
        card.lastSeen   = Date.now();
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Enregistre le résultat d'une réponse et met à jour la carte.
     * À appeler après chaque bonne ou mauvaise réponse en jeu.
     *
     * @param {string}  question       - Texte de la question ("7 × 8")
     * @param {number}  answer         - Réponse correcte
     * @param {string}  operator       - Type d'opération ("*", "+", "-", "/")
     * @param {number|null} table      - Table concernée (null si non applicable)
     * @param {boolean} isCorrect      - Réponse correcte ?
     * @param {number}  responseTimeMs - Temps de réponse en ms
     * @returns {{ card, quality }}
     */
    recordAnswer(question, answer, operator, table, isCorrect, responseTimeMs) {
        const card    = this._getOrCreate(question, answer, operator, table);
        const avgTime = this._avgTime(card);
        const quality = this._computeQuality(isCorrect, responseTimeMs, avgTime);

        this._applySmTwo(card, quality);

        card.history.push({ date: Date.now(), quality, responseTimeMs, isCorrect });
        if (card.history.length > 50) card.history.shift();

        this._save();
        return { card, quality };
    }

    /**
     * Retourne les cartes dues aujourd'hui, triées par urgence.
     * (les plus difficiles et les plus en retard en premier)
     *
     * @param {number} limit - Nombre maximum de cartes
     * @returns {Array}
     */
    getDueCards(limit = 20) {
        const now = Date.now();
        return Object.values(this.cards)
            .filter(c => c.nextReview <= now)
            .sort((a, b) => {
                // Score d'urgence = retard (en jours) + difficulté (EF bas = difficile)
                const score = c => (now - c.nextReview) / 86_400_000 + (2.5 - c.ef) * 4;
                return score(b) - score(a);
            })
            .slice(0, limit);
    }

    /**
     * Stats globales de la file du joueur.
     * @returns {{ total, due, mastered, learning }}
     */
    getStats() {
        const all = Object.values(this.cards);
        const now = Date.now();
        return {
            total:    all.length,
            due:      all.filter(c => c.nextReview <= now).length,
            mastered: all.filter(c => c.repetitions >= 3 && c.interval >= 21).length,
            learning: all.filter(c => c.repetitions > 0  && c.interval < 21).length,
        };
    }
}
