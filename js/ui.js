/**
 * Gestionnaire de l'interface utilisateur
 */
class UIManager {
    constructor() {
        // Écrans
        this.menuScreen = document.getElementById('menu-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.pauseScreen = document.getElementById('pause-screen');

        // Éléments du menu
        this.tableCheckboxes = document.querySelectorAll('.table-checkbox input');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.startBtn = document.getElementById('start-game');
        this.toggleMusicBtn = document.getElementById('toggle-music');
        this.toggleSoundBtn = document.getElementById('toggle-sound');
        this.menuHighScore = document.getElementById('menu-high-score');

        // Éléments du jeu
        this.canvas = document.getElementById('game-canvas');
        this.scoreDisplay = document.getElementById('score');
        this.comboDisplay = document.getElementById('combo');
        this.livesContainer = document.getElementById('lives');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-answer');
        this.pauseBtn = document.getElementById('pause-btn');
        this.gameSoundBtn = document.getElementById('game-sound-btn');

        // Éléments game over
        this.finalScore = document.getElementById('final-score');
        this.bestCombo = document.getElementById('best-combo');
        this.asteroidsDestroyed = document.getElementById('asteroids-destroyed');
        this.retryBtn = document.getElementById('retry-btn');
        this.menuBtn = document.getElementById('menu-btn');

        // Éléments pause
        this.resumeBtn = document.getElementById('resume-btn');
        this.quitBtn = document.getElementById('quit-btn');

        // Mode séparation
        this.splitModeCheckbox = document.getElementById('split-mode');

        // Éléments profils
        this.playerSelectorBtn = document.getElementById('open-player-panel');
        this.currentPlayerAvatar = document.getElementById('current-player-avatar');
        this.currentPlayerName = document.getElementById('current-player-name');
        this.playerPanel = document.getElementById('player-panel');
        this.playerPanelOverlay = document.getElementById('player-panel-overlay');
        this.closePlayerPanelBtn = document.getElementById('close-player-panel');
        this.profilesList = document.getElementById('profiles-list');
        this.newProfileBtn = document.getElementById('new-profile-btn');

        // Éléments modal profil
        this.profileModal = document.getElementById('profile-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.profileNameInput = document.getElementById('profile-name');
        this.avatarGrid = document.getElementById('avatar-grid');
        this.colorSwatches = document.getElementById('color-swatches');
        this.previewAvatar = document.getElementById('preview-avatar');
        this.previewName = document.getElementById('preview-name');
        this.profilePreview = document.getElementById('profile-preview');
        this.deleteProfileBtn = document.getElementById('delete-profile-btn');
        this.cancelProfileBtn = document.getElementById('cancel-profile-btn');
        this.saveProfileBtn = document.getElementById('save-profile-btn');

        // Éléments leaderboard
        this.leaderboardBtn = document.getElementById('leaderboard-btn');
        this.leaderboardScreen = document.getElementById('leaderboard-screen');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.leaderboardModeFilter = document.getElementById('leaderboard-mode-filter');
        this.leaderboardDifficultyFilter = document.getElementById('leaderboard-difficulty-filter');
        this.leaderboardBackBtn = document.getElementById('leaderboard-back-btn');
        this.leaderboardResetBtn = document.getElementById('leaderboard-reset-btn');

        // Éléments statistiques joueur
        this.playerStatsSection = document.getElementById('player-stats-section');
        this.statsPlayerAvatar = document.getElementById('stats-player-avatar');
        this.statsPlayerName = document.getElementById('stats-player-name');
        this.statHighscore = document.getElementById('stat-highscore');
        this.statGames = document.getElementById('stat-games');
        this.statAsteroids = document.getElementById('stat-asteroids');
        this.statCombo = document.getElementById('stat-combo');
        this.statAvgAsteroids = document.getElementById('stat-avg-asteroids');
        this.statAvgScore = document.getElementById('stat-avg-score');

        // État modal profil
        this.editingProfileId = null;
        this.selectedAvatar = 'astronaut';
        this.selectedColor = '#4fc3f7';

        // Éléments victoire
        this.victoryScreen = document.getElementById('victory-screen');
        this.victoryScore = document.getElementById('victory-score');
        this.victoryCombo = document.getElementById('victory-combo');
        this.victoryDestroyed = document.getElementById('victory-destroyed');
        this.victoryRetryBtn = document.getElementById('victory-retry-btn');
        this.victoryMenuBtn = document.getElementById('victory-menu-btn');

        // Éléments mode de jeu
        this.gamemodeBtns = document.querySelectorAll('.gamemode-btn');
        this.timeOptions = document.getElementById('time-options');
        this.asteroidsOptions = document.getElementById('asteroids-options');
        this.timeDisplay = document.getElementById('time-display');
        this.progressDisplay = document.getElementById('progress-display');
        this.timerSpan = document.getElementById('timer');
        this.progressSpan = document.getElementById('progress');

        // Etat
        this.selectedDifficulty = 'medium';
        this.selectedGameMode = 'infinite';
        this.selectedTime = 120;
        this.selectedCount = 20;

        // PowerUp
        this.powerUpIcon = null;
        this.shieldBubble = null;
        this.freezeOverlay = null;
    }

    /**
     * Initialise les événements UI
     * @param {Object} callbacks - Callbacks pour les actions
     */
    init(callbacks) {
        // Sélection difficulté
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDifficulty = btn.dataset.difficulty;
            });
        });

        // Toggle musique (menu)
        this.toggleMusicBtn.addEventListener('click', () => {
            const enabled = callbacks.onToggleMusic();
            this.toggleMusicBtn.classList.toggle('active', enabled);
        });

        // Toggle son (menu)
        this.toggleSoundBtn.addEventListener('click', () => {
            const enabled = callbacks.onToggleSound();
            this.toggleSoundBtn.classList.toggle('active', enabled);
        });

        // Démarrer le jeu
        this.startBtn.addEventListener('click', () => {
            const tables = this.getSelectedTables();
            if (tables.length === 0) {
                this.showError('Sélectionne au moins une table !');
                return;
            }
            const modeConfig = this.getGameModeConfig();
            callbacks.onStartGame(tables, this.selectedDifficulty, modeConfig);
        });

        // Soumettre réponse
        this.answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer(callbacks.onSubmitAnswer);
            }
        });

        this.submitBtn.addEventListener('click', () => {
            this.submitAnswer(callbacks.onSubmitAnswer);
        });

        // Pause
        this.pauseBtn.addEventListener('click', () => {
            callbacks.onPause();
        });

        // Son pendant le jeu (coupe son ET musique)
        this.gameSoundBtn.addEventListener('click', () => {
            const enabled = callbacks.onToggleAll();
            this.gameSoundBtn.classList.toggle('muted', !enabled);
        });

        // Reprendre
        this.resumeBtn.addEventListener('click', () => {
            callbacks.onResume();
        });

        // Quitter
        this.quitBtn.addEventListener('click', () => {
            callbacks.onQuit();
        });

        // Rejouer
        this.retryBtn.addEventListener('click', () => {
            const tables = this.getSelectedTables();
            const modeConfig = this.getGameModeConfig();
            callbacks.onStartGame(tables, this.selectedDifficulty, modeConfig);
        });

        // Retour menu
        this.menuBtn.addEventListener('click', () => {
            callbacks.onQuit();
        });

        // Mode séparation
        if (this.splitModeCheckbox) {
            this.splitModeCheckbox.addEventListener('change', () => {
                callbacks.onToggleSplitMode(this.splitModeCheckbox.checked);
            });
        }

        // Sélection mode de jeu
        this.gamemodeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.gamemodeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedGameMode = btn.dataset.mode;
                this.updateModeOptions();
            });
        });

        // Options temps
        if (this.timeOptions) {
            this.timeOptions.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.timeOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.selectedTime = parseInt(btn.dataset.time);
                });
            });
        }

        // Options astéroïdes
        if (this.asteroidsOptions) {
            this.asteroidsOptions.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.asteroidsOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.selectedCount = parseInt(btn.dataset.count);
                });
            });
        }

        // Boutons écran victoire
        if (this.victoryRetryBtn) {
            this.victoryRetryBtn.addEventListener('click', () => {
                const tables = this.getSelectedTables();
                const modeConfig = this.getGameModeConfig();
                callbacks.onStartGame(tables, this.selectedDifficulty, modeConfig);
            });
        }

        if (this.victoryMenuBtn) {
            this.victoryMenuBtn.addEventListener('click', () => {
                callbacks.onQuit();
            });
        }

        // Charger le high score
        this.updateHighScore(parseInt(localStorage.getItem('mathGameHighScore') || '0'));

        // Initialiser les événements profils
        this.initProfileEvents();

        // Afficher le profil actif
        this.updateCurrentPlayerDisplay();
    }

    /**
     * Initialise les événements pour le système de profils
     */
    initProfileEvents() {
        // Ouvrir le panel joueur
        if (this.playerSelectorBtn) {
            this.playerSelectorBtn.addEventListener('click', () => this.openPlayerPanel());
        }

        // Fermer le panel joueur
        if (this.closePlayerPanelBtn) {
            this.closePlayerPanelBtn.addEventListener('click', () => this.closePlayerPanel());
        }

        if (this.playerPanelOverlay) {
            this.playerPanelOverlay.addEventListener('click', () => this.closePlayerPanel());
        }

        // Nouveau profil
        if (this.newProfileBtn) {
            this.newProfileBtn.addEventListener('click', () => this.openProfileModal());
        }

        // Modal profil
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeProfileModal());
        }

        if (this.cancelProfileBtn) {
            this.cancelProfileBtn.addEventListener('click', () => this.closeProfileModal());
        }

        if (this.saveProfileBtn) {
            this.saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }

        if (this.deleteProfileBtn) {
            this.deleteProfileBtn.addEventListener('click', () => this.deleteProfile());
        }

        // Mise à jour prévisualisation nom
        if (this.profileNameInput) {
            this.profileNameInput.addEventListener('input', () => this.updatePreview());
        }

        // Fermer modal en cliquant en dehors
        if (this.profileModal) {
            this.profileModal.addEventListener('click', (e) => {
                if (e.target === this.profileModal) {
                    this.closeProfileModal();
                }
            });
        }

        // Leaderboard
        if (this.leaderboardBtn) {
            this.leaderboardBtn.addEventListener('click', () => this.showLeaderboard());
        }

        if (this.leaderboardBackBtn) {
            this.leaderboardBackBtn.addEventListener('click', () => this.hideLeaderboard());
        }

        if (this.leaderboardModeFilter) {
            this.leaderboardModeFilter.addEventListener('change', () => this.renderLeaderboard());
        }

        if (this.leaderboardDifficultyFilter) {
            this.leaderboardDifficultyFilter.addEventListener('change', () => this.renderLeaderboard());
        }

        // Bouton reset leaderboard
        if (this.leaderboardResetBtn) {
            this.leaderboardResetBtn.addEventListener('click', () => this.resetLeaderboard());
        }
    }

    // ====================== GESTION DU PANEL JOUEUR ======================

    /**
     * Ouvre le panel "Qui joue ?"
     */
    openPlayerPanel() {
        if (this.playerPanel) {
            this.playerPanel.classList.add('open');
        }
        if (this.playerPanelOverlay) {
            this.playerPanelOverlay.classList.add('visible');
        }
        this.renderProfilesList();
        this.updatePlayerStatsSection();
    }

    /**
     * Met à jour la section statistiques du joueur actif
     */
    updatePlayerStatsSection() {
        const profile = profileManager.getActiveProfile();

        if (!profile || !this.playerStatsSection) {
            if (this.playerStatsSection) {
                this.playerStatsSection.classList.add('hidden');
            }
            return;
        }

        // Afficher la section
        this.playerStatsSection.classList.remove('hidden');

        // Récupérer les stats détaillées
        const stats = profileManager.getProfileDetailedStats(profile.id);
        const avatarEmoji = profileManager.getAvatarEmoji(profile);

        // Mettre à jour l'en-tête
        if (this.statsPlayerAvatar) {
            this.statsPlayerAvatar.textContent = avatarEmoji;
            this.statsPlayerAvatar.style.borderColor = profile.accentColor;
        }
        if (this.statsPlayerName) {
            this.statsPlayerName.textContent = profile.name;
            this.statsPlayerName.style.color = profile.accentColor;
        }

        // Mettre à jour les statistiques
        if (this.statHighscore) {
            this.statHighscore.textContent = stats.highScore.toLocaleString();
        }
        if (this.statGames) {
            this.statGames.textContent = stats.totalGamesPlayed;
        }
        if (this.statAsteroids) {
            this.statAsteroids.textContent = stats.totalAsteroidsDestroyed.toLocaleString();
        }
        if (this.statCombo) {
            this.statCombo.textContent = `x${stats.bestCombo}`;
        }
        if (this.statAvgAsteroids) {
            this.statAvgAsteroids.textContent = stats.avgAsteroidsPerGame;
        }
        if (this.statAvgScore) {
            this.statAvgScore.textContent = stats.avgScore.toLocaleString();
        }
    }

    /**
     * Ferme le panel "Qui joue ?"
     */
    closePlayerPanel() {
        if (this.playerPanel) {
            this.playerPanel.classList.remove('open');
        }
        if (this.playerPanelOverlay) {
            this.playerPanelOverlay.classList.remove('visible');
        }
    }

    /**
     * Affiche la liste des profils
     */
    renderProfilesList() {
        if (!this.profilesList) return;

        const profiles = profileManager.getAllProfiles();
        const activeId = profileManager.activeProfileId;

        if (profiles.length === 0) {
            this.profilesList.innerHTML = `
                <div class="profiles-empty">
                    <p>Aucun profil créé</p>
                    <p style="font-size: 0.9em; color: var(--text-dim);">Crée ton profil pour sauvegarder tes scores !</p>
                </div>
            `;
            return;
        }

        this.profilesList.innerHTML = profiles.map(profile => {
            const avatarEmoji = profileManager.getAvatarEmoji(profile);
            const isActive = profile.id === activeId;

            return `
                <div class="profile-item ${isActive ? 'active' : ''}" data-profile-id="${profile.id}">
                    <div class="profile-avatar" style="border-color: ${profile.accentColor}">${avatarEmoji}</div>
                    <div class="profile-info">
                        <div class="profile-name" style="color: ${profile.accentColor}">${profile.name}</div>
                        <div class="profile-stats">Record: ${profile.stats.highScore.toLocaleString()} pts</div>
                    </div>
                    <button class="profile-edit-btn" data-edit-id="${profile.id}">✏️</button>
                </div>
            `;
        }).join('');

        // Ajouter les événements
        this.profilesList.querySelectorAll('.profile-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Ne pas sélectionner si on clique sur le bouton édition
                if (e.target.classList.contains('profile-edit-btn')) return;

                const profileId = item.dataset.profileId;
                this.selectProfile(profileId);
            });
        });

        this.profilesList.querySelectorAll('.profile-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const profileId = btn.dataset.editId;
                this.openProfileModal(profileId);
            });
        });
    }

    /**
     * Sélectionne un profil
     * @param {string} profileId
     */
    selectProfile(profileId) {
        profileManager.setActiveProfile(profileId);
        this.updateCurrentPlayerDisplay();
        this.renderProfilesList();
        this.updatePlayerStatsSection();

        // Mettre à jour le high score affiché
        const profile = profileManager.getActiveProfile();
        if (profile) {
            this.updateHighScore(profile.stats.highScore);
        }
    }

    /**
     * Met à jour l'affichage du joueur actuel
     */
    updateCurrentPlayerDisplay() {
        const profile = profileManager.getActiveProfile();

        if (profile) {
            const avatarEmoji = profileManager.getAvatarEmoji(profile);
            if (this.currentPlayerAvatar) {
                this.currentPlayerAvatar.textContent = avatarEmoji;
            }
            if (this.currentPlayerName) {
                this.currentPlayerName.textContent = profile.name;
                this.currentPlayerName.style.color = profile.accentColor;
            }
            if (this.playerSelectorBtn) {
                this.playerSelectorBtn.style.borderColor = profile.accentColor;
            }
            // Mettre à jour le high score
            this.updateHighScore(profile.stats.highScore);
        } else {
            if (this.currentPlayerAvatar) {
                this.currentPlayerAvatar.textContent = '👤';
            }
            if (this.currentPlayerName) {
                this.currentPlayerName.textContent = 'Invité';
                this.currentPlayerName.style.color = '';
            }
            if (this.playerSelectorBtn) {
                this.playerSelectorBtn.style.borderColor = '';
            }
        }
    }

    // ====================== GESTION DE LA MODAL PROFIL ======================

    /**
     * Ouvre la modal de création/édition de profil
     * @param {string|null} profileId - ID du profil à éditer, null pour création
     */
    openProfileModal(profileId = null) {
        this.editingProfileId = profileId;

        if (profileId) {
            const profile = profileManager.getProfile(profileId);
            if (profile) {
                this.modalTitle.textContent = 'Modifier le profil';
                this.profileNameInput.value = profile.name;
                this.selectedAvatar = profile.avatar;
                this.selectedColor = profile.accentColor;
                this.deleteProfileBtn.classList.remove('hidden');
            }
        } else {
            this.modalTitle.textContent = 'Nouveau joueur';
            this.profileNameInput.value = '';
            this.selectedAvatar = 'astronaut';
            this.selectedColor = '#4fc3f7';
            this.deleteProfileBtn.classList.add('hidden');
        }

        this.renderAvatarGrid();
        this.renderColorSwatches();
        this.updatePreview();

        this.profileModal.classList.remove('hidden');
        this.profileNameInput.focus();
    }

    /**
     * Ferme la modal de profil
     */
    closeProfileModal() {
        this.profileModal.classList.add('hidden');
        this.editingProfileId = null;
    }

    /**
     * Affiche la grille d'avatars
     */
    renderAvatarGrid() {
        if (!this.avatarGrid) return;

        this.avatarGrid.innerHTML = profileManager.predefinedAvatars.map(avatar => `
            <button class="avatar-option ${avatar.id === this.selectedAvatar ? 'selected' : ''}"
                    data-avatar-id="${avatar.id}"
                    title="${avatar.name}">
                ${avatar.emoji}
            </button>
        `).join('');

        this.avatarGrid.querySelectorAll('.avatar-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedAvatar = btn.dataset.avatarId;
                this.renderAvatarGrid();
                this.updatePreview();
            });
        });
    }

    /**
     * Affiche les swatches de couleur
     */
    renderColorSwatches() {
        if (!this.colorSwatches) return;

        this.colorSwatches.innerHTML = profileManager.predefinedColors.map(color => `
            <button class="color-swatch ${color.color === this.selectedColor ? 'selected' : ''}"
                    data-color="${color.color}"
                    style="background-color: ${color.color}"
                    title="${color.name}">
            </button>
        `).join('');

        this.colorSwatches.querySelectorAll('.color-swatch').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedColor = btn.dataset.color;
                this.renderColorSwatches();
                this.updatePreview();
            });
        });
    }

    /**
     * Met à jour la prévisualisation du profil
     */
    updatePreview() {
        const name = this.profileNameInput.value.trim() || 'Joueur';
        const avatar = profileManager.predefinedAvatars.find(a => a.id === this.selectedAvatar);
        const emoji = avatar ? avatar.emoji : '🧑‍🚀';

        if (this.previewAvatar) {
            this.previewAvatar.textContent = emoji;
            this.previewAvatar.style.borderColor = this.selectedColor;
        }
        if (this.previewName) {
            this.previewName.textContent = name;
            this.previewName.style.color = this.selectedColor;
        }
        if (this.profilePreview) {
            this.profilePreview.style.borderColor = this.selectedColor;
        }
    }

    /**
     * Sauvegarde le profil (création ou modification)
     */
    saveProfile() {
        const name = this.profileNameInput.value.trim();
        if (!name) {
            this.profileNameInput.classList.add('error');
            setTimeout(() => this.profileNameInput.classList.remove('error'), 500);
            return;
        }

        if (this.editingProfileId) {
            // Modification
            profileManager.updateProfile(this.editingProfileId, {
                name: name,
                avatarType: 'predefined',
                avatar: this.selectedAvatar,
                accentColor: this.selectedColor
            });
        } else {
            // Création
            const newProfile = profileManager.createProfile({
                name: name,
                avatarType: 'predefined',
                avatar: this.selectedAvatar,
                accentColor: this.selectedColor
            });

            // Sélectionner automatiquement le nouveau profil
            profileManager.setActiveProfile(newProfile.id);
        }

        this.closeProfileModal();
        this.renderProfilesList();
        this.updateCurrentPlayerDisplay();
    }

    /**
     * Supprime le profil en cours d'édition
     */
    deleteProfile() {
        if (!this.editingProfileId) return;

        // Confirmation simple
        if (confirm('Supprimer ce profil ?')) {
            profileManager.deleteProfile(this.editingProfileId);
            this.closeProfileModal();
            this.renderProfilesList();
            this.updateCurrentPlayerDisplay();
        }
    }

    // ====================== GESTION DU LEADERBOARD ======================

    /**
     * Affiche l'écran du leaderboard
     */
    showLeaderboard() {
        this.renderLeaderboard();
        this.showScreen('leaderboard');
    }

    /**
     * Cache l'écran du leaderboard
     */
    hideLeaderboard() {
        this.showScreen('menu');
    }

    /**
     * Réinitialise le leaderboard après confirmation
     */
    resetLeaderboard() {
        if (confirm('Es-tu sûr de vouloir réinitialiser le classement ?\nCette action est irréversible !')) {
            profileManager.resetLeaderboard();
            this.renderLeaderboard();
        }
    }

    /**
     * Affiche les entrées du leaderboard
     */
    renderLeaderboard() {
        if (!this.leaderboardList) return;

        const filters = {
            mode: this.leaderboardModeFilter ? this.leaderboardModeFilter.value : 'all',
            difficulty: this.leaderboardDifficultyFilter ? this.leaderboardDifficultyFilter.value : 'all'
        };

        const entries = profileManager.getLeaderboard(filters);

        if (entries.length === 0) {
            this.leaderboardList.innerHTML = '<div class="leaderboard-empty">Aucun score enregistré</div>';
            return;
        }

        this.leaderboardList.innerHTML = entries.map((entry, index) => {
            const rank = index + 1;
            let rankClass = '';
            if (rank === 1) rankClass = 'rank-1';
            else if (rank === 2) rankClass = 'rank-2';
            else if (rank === 3) rankClass = 'rank-3';

            return `
                <div class="leaderboard-entry ${rankClass}">
                    <div class="leaderboard-rank">${rank}</div>
                    <div class="leaderboard-player">
                        <span class="leaderboard-avatar">${entry.playerAvatar}</span>
                        <span class="leaderboard-name" style="color: ${entry.playerColor}">${entry.playerName}</span>
                    </div>
                    <div class="leaderboard-score">${entry.score.toLocaleString()}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Met à jour l'affichage des options selon le mode sélectionné
     */
    updateModeOptions() {
        if (this.timeOptions) {
            this.timeOptions.classList.toggle('hidden', this.selectedGameMode !== 'time');
        }
        if (this.asteroidsOptions) {
            this.asteroidsOptions.classList.toggle('hidden', this.selectedGameMode !== 'asteroids');
        }
    }

    /**
     * Retourne la configuration du mode de jeu sélectionné
     * @returns {Object}
     */
    getGameModeConfig() {
        return {
            mode: this.selectedGameMode,
            time: this.selectedTime,
            count: this.selectedCount
        };
    }

    /**
     * Récupère les tables sélectionnées
     * @returns {number[]}
     */
    getSelectedTables() {
        const tables = [];
        this.tableCheckboxes.forEach(cb => {
            if (cb.checked) {
                tables.push(parseInt(cb.value));
            }
        });
        return tables;
    }

    /**
     * Soumet la réponse du joueur
     */
    submitAnswer(callback) {
        const value = this.answerInput.value.trim();
        if (value === '') return;

        const answer = parseInt(value);
        if (!isNaN(answer)) {
            callback(answer);
        }
        this.answerInput.value = '';
    }

    /**
     * Affiche un écran
     * @param {string} screen - 'menu', 'game', 'gameover', 'pause', 'victory', 'leaderboard'
     */
    showScreen(screen) {
        this.menuScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.gameoverScreen.classList.remove('active');
        this.pauseScreen.classList.remove('active');
        if (this.victoryScreen) {
            this.victoryScreen.classList.remove('active');
        }
        if (this.leaderboardScreen) {
            this.leaderboardScreen.classList.remove('active');
        }

        switch (screen) {
            case 'menu':
                this.menuScreen.classList.add('active');
                break;
            case 'game':
                this.gameScreen.classList.add('active');
                this.answerInput.focus();
                break;
            case 'gameover':
                this.gameoverScreen.classList.add('active');
                break;
            case 'pause':
                this.pauseScreen.classList.add('active');
                break;
            case 'victory':
                if (this.victoryScreen) {
                    this.victoryScreen.classList.add('active');
                }
                break;
            case 'leaderboard':
                if (this.leaderboardScreen) {
                    this.leaderboardScreen.classList.add('active');
                }
                break;
        }
    }

    /**
     * Met à jour l'affichage du score
     * @param {number} score
     */
    updateScore(score) {
        this.scoreDisplay.textContent = score.toLocaleString();
    }

    /**
     * Met à jour l'affichage du combo
     * @param {number} combo
     */
    updateCombo(combo) {
        this.comboDisplay.textContent = `x${combo}`;
        if (combo > 1) {
            this.comboDisplay.classList.add('active');
            setTimeout(() => this.comboDisplay.classList.remove('active'), 300);
        }
    }

    /**
     * Met à jour l'affichage des vies
     * @param {number} lives
     */
    updateLives(lives) {
        const lifeElements = this.livesContainer.querySelectorAll('.life');
        lifeElements.forEach((life, index) => {
            if (index >= lives) {
                life.classList.add('lost');
            } else {
                life.classList.remove('lost');
            }
        });
    }

    /**
     * Réinitialise l'affichage des vies
     */
    resetLives() {
        const lifeElements = this.livesContainer.querySelectorAll('.life');
        lifeElements.forEach(life => life.classList.remove('lost'));
    }

    /**
     * Effet visuel pour bonne réponse
     */
    showSuccess() {
        this.answerInput.classList.add('success');
        setTimeout(() => this.answerInput.classList.remove('success'), 300);
    }

    /**
     * Effet visuel pour mauvaise réponse
     */
    showError(message) {
        this.answerInput.classList.add('error');
        setTimeout(() => this.answerInput.classList.remove('error'), 500);
    }

    /**
     * Affiche l'écran de game over
     * @param {Object} stats - Statistiques de la partie
     */
    showGameOver(stats) {
        this.finalScore.textContent = stats.score.toLocaleString();
        this.bestCombo.textContent = `x${stats.maxCombo}`;
        this.asteroidsDestroyed.textContent = stats.destroyed;

        const newRecordEl = this.gameoverScreen.querySelector('.new-record');
        if (stats.isNewRecord) {
            newRecordEl.classList.remove('hidden');
        } else {
            newRecordEl.classList.add('hidden');
        }

        this.showScreen('gameover');
    }

    /**
     * Met à jour le meilleur score
     * @param {number} score
     */
    updateHighScore(score) {
        this.menuHighScore.textContent = score.toLocaleString();
    }

    /**
     * Crée une explosion visuelle améliorée
     * @param {number} x - Position X
     * @param {number} y - Position Y
     */
    createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';

        // Flash central
        const flash = document.createElement('div');
        flash.className = 'explosion-flash';
        explosion.appendChild(flash);

        // Anneau d'onde de choc
        const shockwave = document.createElement('div');
        shockwave.className = 'explosion-shockwave';
        explosion.appendChild(shockwave);

        // Particules principales
        const colors = ['#ff5252', '#ffd740', '#ff9800', '#ffeb3b', '#ffffff'];
        const particleCount = 16;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const size = 6 + Math.random() * 8;

            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.animationDuration = (0.4 + Math.random() * 0.3) + 's';

            explosion.appendChild(particle);
        }

        // Étincelles secondaires
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.className = 'explosion-spark';

            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 80;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            spark.style.setProperty('--tx', tx + 'px');
            spark.style.setProperty('--ty', ty + 'px');
            spark.style.animationDelay = (Math.random() * 0.1) + 's';

            explosion.appendChild(spark);
        }

        this.gameScreen.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 800);
    }

    /**
     * Crée un effet d'impact sur la Terre
     * @param {number} x - Position X de l'impact
     * @param {number} y - Position Y de l'impact
     * @param {number} size - Taille de l'astéroïde
     */
    createEarthImpact(x, y, size) {
        const impact = document.createElement('div');
        impact.className = 'earth-impact';
        impact.style.left = x + 'px';
        impact.style.top = y + 'px';

        // Flash d'impact rouge
        const flash = document.createElement('div');
        flash.className = 'impact-flash';
        impact.appendChild(flash);

        // Onde de choc au sol
        const shockwave = document.createElement('div');
        shockwave.className = 'impact-shockwave';
        impact.appendChild(shockwave);

        // Débris qui remontent
        const debrisColors = ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887'];
        const debrisCount = 12;

        for (let i = 0; i < debrisCount; i++) {
            const debris = document.createElement('div');
            debris.className = 'impact-debris';
            debris.style.backgroundColor = debrisColors[Math.floor(Math.random() * debrisColors.length)];

            // Les débris remontent en arc
            const spreadAngle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
            const distance = 50 + Math.random() * 100;
            const tx = Math.cos(spreadAngle) * distance;
            const ty = Math.sin(spreadAngle) * distance - 30; // Remonte puis redescend

            const debrisSize = 4 + Math.random() * 8;
            debris.style.width = debrisSize + 'px';
            debris.style.height = debrisSize + 'px';
            debris.style.setProperty('--tx', tx + 'px');
            debris.style.setProperty('--ty', ty + 'px');
            debris.style.animationDelay = (Math.random() * 0.1) + 's';

            impact.appendChild(debris);
        }

        // Effet de tremblement de l'écran
        this.gameScreen.classList.add('screen-shake');
        setTimeout(() => {
            this.gameScreen.classList.remove('screen-shake');
        }, 300);

        this.gameScreen.appendChild(impact);

        setTimeout(() => {
            impact.remove();
        }, 1000);
    }

    /**
     * Crée un laser visuel orienté vers la cible avec effet de voyage
     * @param {number} startX - Position X de départ
     * @param {number} startY - Position Y de départ
     * @param {number} endX - Position X de fin (cible)
     * @param {number} endY - Position Y de fin (cible)
     * @returns {number} - Durée du voyage en ms pour synchroniser l'explosion
     */
    createLaser(startX, startY, endX, endY) {
        // Calculer la longueur et l'angle du laser
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dx, -dy); // angle depuis la verticale (vers le haut)

        // Calculer le temps de voyage basé sur la distance (vitesse: ~2000px/s)
        const travelTime = Math.max(150, Math.min(400, length / 2));

        // 1. Flash de bouche (muzzle flash) au niveau du canon
        const muzzleFlash = document.createElement('div');
        muzzleFlash.className = 'laser-muzzle-flash';
        muzzleFlash.style.left = startX + 'px';
        muzzleFlash.style.top = startY + 'px';
        this.gameScreen.appendChild(muzzleFlash);

        setTimeout(() => muzzleFlash.remove(), 200);

        // 2. Faisceau laser principal
        const laser = document.createElement('div');
        laser.className = 'laser-beam shooting';
        laser.style.setProperty('--travel-time', travelTime + 'ms');
        laser.style.left = startX + 'px';
        laser.style.top = startY + 'px';
        laser.style.height = length + 'px';
        laser.style.transform = `translateX(-50%) rotate(${angle}rad)`;
        laser.style.transformOrigin = 'top center';

        this.gameScreen.appendChild(laser);

        // 3. Tête lumineuse qui voyage vers la cible
        const laserHead = document.createElement('div');
        laserHead.className = 'laser-head';
        laserHead.style.setProperty('--travel-time', travelTime + 'ms');

        // Animer la position de la tête du laser
        const startTime = performance.now();
        const animateHead = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / travelTime);

            // Position interpolée
            const currentX = startX + dx * progress;
            const currentY = startY + dy * progress;

            laserHead.style.left = currentX + 'px';
            laserHead.style.top = currentY + 'px';

            if (progress < 1) {
                requestAnimationFrame(animateHead);
            }
        };

        this.gameScreen.appendChild(laserHead);
        requestAnimationFrame(animateHead);

        // 4. Particules le long du trajet
        const particleCount = Math.floor(length / 50);
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'laser-particle';

                const progress = (i + 1) / (particleCount + 1);
                const px = startX + dx * progress;
                const py = startY + dy * progress;

                // Décalage aléatoire perpendiculaire au laser
                const perpX = -dy / length;
                const perpY = dx / length;
                const offset = (Math.random() - 0.5) * 20;

                particle.style.left = (px + perpX * offset) + 'px';
                particle.style.top = (py + perpY * offset) + 'px';
                particle.style.setProperty('--px', (perpX * offset * 2) + 'px');
                particle.style.setProperty('--py', (perpY * offset * 2) + 'px');

                this.gameScreen.appendChild(particle);
                setTimeout(() => particle.remove(), 300);
            }, (travelTime * 0.6 * i) / particleCount);
        }

        // Nettoyer les éléments après l'animation
        setTimeout(() => {
            laser.remove();
            laserHead.remove();
        }, travelTime + 100);

        return travelTime;
    }

    /**
     * Affiche les points gagnés
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} points - Points gagnés
     */
    showPoints(x, y, points) {
        const pointsEl = document.createElement('div');
        pointsEl.className = 'floating-points';
        pointsEl.textContent = '+' + points;
        pointsEl.style.left = x + 'px';
        pointsEl.style.top = y + 'px';

        this.gameScreen.appendChild(pointsEl);

        setTimeout(() => {
            pointsEl.remove();
        }, 1000);
    }

    /**
     * Focus sur l'input de réponse
     */
    focusInput() {
        this.answerInput.focus();
    }

    /**
     * Affiche la bonne réponse quand un astéroïde touche la Terre
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {string} question - La question (ex: "5 × 7")
     * @param {number} answer - La réponse correcte
     */
    showMissedAnswer(x, y, question, answer) {
        const missedEl = document.createElement('div');
        missedEl.className = 'missed-answer';
        missedEl.innerHTML = `${question} = <strong>${answer}</strong>`;
        missedEl.style.left = x + 'px';
        missedEl.style.top = y + 'px';

        this.gameScreen.appendChild(missedEl);

        setTimeout(() => {
            missedEl.remove();
        }, 4000);
    }

    /**
     * Affiche un message d'encouragement après une bonne réponse
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} combo - Combo actuel
     * @param {number} timeBonus - Bonus de temps (1.0 à 2.0)
     */
    showEncouragement(x, y, combo, timeBonus) {
        const encouragementEl = document.createElement('div');

        // Si réponse très rapide (timeBonus >= 2.0), afficher "PARFAIT!"
        if (timeBonus >= 2.0) {
            encouragementEl.className = 'encouragement perfect-answer';
            encouragementEl.textContent = 'PARFAIT!';
        } else {
            // Messages d'encouragement variés selon le combo
            const messages = this.getEncouragementMessage(combo, timeBonus);
            encouragementEl.className = 'encouragement';
            encouragementEl.textContent = messages;
        }

        encouragementEl.style.left = x + 'px';
        encouragementEl.style.top = y + 'px';

        this.gameScreen.appendChild(encouragementEl);

        setTimeout(() => {
            encouragementEl.remove();
        }, 1200);
    }

    /**
     * Retourne un message d'encouragement approprié
     * @param {number} combo - Combo actuel
     * @param {number} timeBonus - Bonus de temps
     * @returns {string}
     */
    getEncouragementMessage(combo, timeBonus) {
        // Messages pour combos élevés
        if (combo >= 15) {
            const highComboMessages = ['LEGENDAIRE!', 'IMBATTABLE!', 'PHENOMENAL!'];
            return highComboMessages[Math.floor(Math.random() * highComboMessages.length)];
        }
        if (combo >= 10) {
            const veryHighMessages = ['INCROYABLE!', 'FANTASTIQUE!', 'EXTRAORDINAIRE!'];
            return veryHighMessages[Math.floor(Math.random() * veryHighMessages.length)];
        }
        if (combo >= 5) {
            const highMessages = ['EN FEU!', 'GENIAL!', 'EXCELLENT!'];
            return highMessages[Math.floor(Math.random() * highMessages.length)];
        }

        // Messages pour réponses rapides
        if (timeBonus >= 1.5) {
            const fastMessages = ['Rapide!', 'Vite!', 'Super!'];
            return fastMessages[Math.floor(Math.random() * fastMessages.length)];
        }

        // Messages standards
        const standardMessages = ['Bravo!', 'Bien!', 'Continue!', 'Oui!'];
        return standardMessages[Math.floor(Math.random() * standardMessages.length)];
    }

    /**
     * Crée un effet de confettis pour célébrer les hauts combos
     * @param {number} x - Position X centrale
     * @param {number} y - Position Y centrale
     */
    createConfetti(x, y) {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.left = x + 'px';
        confettiContainer.style.top = y + 'px';

        const colors = ['#ff5252', '#ffd740', '#69f0ae', '#4fc3f7', '#7c4dff', '#ff4081'];
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Direction aléatoire
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 120;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            // Taille aléatoire
            const size = 6 + Math.random() * 8;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';

            // Forme aléatoire (carré ou cercle)
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }

            confetti.style.setProperty('--tx', tx + 'px');
            confetti.style.setProperty('--ty', ty + 'px');
            confetti.style.setProperty('--rotation', (Math.random() * 720 - 360) + 'deg');
            confetti.style.animationDelay = (Math.random() * 0.2) + 's';
            confetti.style.animationDuration = (0.8 + Math.random() * 0.4) + 's';

            confettiContainer.appendChild(confetti);
        }

        this.gameScreen.appendChild(confettiContainer);

        setTimeout(() => {
            confettiContainer.remove();
        }, 1500);
    }

    /**
     * Configure l'affichage du HUD selon le mode de jeu
     * @param {string} mode - Mode de jeu
     * @param {number} time - Temps restant (mode temps)
     * @param {number} target - Nombre d'astéroïdes cible (mode astéroïdes)
     */
    setupModeDisplay(mode, time, target) {
        if (this.timeDisplay) {
            this.timeDisplay.classList.toggle('hidden', mode !== 'time');
        }
        if (this.progressDisplay) {
            this.progressDisplay.classList.toggle('hidden', mode !== 'asteroids');
        }

        if (mode === 'time' && this.timerSpan) {
            this.updateTimer(time);
        }

        if (mode === 'asteroids' && this.progressSpan) {
            this.updateProgress(0, target);
        }
    }

    /**
     * Met à jour l'affichage du timer
     * @param {number} seconds - Secondes restantes
     */
    updateTimer(seconds) {
        if (!this.timerSpan) return;

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        this.timerSpan.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

        // Avertissement quand < 10 secondes
        if (seconds <= 10 && seconds > 0) {
            this.timerSpan.classList.add('warning');
        } else {
            this.timerSpan.classList.remove('warning');
        }
    }

    /**
     * Met à jour l'affichage de la progression
     * @param {number} current - Astéroïdes détruits
     * @param {number} target - Objectif
     */
    updateProgress(current, target) {
        if (!this.progressSpan) return;
        this.progressSpan.textContent = `${current}/${target}`;
    }

    /**
     * Affiche l'écran de victoire
     * @param {Object} stats - Statistiques de la partie
     */
    showVictory(stats) {
        if (this.victoryScore) {
            this.victoryScore.textContent = stats.score.toLocaleString();
        }
        if (this.victoryCombo) {
            this.victoryCombo.textContent = `x${stats.maxCombo}`;
        }
        if (this.victoryDestroyed) {
            this.victoryDestroyed.textContent = stats.destroyed;
        }

        if (this.victoryScreen) {
            const newRecordEl = this.victoryScreen.querySelector('.new-record');
            if (newRecordEl) {
                if (stats.isNewRecord) {
                    newRecordEl.classList.remove('hidden');
                } else {
                    newRecordEl.classList.add('hidden');
                }
            }
        }

        this.showScreen('victory');
        this.createVictoryConfetti();
    }

    /**
     * Cree une pluie de confettis pour la victoire
     */
    createVictoryConfetti() {
        if (!this.victoryScreen) return;

        const confettiRain = this.victoryScreen.querySelector('.confetti-rain');
        if (!confettiRain) return;

        // Nettoyer les confettis precedents
        confettiRain.innerHTML = '';

        const colors = ['#ff5252', '#ffd740', '#69f0ae', '#4fc3f7', '#7c4dff', '#ff4081', '#ffeb3b'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'victory-confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

            // Forme aleatoire
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }

            confettiRain.appendChild(confetti);
        }
    }

    // ====================== SYSTEME DE POWERUP ======================

    /**
     * Met a jour l'icone du powerup stocke
     * @param {string|null} type - Type de powerup (shield, freeze, repulsor) ou null pour masquer
     */
    updatePowerUpIcon(type) {
        // Supprimer l'icone existante
        if (this.powerUpIcon) {
            this.powerUpIcon.remove();
            this.powerUpIcon = null;
        }

        if (!type) return;

        // Creer la nouvelle icone
        this.powerUpIcon = document.createElement('div');
        this.powerUpIcon.className = `powerup-icon ${type}`;
        this.powerUpIcon.innerHTML = this.getPowerUpIconSVG(type);

        // Ajouter l'indication "Espace"
        const hint = document.createElement('div');
        hint.className = 'powerup-icon-hint';
        hint.textContent = '[Espace]';
        this.powerUpIcon.appendChild(hint);

        this.gameScreen.appendChild(this.powerUpIcon);
    }

    /**
     * Retourne le SVG de l'icone selon le type
     * @param {string} type
     * @returns {string}
     */
    getPowerUpIconSVG(type) {
        switch (type) {
            case 'shield':
                return `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>`;
            case 'freeze':
                return `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>
                </svg>`;
            case 'repulsor':
                return `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>`;
            default:
                return '';
        }
    }

    /**
     * Cree l'effet de bouclier autour de la Terre
     */
    createShieldEffect() {
        // Supprimer un bouclier existant
        if (this.shieldBubble) {
            this.shieldBubble.remove();
        }

        this.shieldBubble = document.createElement('div');
        this.shieldBubble.className = 'shield-bubble';
        this.gameScreen.appendChild(this.shieldBubble);
    }

    /**
     * Supprime l'effet de bouclier
     */
    removeShieldEffect() {
        if (this.shieldBubble) {
            this.shieldBubble.remove();
            this.shieldBubble = null;
        }
    }

    /**
     * Affiche un flash quand le bouclier bloque un impact
     */
    showShieldBlock() {
        const flash = document.createElement('div');
        flash.className = 'shield-block-flash';
        this.gameScreen.appendChild(flash);

        setTimeout(() => {
            flash.remove();
        }, 500);
    }

    /**
     * Cree l'effet de gel sur l'ecran
     */
    createFreezeEffect() {
        // Supprimer un effet existant
        if (this.freezeOverlay) {
            this.freezeOverlay.remove();
        }

        this.freezeOverlay = document.createElement('div');
        this.freezeOverlay.className = 'freeze-overlay';
        this.gameScreen.appendChild(this.freezeOverlay);
    }

    /**
     * Retire l'effet de gel avec animation de fondu
     */
    hideFreezeOverlay() {
        if (this.freezeOverlay) {
            this.freezeOverlay.classList.add('fading');
            setTimeout(() => {
                if (this.freezeOverlay) {
                    this.freezeOverlay.remove();
                    this.freezeOverlay = null;
                }
            }, 500);
        }
    }

    /**
     * Cree l'effet d'onde de choc du repulseur
     * @param {number} x - Position X du centre
     * @param {number} y - Position Y du centre
     */
    createRepulsorEffect(x, y) {
        const wave = document.createElement('div');
        wave.className = 'repulsor-wave';
        wave.style.left = (x - 25) + 'px';
        wave.style.top = (y - 25) + 'px';
        this.gameScreen.appendChild(wave);

        setTimeout(() => {
            wave.remove();
        }, 800);
    }

    /**
     * Affiche un message de collecte de powerup
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {string} type - Type de powerup
     */
    showPowerUpCollected(x, y, type) {
        const message = document.createElement('div');
        message.className = `powerup-collected ${type}`;

        let typeName = '';
        switch (type) {
            case 'shield': typeName = 'Bouclier'; break;
            case 'freeze': typeName = 'Gel'; break;
            case 'repulsor': typeName = 'Repulseur'; break;
            default: typeName = 'PowerUp';
        }

        message.textContent = `${typeName} obtenu!`;
        message.style.left = x + 'px';
        message.style.top = y + 'px';

        this.gameScreen.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 1500);
    }
}

// Instance globale
const ui = new UIManager();
