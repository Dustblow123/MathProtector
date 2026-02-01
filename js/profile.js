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
}

// Instance globale
const profileManager = new ProfileManager();
