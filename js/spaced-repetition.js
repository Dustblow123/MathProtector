/**
 * Système de répétition espacée — modèle hybride sessions / jours
 *
 * Principe : les premières répétitions sont mesurées en SESSIONS
 * (pas en jours), ce qui récompense les enfants qui jouent souvent.
 * Une fois la carte suffisamment solide, on passe aux jours.
 *
 * Progression d'une carte :
 *
 *   Échec / nouvelle  → prochaine session           (+1 session)
 *   1ère réussite     → dans 3 sessions              (+3 sessions)
 *   2ème réussite     → dans quelques jours           (+3 jours)
 *   3ème réussite     → dans une semaine              (+7 jours)
 *   4ème+             → SM-2 classique               (×EF, croissant)
 *
 * Si l'enfant joue 3 sessions dans la journée, il peut atteindre
 * la phase "jours" le jour même — les sessions fréquentes avancent
 * le calendrier, pas seulement le temps qui passe.
 *
 * Stockage par profil :
 *   sr_session_{profileId}  → compteur absolu de sessions
 *   sr_cards_{profileId}    → dictionnaire des cartes
 */
class SpacedRepetition {

    /**
     * @param {string} profileId
     */
    constructor(profileId) {
        this.profileId   = profileId;
        this.cardsKey    = `sr_cards_${profileId}`;
        this.sessionKey  = `sr_session_${profileId}`;
        this.cards       = this._loadCards();
        this.sessionCount = this._loadSession();
    }

    // ── Compteur de sessions ──────────────────────────────────────────────────

    _loadSession() {
        return parseInt(localStorage.getItem(this.sessionKey) || '0');
    }

    /**
     * Incrémente le compteur de sessions.
     * À appeler exactement une fois par partie lancée.
     * @returns {number} nouveau numéro de session
     */
    incrementSession() {
        this.sessionCount++;
        localStorage.setItem(this.sessionKey, String(this.sessionCount));
        return this.sessionCount;
    }

    // ── Persistance ───────────────────────────────────────────────────────────

    _loadCards() {
        try {
            const raw = localStorage.getItem(this.cardsKey);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    _save() {
        try {
            localStorage.setItem(this.cardsKey, JSON.stringify(this.cards));
        } catch (e) {
            console.warn('SpacedRepetition: erreur de sauvegarde', e);
        }
    }

    // ── Carte ─────────────────────────────────────────────────────────────────

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
                // Suivi de progression
                repetitions:       0,
                ef:                2.5,
                // Intervalle courant (soit sessions, soit jours, jamais les deux à la fois)
                sessionInterval:   1,    // sessions d'écart (phases 0-1)
                dayInterval:       0,    // jours d'écart (phases 2+)
                // Prochaine révision — exactement l'un des deux est actif
                nextReviewSession: this.sessionCount + 1, // session absolue
                nextReviewDate:    null,                  // timestamp ms
                lastSeen:          null,
                history:           []
            };
        } else {
            // Migration des cartes créées avec l'ancienne version (champ "nextReview" en ms)
            const c = this.cards[key];
            if (c.nextReviewSession === undefined && c.nextReviewDate === undefined) {
                c.sessionInterval   = 0;
                c.dayInterval       = c.interval ?? 1;
                c.nextReviewDate    = c.nextReview ?? Date.now();
                c.nextReviewSession = null;
                delete c.interval;
                delete c.nextReview;
            }
        }

        return this.cards[key];
    }

    // ── Qualité et temps ──────────────────────────────────────────────────────

    /**
     * Qualité 0-5 calculée automatiquement
     *   1   = raté
     *   2   = réussi mais lent (> 1.5× la moyenne)
     *   3   = réussi dans la norme
     *   4   = réussi rapidement (< 0.8× la moyenne)
     *   5   = réussi très rapidement (< 0.5× la moyenne)
     */
    _computeQuality(isCorrect, responseTimeMs, avgTimeMs) {
        if (!isCorrect) return 1;
        if (!avgTimeMs || avgTimeMs <= 0) return 3;
        const ratio = responseTimeMs / avgTimeMs;
        if (ratio < 0.5) return 5;
        if (ratio < 0.8) return 4;
        if (ratio < 1.5) return 3;
        return 2;
    }

    /** Temps moyen sur les 10 dernières réponses correctes */
    _avgTime(card) {
        const times = card.history
            .filter(h => h.isCorrect)
            .slice(-10)
            .map(h => h.responseTimeMs);
        if (!times.length) return null;
        return times.reduce((a, b) => a + b, 0) / times.length;
    }

    // ── Algorithme de progression ─────────────────────────────────────────────

    /**
     * Met à jour la carte selon la qualité de la réponse.
     *
     * Phase sessions (rép. 0 et 1) : intervalles en nombre de sessions.
     *   → Jouer souvent dans la journée fait progresser la carte plus vite.
     *
     * Phase jours (rép. 2+) : intervalles calendaires fixes puis SM-2.
     */
    _applyInterval(card, quality) {
        // Ajuster le facteur de facilité dans tous les cas
        card.ef = Math.max(1.3, Math.min(2.5,
            card.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
        ));

        if (quality < 3) {
            // ── Échec : retour en phase sessions, due à la prochaine ────────
            card.repetitions       = 0;
            card.sessionInterval   = 1;
            card.dayInterval       = 0;
            card.nextReviewSession = this.sessionCount + 1;
            card.nextReviewDate    = null;

        } else {
            card.repetitions++;

            switch (card.repetitions) {
                case 1:
                    // ── 1ère réussite : revoir dans 3 sessions ──────────────
                    card.sessionInterval   = 3;
                    card.nextReviewSession = this.sessionCount + 3;
                    card.nextReviewDate    = null;
                    card.dayInterval       = 0;
                    break;

                case 2:
                    // ── 2ème réussite : passe aux jours (3 jours) ───────────
                    card.dayInterval       = 3;
                    card.nextReviewDate    = Date.now() + 3 * 86_400_000;
                    card.nextReviewSession = null;
                    card.sessionInterval   = 0;
                    break;

                case 3:
                    // ── 3ème réussite : une semaine ──────────────────────────
                    card.dayInterval    = 7;
                    card.nextReviewDate = Date.now() + 7 * 86_400_000;
                    break;

                default:
                    // ── 4ème+ : SM-2 classique (croissance exponentielle) ────
                    card.dayInterval    = Math.round(card.dayInterval * card.ef);
                    card.nextReviewDate = Date.now() + card.dayInterval * 86_400_000;
                    break;
            }
        }

        card.lastSeen = Date.now();
    }

    // ── Échéance ──────────────────────────────────────────────────────────────

    /**
     * Vrai si la carte est due pour la session courante.
     */
    _isDue(card) {
        // Phase jours
        if (card.nextReviewDate) {
            return Date.now() >= card.nextReviewDate;
        }
        // Phase sessions
        if (card.nextReviewSession !== null && card.nextReviewSession !== undefined) {
            return this.sessionCount >= card.nextReviewSession;
        }
        // Carte legacy sans champ défini → due maintenant
        return true;
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Enregistre le résultat d'une réponse et met à jour l'intervalle.
     *
     * @param {string}      question       "7 × 8"
     * @param {number}      answer         56
     * @param {string}      operator       "*" | "+" | "-" | "/"
     * @param {number|null} table          table concernée, ou null
     * @param {boolean}     isCorrect
     * @param {number}      responseTimeMs
     * @returns {{ card, quality }}
     */
    recordAnswer(question, answer, operator, table, isCorrect, responseTimeMs) {
        const card    = this._getOrCreate(question, answer, operator, table);
        const avgTime = this._avgTime(card);
        const quality = this._computeQuality(isCorrect, responseTimeMs, avgTime);

        this._applyInterval(card, quality);

        card.history.push({
            date: Date.now(),
            session: this.sessionCount,
            quality,
            responseTimeMs,
            isCorrect
        });
        if (card.history.length > 50) card.history.shift();

        this._save();
        return { card, quality };
    }

    /**
     * Cartes dues pour cette session, triées par priorité.
     * Les cartes difficiles (EF bas) et les plus en retard passent en premier.
     *
     * @param {number} limit
     * @returns {Array}
     */
    getDueCards(limit = 20) {
        return Object.values(this.cards)
            .filter(c => this._isDue(c))
            .sort((a, b) => {
                // Priorité = difficulté (EF bas) + retard normalisé
                const overdueA = a.nextReviewDate
                    ? (Date.now() - a.nextReviewDate) / 86_400_000
                    : (this.sessionCount - (a.nextReviewSession ?? 0));
                const overdueB = b.nextReviewDate
                    ? (Date.now() - b.nextReviewDate) / 86_400_000
                    : (this.sessionCount - (b.nextReviewSession ?? 0));
                return (2.5 - a.ef) * 3 + overdueA - ((2.5 - b.ef) * 3 + overdueB);
            })
            .slice(0, limit)
            .reverse(); // les plus urgentes en dernier = présentées en premier dans le jeu
    }

    /**
     * Stats globales pour le widget du menu.
     * @returns {{ total, due, mastered, learning }}
     */
    getStats() {
        const all = Object.values(this.cards);
        return {
            total:    all.length,
            due:      all.filter(c => this._isDue(c)).length,
            mastered: all.filter(c => c.repetitions >= 3 && c.dayInterval >= 21).length,
            learning: all.filter(c => c.lastSeen !== null && !this._isDue(c)).length,
        };
    }
}
