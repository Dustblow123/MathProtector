/**
 * Gestionnaire des profils joueurs et du leaderboard
 */
class ProfileManager {
    constructor() {
        // Clés localStorage
        this.PROFILES_KEY = 'mathGameProfiles';
        this.ACTIVE_PROFILE_KEY = 'mathGameActiveProfile';
        this.LEADERBOARD_KEY = 'mathGameLeaderboard';
        this.OLD_HIGHSCORE_KEY = 'mathGameHighScore';

        // Nouvelles clés pour le suivi des erreurs et statistiques
        this.ERROR_HISTORY_KEY = 'mathGameErrorHistory';
        this.SESSION_HISTORY_KEY = 'mathGameSessionHistory';
        this.AGGREGATED_STATS_KEY = 'mathGameAggregatedStats';

        // Avatars prédéfinis
        this.predefinedAvatars = [
            { id: 'astronaut', emoji: '🧑‍🚀', name: 'Astronaute' },
            { id: 'robot', emoji: '🤖', name: 'Robot' },
            { id: 'alien', emoji: '👽', name: 'Alien' },
            { id: 'rocket', emoji: '🚀', name: 'Fusée' },
            { id: 'star', emoji: '⭐', name: 'Étoile' },
            { id: 'planet', emoji: '🪐', name: 'Planète' },
            { id: 'moon', emoji: '🌙', name: 'Lune' },
            { id: 'sun', emoji: '☀️', name: 'Soleil' }
        ];

        // Couleurs prédéfinies
        this.predefinedColors = [
            { id: 'cyan', color: '#4fc3f7', name: 'Cyan' },
            { id: 'violet', color: '#7c4dff', name: 'Violet' },
            { id: 'red', color: '#ff5252', name: 'Rouge' },
            { id: 'green', color: '#69f0ae', name: 'Vert' },
            { id: 'yellow', color: '#ffd740', name: 'Jaune' },
            { id: 'pink', color: '#ff4081', name: 'Rose' },
            { id: 'lime', color: '#b2ff59', name: 'Vert vif' },
            { id: 'blue', color: '#448aff', name: 'Bleu' }
        ];

        // Données
        this.profiles = [];
        this.activeProfileId = null;
        this.leaderboard = [];

        // Charger les données
        this.load();

        // Migrer l'ancien high score si nécessaire
        this.migrateOldHighScore();
    }

    /**
     * Génère un UUID unique
     * @returns {string}
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Charge les données depuis localStorage
     */
    load() {
        try {
            const profilesData = localStorage.getItem(this.PROFILES_KEY);
            this.profiles = profilesData ? JSON.parse(profilesData) : [];

            this.activeProfileId = localStorage.getItem(this.ACTIVE_PROFILE_KEY) || null;

            const leaderboardData = localStorage.getItem(this.LEADERBOARD_KEY);
            this.leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];
        } catch (e) {
            console.error('Erreur lors du chargement des profils:', e);
            this.profiles = [];
            this.activeProfileId = null;
            this.leaderboard = [];
        }
    }

    /**
     * Sauvegarde les profils dans localStorage
     */
    saveProfiles() {
        try {
            localStorage.setItem(this.PROFILES_KEY, JSON.stringify(this.profiles));
            if (this.activeProfileId) {
                localStorage.setItem(this.ACTIVE_PROFILE_KEY, this.activeProfileId);
            } else {
                localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
            }
        } catch (e) {
            console.error('Erreur lors de la sauvegarde des profils:', e);
        }
    }

    /**
     * Sauvegarde le leaderboard dans localStorage
     */
    saveLeaderboard() {
        try {
            localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(this.leaderboard));
        } catch (e) {
            console.error('Erreur lors de la sauvegarde du leaderboard:', e);
        }
    }

    /**
     * Migre l'ancien high score global vers le leaderboard
     */
    migrateOldHighScore() {
        const oldHighScore = localStorage.getItem(this.OLD_HIGHSCORE_KEY);
        if (oldHighScore && parseInt(oldHighScore) > 0) {
            const score = parseInt(oldHighScore);

            // Ajouter au leaderboard si pas déjà présent
            const exists = this.leaderboard.some(entry =>
                entry.playerName === 'Joueur' && entry.score === score
            );

            if (!exists) {
                this.leaderboard.push({
                    id: this.generateUUID(),
                    playerId: null,
                    playerName: 'Joueur',
                    playerAvatar: '👤',
                    playerColor: '#4fc3f7',
                    score: score,
                    mode: 'infinite',
                    difficulty: 'medium',
                    date: Date.now()
                });
                this.sortAndTrimLeaderboard();
                this.saveLeaderboard();
            }
        }
    }

    /**
     * Crée un nouveau profil
     * @param {Object} data - Données du profil
     * @returns {Object} - Le profil créé
     */
    createProfile(data) {
        const profile = {
            id: this.generateUUID(),
            name: data.name || 'Joueur',
            avatarType: data.avatarType || 'predefined',
            avatar: data.avatar || 'astronaut',
            accentColor: data.accentColor || '#4fc3f7',
            createdAt: Date.now(),
            stats: {
                highScore: 0,
                totalGamesPlayed: 0,
                bestCombo: 0,
                totalAsteroidsDestroyed: 0
            }
        };

        this.profiles.push(profile);
        this.saveProfiles();

        return profile;
    }

    /**
     * Met à jour un profil existant
     * @param {string} id - ID du profil
     * @param {Object} data - Données à mettre à jour
     * @returns {Object|null} - Le profil mis à jour ou null
     */
    updateProfile(id, data) {
        const profile = this.profiles.find(p => p.id === id);
        if (!profile) return null;

        if (data.name !== undefined) profile.name = data.name;
        if (data.avatarType !== undefined) profile.avatarType = data.avatarType;
        if (data.avatar !== undefined) profile.avatar = data.avatar;
        if (data.accentColor !== undefined) profile.accentColor = data.accentColor;

        this.saveProfiles();

        // Mettre à jour les entrées du leaderboard pour ce profil
        this.updateLeaderboardEntries(profile);

        return profile;
    }

    /**
     * Met à jour les entrées du leaderboard pour un profil modifié
     * @param {Object} profile - Le profil modifié
     */
    updateLeaderboardEntries(profile) {
        let updated = false;
        this.leaderboard.forEach(entry => {
            if (entry.playerId === profile.id) {
                entry.playerName = profile.name;
                entry.playerAvatar = this.getAvatarEmoji(profile);
                entry.playerColor = profile.accentColor;
                updated = true;
            }
        });
        if (updated) {
            this.saveLeaderboard();
        }
    }

    /**
     * Supprime un profil
     * @param {string} id - ID du profil
     * @returns {boolean} - Succès de la suppression
     */
    deleteProfile(id) {
        const index = this.profiles.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.profiles.splice(index, 1);

        // Si c'était le profil actif, désélectionner
        if (this.activeProfileId === id) {
            this.activeProfileId = null;
        }

        this.saveProfiles();
        return true;
    }

    /**
     * Définit le profil actif
     * @param {string|null} id - ID du profil ou null pour désélectionner
     */
    setActiveProfile(id) {
        if (id === null || this.profiles.some(p => p.id === id)) {
            this.activeProfileId = id;
            this.saveProfiles();
        }
    }

    /**
     * Récupère le profil actif
     * @returns {Object|null}
     */
    getActiveProfile() {
        if (!this.activeProfileId) return null;
        return this.profiles.find(p => p.id === this.activeProfileId) || null;
    }

    /**
     * Récupère un profil par son ID
     * @param {string} id
     * @returns {Object|null}
     */
    getProfile(id) {
        return this.profiles.find(p => p.id === id) || null;
    }

    /**
     * Récupère tous les profils
     * @returns {Array}
     */
    getAllProfiles() {
        return [...this.profiles];
    }

    /**
     * Récupère l'emoji de l'avatar d'un profil
     * @param {Object} profile
     * @returns {string}
     */
    getAvatarEmoji(profile) {
        if (!profile) return '👤';

        if (profile.avatarType === 'predefined') {
            const avatar = this.predefinedAvatars.find(a => a.id === profile.avatar);
            return avatar ? avatar.emoji : '👤';
        }

        // Pour les avatars custom (base64), retourner un emoji par défaut
        // L'affichage de l'image sera géré séparément
        return '🖼️';
    }

    /**
     * Met à jour les statistiques du profil actif après une partie
     * @param {Object} gameStats - Statistiques de la partie
     */
    updateActiveProfileStats(gameStats) {
        const profile = this.getActiveProfile();
        if (!profile) return;

        profile.stats.totalGamesPlayed++;
        profile.stats.totalAsteroidsDestroyed += gameStats.destroyed || 0;

        if (gameStats.score > profile.stats.highScore) {
            profile.stats.highScore = gameStats.score;
        }

        if (gameStats.maxCombo > profile.stats.bestCombo) {
            profile.stats.bestCombo = gameStats.maxCombo;
        }

        this.saveProfiles();
    }

    /**
     * Ajoute une entrée au leaderboard
     * @param {Object} entry - Données de l'entrée
     */
    addLeaderboardEntry(entry) {
        const profile = this.getActiveProfile();

        const leaderboardEntry = {
            id: this.generateUUID(),
            playerId: profile ? profile.id : null,
            playerName: profile ? profile.name : 'Invité',
            playerAvatar: profile ? this.getAvatarEmoji(profile) : '👤',
            playerColor: profile ? profile.accentColor : '#4fc3f7',
            score: entry.score,
            mode: entry.mode || 'infinite',
            difficulty: entry.difficulty || 'medium',
            date: Date.now()
        };

        this.leaderboard.push(leaderboardEntry);
        this.sortAndTrimLeaderboard();
        this.saveLeaderboard();
    }

    /**
     * Trie et limite le leaderboard à 50 entrées
     */
    sortAndTrimLeaderboard() {
        // Trier par score décroissant
        this.leaderboard.sort((a, b) => b.score - a.score);

        // Garder uniquement les 50 meilleurs
        if (this.leaderboard.length > 50) {
            this.leaderboard = this.leaderboard.slice(0, 50);
        }
    }

    /**
     * Récupère le leaderboard filtré
     * @param {Object} filters - Filtres optionnels (mode, difficulty)
     * @returns {Array}
     */
    getLeaderboard(filters = {}) {
        let filtered = [...this.leaderboard];

        if (filters.mode && filters.mode !== 'all') {
            filtered = filtered.filter(e => e.mode === filters.mode);
        }

        if (filters.difficulty && filters.difficulty !== 'all') {
            filtered = filtered.filter(e => e.difficulty === filters.difficulty);
        }

        return filtered;
    }

    /**
     * Récupère le high score du profil actif
     * @returns {number}
     */
    getActiveProfileHighScore() {
        const profile = this.getActiveProfile();
        return profile ? profile.stats.highScore : 0;
    }

    /**
     * Récupère le meilleur score global (tous profils confondus)
     * @returns {number}
     */
    getGlobalHighScore() {
        if (this.leaderboard.length === 0) return 0;
        return this.leaderboard[0].score;
    }

    /**
     * Réinitialise le leaderboard
     */
    resetLeaderboard() {
        this.leaderboard = [];
        this.saveLeaderboard();
    }

    /**
     * Récupère les statistiques détaillées d'un profil
     * @param {string} profileId - ID du profil
     * @returns {Object} - Statistiques détaillées
     */
    getProfileDetailedStats(profileId) {
        const profile = this.getProfile(profileId);
        if (!profile) return null;

        // Calculer les stats depuis le leaderboard
        const profileEntries = this.leaderboard.filter(e => e.playerId === profileId);

        // Calcul de la précision moyenne (approximation basée sur le score et combo)
        const avgScore = profileEntries.length > 0
            ? Math.round(profileEntries.reduce((sum, e) => sum + e.score, 0) / profileEntries.length)
            : 0;

        return {
            highScore: profile.stats.highScore,
            totalGamesPlayed: profile.stats.totalGamesPlayed,
            bestCombo: profile.stats.bestCombo,
            totalAsteroidsDestroyed: profile.stats.totalAsteroidsDestroyed,
            avgScore: avgScore,
            leaderboardEntries: profileEntries.length,
            // Calcul de la vitesse moyenne (astéroïdes par partie)
            avgAsteroidsPerGame: profile.stats.totalGamesPlayed > 0
                ? Math.round(profile.stats.totalAsteroidsDestroyed / profile.stats.totalGamesPlayed)
                : 0
        };
    }

    // ====================== SUIVI DES ERREURS ET STATISTIQUES ======================

    /**
     * Enregistre une erreur
     * @param {string} profileId - ID du profil
     * @param {Object} errorData - Données de l'erreur
     */
    recordError(profileId, errorData) {
        if (!profileId) return;

        const error = {
            timestamp: Date.now(),
            question: errorData.question,
            correctAnswer: errorData.correctAnswer,
            givenAnswer: errorData.givenAnswer,
            operationType: errorData.operationType,
            table: errorData.table || null,
            responseTime: errorData.responseTime || 0
        };

        // Sauvegarder dans l'historique des erreurs
        let errorHistory = this.getErrorHistoryData();
        if (!errorHistory[profileId]) {
            errorHistory[profileId] = [];
        }
        errorHistory[profileId].push(error);

        // Garder seulement les 500 dernières erreurs par profil
        if (errorHistory[profileId].length > 500) {
            errorHistory[profileId] = errorHistory[profileId].slice(-500);
        }

        this.saveErrorHistory(errorHistory);

        // Mettre à jour les stats agrégées
        this.updateAggregatedStats(profileId, errorData, false);
    }

    /**
     * Enregistre une bonne réponse
     * @param {string} profileId - ID du profil
     * @param {Object} answerData - Données de la réponse
     */
    recordCorrectAnswer(profileId, answerData) {
        if (!profileId) return;

        // Mettre à jour les stats agrégées
        this.updateAggregatedStats(profileId, answerData, true);
    }

    /**
     * Récupère les données brutes de l'historique des erreurs
     * @returns {Object}
     */
    getErrorHistoryData() {
        try {
            const data = localStorage.getItem(this.ERROR_HISTORY_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Erreur lors du chargement de l\'historique des erreurs:', e);
            return {};
        }
    }

    /**
     * Sauvegarde l'historique des erreurs
     * @param {Object} errorHistory
     */
    saveErrorHistory(errorHistory) {
        try {
            localStorage.setItem(this.ERROR_HISTORY_KEY, JSON.stringify(errorHistory));
        } catch (e) {
            console.error('Erreur lors de la sauvegarde de l\'historique des erreurs:', e);
        }
    }

    /**
     * Récupère l'historique des erreurs d'un profil
     * @param {string} profileId - ID du profil
     * @param {number} limit - Nombre max d'erreurs à retourner (0 = toutes)
     * @returns {Array}
     */
    getErrorHistory(profileId, limit = 0) {
        const errorHistory = this.getErrorHistoryData();
        const errors = errorHistory[profileId] || [];

        if (limit > 0) {
            return errors.slice(-limit);
        }
        return errors;
    }

    /**
     * Récupère les statistiques agrégées d'un profil
     * @param {string} profileId - ID du profil
     * @returns {Object}
     */
    getAggregatedStats(profileId) {
        try {
            const data = localStorage.getItem(this.AGGREGATED_STATS_KEY);
            const allStats = data ? JSON.parse(data) : {};
            return allStats[profileId] || this.createEmptyAggregatedStats();
        } catch (e) {
            console.error('Erreur lors du chargement des stats agrégées:', e);
            return this.createEmptyAggregatedStats();
        }
    }

    /**
     * Crée un objet de stats agrégées vide
     * @returns {Object}
     */
    createEmptyAggregatedStats() {
        return {
            tableStats: {},
            operationStats: {},
            frequentErrors: [],
            totalAnswers: 0,
            totalCorrect: 0,
            totalWrong: 0
        };
    }

    /**
     * Met à jour les statistiques agrégées
     * @param {string} profileId - ID du profil
     * @param {Object} answerData - Données de la réponse
     * @param {boolean} isCorrect - Si la réponse est correcte
     */
    updateAggregatedStats(profileId, answerData, isCorrect) {
        if (!profileId) return;

        try {
            const data = localStorage.getItem(this.AGGREGATED_STATS_KEY);
            const allStats = data ? JSON.parse(data) : {};

            if (!allStats[profileId]) {
                allStats[profileId] = this.createEmptyAggregatedStats();
            }

            const stats = allStats[profileId];

            // Compteurs globaux
            stats.totalAnswers++;
            if (isCorrect) {
                stats.totalCorrect++;
            } else {
                stats.totalWrong++;
            }

            // Stats par table (pour multiplication/division)
            if (answerData.table) {
                if (!stats.tableStats[answerData.table]) {
                    stats.tableStats[answerData.table] = { correct: 0, wrong: 0, avgTime: 0, totalTime: 0, count: 0 };
                }
                const tableData = stats.tableStats[answerData.table];
                if (isCorrect) {
                    tableData.correct++;
                } else {
                    tableData.wrong++;
                }
                if (answerData.responseTime) {
                    tableData.totalTime += answerData.responseTime;
                    tableData.count++;
                    tableData.avgTime = Math.round(tableData.totalTime / tableData.count);
                }
            }

            // Stats par opération
            if (answerData.operationType) {
                if (!stats.operationStats[answerData.operationType]) {
                    stats.operationStats[answerData.operationType] = { correct: 0, wrong: 0, avgTime: 0, totalTime: 0, count: 0 };
                }
                const opData = stats.operationStats[answerData.operationType];
                if (isCorrect) {
                    opData.correct++;
                } else {
                    opData.wrong++;
                }
                if (answerData.responseTime) {
                    opData.totalTime += answerData.responseTime;
                    opData.count++;
                    opData.avgTime = Math.round(opData.totalTime / opData.count);
                }
            }

            // Mise à jour des erreurs fréquentes (si erreur)
            if (!isCorrect && answerData.question) {
                this.updateFrequentErrors(stats, answerData.question);
            }

            localStorage.setItem(this.AGGREGATED_STATS_KEY, JSON.stringify(allStats));
        } catch (e) {
            console.error('Erreur lors de la mise à jour des stats agrégées:', e);
        }
    }

    /**
     * Met à jour la liste des erreurs fréquentes
     * @param {Object} stats - Stats agrégées
     * @param {string} question - Question ayant généré l'erreur
     */
    updateFrequentErrors(stats, question) {
        const existing = stats.frequentErrors.find(e => e.question === question);
        if (existing) {
            existing.count++;
        } else {
            stats.frequentErrors.push({ question: question, count: 1 });
        }

        // Trier par nombre d'erreurs décroissant et garder les 20 plus fréquentes
        stats.frequentErrors.sort((a, b) => b.count - a.count);
        if (stats.frequentErrors.length > 20) {
            stats.frequentErrors = stats.frequentErrors.slice(0, 20);
        }
    }

    /**
     * Récupère les points faibles d'un profil (tables/opérations avec < 70% de réussite)
     * @param {string} profileId - ID du profil
     * @returns {Array}
     */
    getWeakAreas(profileId) {
        const stats = this.getAggregatedStats(profileId);
        const weakAreas = [];

        // Seuil minimum de réponses pour détecter une faiblesse
        const MIN_ANSWERS = 3;

        // Analyser les tables (multiplication/division)
        for (let table = 1; table <= 10; table++) {
            const tableData = stats.tableStats[table];
            if (tableData && tableData.correct + tableData.wrong >= MIN_ANSWERS) {
                const successRate = tableData.correct / (tableData.correct + tableData.wrong);
                if (successRate < 0.7) {
                    weakAreas.push({
                        type: 'table',
                        value: table,
                        successRate: Math.round(successRate * 100),
                        label: `Table de ${table}`,
                        correct: tableData.correct,
                        wrong: tableData.wrong
                    });
                }
            }
        }

        // Analyser les opérations
        const operationLabels = {
            multiplication: 'Multiplications',
            addition: 'Additions',
            subtraction: 'Soustractions',
            division: 'Divisions',
            fractions: 'Fractions',
            percentages: 'Pourcentages',
            powers: 'Puissances'
        };

        for (const [op, data] of Object.entries(stats.operationStats)) {
            if (data.correct + data.wrong >= MIN_ANSWERS) {
                const successRate = data.correct / (data.correct + data.wrong);
                if (successRate < 0.7) {
                    weakAreas.push({
                        type: 'operation',
                        value: op,
                        successRate: Math.round(successRate * 100),
                        label: operationLabels[op] || op,
                        correct: data.correct,
                        wrong: data.wrong
                    });
                }
            }
        }

        return weakAreas.sort((a, b) => a.successRate - b.successRate);
    }

    /**
     * Démarre une nouvelle session de jeu
     * @param {string} profileId - ID du profil
     * @param {Object} config - Configuration de la session
     * @returns {string} - ID de la session
     */
    startSession(profileId, config) {
        const sessionId = this.generateUUID();

        try {
            const data = localStorage.getItem(this.SESSION_HISTORY_KEY);
            const sessions = data ? JSON.parse(data) : {};

            if (!sessions[profileId]) {
                sessions[profileId] = [];
            }

            sessions[profileId].push({
                id: sessionId,
                startTime: Date.now(),
                config: config,
                errors: [],
                answers: [],
                endTime: null,
                score: 0,
                completed: false
            });

            // Garder seulement les 50 dernières sessions
            if (sessions[profileId].length > 50) {
                sessions[profileId] = sessions[profileId].slice(-50);
            }

            localStorage.setItem(this.SESSION_HISTORY_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.error('Erreur lors du démarrage de session:', e);
        }

        return sessionId;
    }

    /**
     * Ajoute une réponse à la session courante
     * @param {string} profileId - ID du profil
     * @param {string} sessionId - ID de la session
     * @param {Object} answerData - Données de la réponse
     * @param {boolean} isCorrect - Si la réponse est correcte
     */
    addSessionAnswer(profileId, sessionId, answerData, isCorrect) {
        if (!profileId || !sessionId) return;

        try {
            const data = localStorage.getItem(this.SESSION_HISTORY_KEY);
            const sessions = data ? JSON.parse(data) : {};

            if (!sessions[profileId]) return;

            const session = sessions[profileId].find(s => s.id === sessionId);
            if (!session) return;

            session.answers.push({
                ...answerData,
                isCorrect: isCorrect,
                timestamp: Date.now()
            });

            if (!isCorrect) {
                session.errors.push({
                    question: answerData.question,
                    correctAnswer: answerData.correctAnswer,
                    givenAnswer: answerData.givenAnswer,
                    operationType: answerData.operationType,
                    table: answerData.table
                });
            }

            localStorage.setItem(this.SESSION_HISTORY_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.error('Erreur lors de l\'ajout de réponse à la session:', e);
        }
    }

    /**
     * Termine une session de jeu
     * @param {string} profileId - ID du profil
     * @param {string} sessionId - ID de la session
     * @param {Object} results - Résultats de la session
     */
    endSession(profileId, sessionId, results) {
        if (!profileId || !sessionId) return;

        try {
            const data = localStorage.getItem(this.SESSION_HISTORY_KEY);
            const sessions = data ? JSON.parse(data) : {};

            if (!sessions[profileId]) return;

            const session = sessions[profileId].find(s => s.id === sessionId);
            if (!session) return;

            session.endTime = Date.now();
            session.score = results.score || 0;
            session.completed = true;

            localStorage.setItem(this.SESSION_HISTORY_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.error('Erreur lors de la fin de session:', e);
        }
    }

    /**
     * Récupère les erreurs d'une session
     * @param {string} profileId - ID du profil
     * @param {string} sessionId - ID de la session
     * @returns {Array}
     */
    getSessionErrors(profileId, sessionId) {
        if (!profileId || !sessionId) return [];

        try {
            const data = localStorage.getItem(this.SESSION_HISTORY_KEY);
            const sessions = data ? JSON.parse(data) : {};

            if (!sessions[profileId]) return [];

            const session = sessions[profileId].find(s => s.id === sessionId);
            return session ? session.errors : [];
        } catch (e) {
            console.error('Erreur lors de la récupération des erreurs de session:', e);
            return [];
        }
    }

    /**
     * Récupère la dernière session d'un profil
     * @param {string} profileId - ID du profil
     * @returns {Object|null}
     */
    getLastSession(profileId) {
        if (!profileId) return null;

        try {
            const data = localStorage.getItem(this.SESSION_HISTORY_KEY);
            const sessions = data ? JSON.parse(data) : {};

            if (!sessions[profileId] || sessions[profileId].length === 0) return null;

            return sessions[profileId][sessions[profileId].length - 1];
        } catch (e) {
            console.error('Erreur lors de la récupération de la dernière session:', e);
            return null;
        }
    }

    /**
     * Réinitialise les statistiques agrégées d'un profil
     * @param {string} profileId - ID du profil
     */
    resetAggregatedStats(profileId) {
        if (!profileId) return;

        try {
            const data = localStorage.getItem(this.AGGREGATED_STATS_KEY);
            const allStats = data ? JSON.parse(data) : {};

            // Réinitialiser les stats de ce profil
            allStats[profileId] = this.createEmptyAggregatedStats();

            localStorage.setItem(this.AGGREGATED_STATS_KEY, JSON.stringify(allStats));
        } catch (e) {
            console.error('Erreur lors de la réinitialisation des stats:', e);
        }
    }

    /**
     * Réinitialise l'historique des erreurs d'un profil
     * @param {string} profileId - ID du profil
     */
    resetErrorHistory(profileId) {
        if (!profileId) return;

        try {
            const errorHistory = this.getErrorHistoryData();
            errorHistory[profileId] = [];
            this.saveErrorHistory(errorHistory);
        } catch (e) {
            console.error('Erreur lors de la réinitialisation de l\'historique:', e);
        }
    }

    /**
     * Réinitialise l'historique des sessions d'un profil
     * @param {string} profileId - ID du profil
     */
    resetSessionHistory(profileId) {
        if (!profileId) return;

        try {
            const data = localStorage.getItem(this.SESSION_HISTORY_KEY);
            const sessions = data ? JSON.parse(data) : {};
            sessions[profileId] = [];
            localStorage.setItem(this.SESSION_HISTORY_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.error('Erreur lors de la réinitialisation des sessions:', e);
        }
    }

    /**
     * Réinitialise les données de répétition espacée d'un profil
     * @param {string} profileId - ID du profil
     */
    resetSRData(profileId) {
        if (!profileId) return;
        localStorage.removeItem(`sr_cards_${profileId}`);
        localStorage.removeItem(`sr_session_${profileId}`);
    }

    /**
     * Réinitialise toutes les données d'entraînement d'un profil
     * @param {string} profileId - ID du profil
     */
    resetAllTrainingData(profileId) {
        this.resetAggregatedStats(profileId);
        this.resetErrorHistory(profileId);
        this.resetSessionHistory(profileId);
        this.resetSRData(profileId);
    }
}

// Instance globale
const profileManager = new ProfileManager();
