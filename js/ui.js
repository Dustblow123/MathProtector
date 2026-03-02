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
        this.musicBtns = document.querySelectorAll('.music-btn');

        // Répétition espacée
        this.srCheckbox   = document.getElementById('sr-enabled-checkbox');
        this.srWidget     = document.getElementById('sr-widget');
        this.srDueLabel   = document.getElementById('sr-due-label');
        this.srMastered   = document.getElementById('sr-mastered-count');
        this.srLearning   = document.getElementById('sr-learning-count');
        this.srTotal      = document.getElementById('sr-total-count');
        this.srStartBtn   = document.getElementById('sr-start-btn');
        this.srUptodateMsg = document.getElementById('sr-uptodate-msg');
        this.srResetBtn   = document.getElementById('sr-reset-btn');

        // Éléments du jeu
        this.canvas = document.getElementById('game-canvas');
        this.scoreDisplay = document.getElementById('score');
        this.comboDisplay = document.getElementById('combo');
        this.livesContainer = document.getElementById('lives');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-answer');
        this.pauseBtn = document.getElementById('pause-btn');
        this.gameMusicBtn = document.getElementById('game-music-btn');
        this.gameSfxBtn = document.getElementById('game-sfx-btn');

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

        // Mode armageddon
        this.armageddonModeCheckbox = document.getElementById('armageddon-mode');
        this.armageddonOptions = document.getElementById('armageddon-options');
        this.armageddonLevelBtns = document.querySelectorAll('.armageddon-level-btn');
        this.armageddonDescEl = document.getElementById('armageddon-desc');

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

        // Éléments révision
        this.reviewScreen = document.getElementById('review-screen');
        this.reviewScore = document.getElementById('review-score');
        this.reviewErrorCount = document.getElementById('review-error-count');
        this.reviewErrorsList = document.getElementById('review-errors-list');
        this.reviewReplayBtn = document.getElementById('review-replay-btn');
        this.reviewMenuBtn = document.getElementById('review-menu-btn');
        this.gameoverReviewBtn = document.getElementById('gameover-review-btn');

        // Éléments entraînement
        this.trainingScreen = document.getElementById('training-screen');
        this.weakAreasList = document.getElementById('weak-areas-list');
        this.trainingCheckboxes = document.getElementById('training-checkboxes');
        this.trainingStartBtn = document.getElementById('training-start-btn');
        this.trainingBackBtn = document.getElementById('training-back-btn');
        this.trainingMenuBtn = document.getElementById('training-menu-btn');
        this.selectedTrainingCount = 20;
        this.selectedWeakAreas = [];

        // Éléments statistiques
        this.statisticsScreen = document.getElementById('statistics-screen');
        this.statsChartCanvas = document.getElementById('stats-chart');
        this.statsTabs = document.querySelectorAll('.stats-tab');
        this.frequentErrorsList = document.getElementById('frequent-errors-list');
        this.statsBackBtn = document.getElementById('stats-back-btn');
        this.statsMenuBtn = document.getElementById('stats-menu-btn');
        this.statsResetBtn = document.getElementById('stats-reset-btn');
        this.statsChart = null;

        // Bouton reset entraînement
        this.trainingResetBtn = document.getElementById('training-reset-btn');

        // Erreurs de la dernière partie (pour révision)
        this.lastGameErrors = [];

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

        // État des opérations
        this.selectedOperation = 'multiplication';
        this.selectedDigitCount = 1;
        this.allowNegatives = false;

        // Éléments opérations
        this.operationBtns = document.querySelectorAll('.operation-btn');
        this.operationOptions = document.getElementById('operation-options');
        this.tablesSection = document.getElementById('tables-section');
        this.negativeOption = document.getElementById('negative-option');
        this.allowNegativesCheckbox = document.getElementById('allow-negatives');
        this.digitBtns = document.querySelectorAll('.digit-btn');
        this.gameSubtitle = document.getElementById('game-subtitle');

        // PowerUp
        this.powerUpIcon = null;
        this.shieldBubble = null;
        this.freezeOverlay = null;
        this.multishotOverlay = null;
        this.slowdownOverlay = null;

        // Numpad layout
        this.numpadLayout = localStorage.getItem('mathGameNumpadLayout') || 'right';

        // Auto-validate
        this.autoValidate = localStorage.getItem('mathGameAutoValidate') !== 'false'; // default true
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

        // Sélection type d'opération
        this.operationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.operationBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedOperation = btn.dataset.operation;
                this.updateOperationOptions();
            });
        });

        // Sélection nombre de chiffres
        this.digitBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.digitBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDigitCount = parseInt(btn.dataset.digits);
            });
        });

        // Checkbox résultats négatifs
        if (this.allowNegativesCheckbox) {
            this.allowNegativesCheckbox.addEventListener('change', () => {
                this.allowNegatives = this.allowNegativesCheckbox.checked;
            });
        }

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

        // Sélecteur de musique (menu)
        this.musicBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.musicBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                callbacks.onSelectMusic(btn.dataset.music);
            });
        });
        // Marquer la musique sauvegardée comme active au démarrage
        const savedMusic = localStorage.getItem('mathGameMusic') || 'base';
        this.musicBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.music === savedMusic);
        });

        // Répétition espacée — checkbox
        if (this.srCheckbox) {
            // État initial depuis localStorage
            this.srCheckbox.checked = localStorage.getItem('mathGameSREnabled') !== 'false';
            this.srCheckbox.addEventListener('change', () => {
                callbacks.onToggleSR(this.srCheckbox.checked);
            });
        }

        // Répétition espacée — bouton "Commencer la révision"
        if (this.srStartBtn) {
            this.srStartBtn.addEventListener('click', () => {
                callbacks.onStartSRReview();
            });
        }

        // Répétition espacée — bouton "Remettre à zéro"
        if (this.srResetBtn) {
            this.srResetBtn.addEventListener('click', () => {
                callbacks.onResetSR();
            });
        }

        // Démarrer le jeu
        this.startBtn.addEventListener('click', () => {
            const tables = this.getSelectedTables();
            const needsTables = ['multiplication', 'division'].includes(this.selectedOperation);

            if (needsTables && tables.length === 0) {
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
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                this.answerInput.value = '';
            }
        });

        // Auto-validate on input
        this.answerInput.addEventListener('input', () => {
            this.tryAutoValidate(callbacks.onSubmitAnswer);
        });

        this.submitBtn.addEventListener('click', () => {
            this.submitAnswer(callbacks.onSubmitAnswer);
        });

        // Store callback for auto-validate
        this.onSubmitAnswer = callbacks.onSubmitAnswer;

        // Pause
        this.pauseBtn.addEventListener('click', () => {
            callbacks.onPause();
        });

        // Musique pendant le jeu
        if (this.gameMusicBtn) {
            this.gameMusicBtn.addEventListener('click', () => {
                const enabled = callbacks.onToggleMusic();
                this.gameMusicBtn.classList.toggle('muted', !enabled);
            });
        }

        // Effets sonores pendant le jeu
        if (this.gameSfxBtn) {
            this.gameSfxBtn.addEventListener('click', () => {
                const enabled = callbacks.onToggleSound();
                this.gameSfxBtn.classList.toggle('muted', !enabled);
            });
        }

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
                this.updateModeDescriptions();
            });
        }

        // Mode armageddon
        if (this.armageddonModeCheckbox) {
            this.armageddonModeCheckbox.addEventListener('change', () => {
                const enabled = this.armageddonModeCheckbox.checked;
                callbacks.onToggleArmageddonMode(enabled);
                if (this.armageddonOptions) {
                    this.armageddonOptions.classList.toggle('hidden', !enabled);
                }
                this.updateModeDescriptions();
            });
        }

        // Niveaux armageddon
        const armageddonDescs = { 1: 'Spawn modéré', 2: 'Spawn intense', 3: 'Chaos total !' };
        this.armageddonLevelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.armageddonLevelBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const level = parseInt(btn.dataset.level);
                callbacks.onSetArmageddonLevel(level);
                if (this.armageddonDescEl) {
                    this.armageddonDescEl.textContent = armageddonDescs[level];
                }
            });
        });

        // Auto-validate checkbox
        const autoValidateCheckbox = document.getElementById('auto-validate-checkbox');
        if (autoValidateCheckbox) {
            autoValidateCheckbox.checked = this.autoValidate;
            autoValidateCheckbox.addEventListener('change', () => {
                this.autoValidate = autoValidateCheckbox.checked;
                localStorage.setItem('mathGameAutoValidate', this.autoValidate.toString());
                this.updateSubmitBtnVisibility();
            });
        }

        // Numpad layout buttons
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setNumpadLayout(btn.dataset.layout);
            });
        });
        // Restore active layout button on load
        const savedLayout = this.numpadLayout;
        document.querySelectorAll('.layout-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.layout === savedLayout);
        });

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

        // Initialiser les événements des nouvelles fonctionnalités
        this.initReviewEvents(callbacks);
        this.initTrainingEvents(callbacks);
        this.initStatisticsEvents();

        // Afficher le profil actif
        this.updateCurrentPlayerDisplay();
    }

    /**
     * Initialise les événements de l'écran de révision
     */
    initReviewEvents(callbacks) {
        // Bouton révision sur l'écran game over
        if (this.gameoverReviewBtn) {
            this.gameoverReviewBtn.addEventListener('click', () => {
                this.showReviewScreen();
            });
        }

        // Bouton rejouer les questions
        if (this.reviewReplayBtn) {
            this.reviewReplayBtn.addEventListener('click', () => {
                if (this.lastGameErrors.length > 0) {
                    // Lancer le mode révision avec les erreurs
                    window.game.startReviewMode(this.lastGameErrors);
                }
            });
        }

        // Bouton retour menu
        if (this.reviewMenuBtn) {
            this.reviewMenuBtn.addEventListener('click', () => {
                callbacks.onQuit();
            });
        }
    }

    /**
     * Initialise les événements de l'écran d'entraînement
     */
    initTrainingEvents(callbacks) {
        // Bouton menu entraînement
        if (this.trainingMenuBtn) {
            this.trainingMenuBtn.addEventListener('click', () => {
                this.showTrainingScreen();
            });
        }

        // Bouton retour
        if (this.trainingBackBtn) {
            this.trainingBackBtn.addEventListener('click', () => {
                this.showScreen('menu');
            });
        }

        // Boutons de comptage
        const countBtns = document.querySelectorAll('.count-btn');
        countBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                countBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedTrainingCount = parseInt(btn.dataset.count);
            });
        });

        // Bouton démarrer entraînement
        if (this.trainingStartBtn) {
            this.trainingStartBtn.addEventListener('click', () => {
                this.startTrainingMode(callbacks);
            });
        }

        // Bouton réinitialiser entraînement
        if (this.trainingResetBtn) {
            this.trainingResetBtn.addEventListener('click', () => {
                this.resetTrainingData();
            });
        }
    }

    /**
     * Initialise les événements de l'écran de statistiques
     */
    initStatisticsEvents() {
        // Bouton menu stats
        if (this.statsMenuBtn) {
            this.statsMenuBtn.addEventListener('click', () => {
                this.showStatisticsScreen();
            });
        }

        // Bouton retour
        if (this.statsBackBtn) {
            this.statsBackBtn.addEventListener('click', () => {
                this.showScreen('menu');
            });
        }

        // Onglets statistiques
        this.statsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.statsTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const profile = profileManager.getActiveProfile();
                if (profile) {
                    const stats = profileManager.getAggregatedStats(profile.id);
                    this.renderStatsChart(stats, tab.dataset.tab);
                }
            });
        });

        // Bouton réinitialiser statistiques
        if (this.statsResetBtn) {
            this.statsResetBtn.addEventListener('click', () => {
                this.resetStatistics();
            });
        }
    }

    /**
     * Initialise les événements pour le système de profils
     */
    initProfileEvents() {
        // Boutons "Créer mon profil" pour invités (game over + victory)
        ['gameover', 'victory'].forEach(screen => {
            const btn = document.getElementById(`guest-create-profile-${screen}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.showScreen('menu');
                    this.openPlayerPanel();
                });
            }
        });

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
            count: this.selectedCount,
            operation: {
                type: this.selectedOperation,
                tables: this.getSelectedTables(),
                digitCount: this.selectedDigitCount,
                allowNegatives: this.allowNegatives
            }
        };
    }

    /**
     * Met à jour l'affichage des options selon le type d'opération
     */
    updateOperationOptions() {
        const needsTables = ['multiplication', 'division'].includes(this.selectedOperation);
        const needsDigitConfig = ['addition', 'subtraction', 'combined'].includes(this.selectedOperation);
        const hasSub = ['subtraction', 'combined'].includes(this.selectedOperation);
        const noConfig = ['fractions', 'percentages', 'powers'].includes(this.selectedOperation);

        // Afficher/masquer la section des tables
        if (this.tablesSection) {
            this.tablesSection.classList.toggle('hidden', !needsTables);
        }

        // Afficher/masquer les options de configuration
        if (this.operationOptions) {
            this.operationOptions.classList.toggle('hidden', !needsDigitConfig || noConfig);
        }

        // Afficher/masquer l'option des résultats négatifs
        if (this.negativeOption) {
            this.negativeOption.classList.toggle('hidden', !hasSub || noConfig);
        }

        // Mise à jour du sous-titre
        const subtitles = {
            multiplication: 'Tables de Multiplication',
            addition: 'Additions',
            subtraction: 'Soustractions',
            division: 'Divisions',
            combined: 'Calcul Mental',
            fractions: 'Fractions',
            percentages: 'Pourcentages',
            powers: 'Puissances'
        };

        if (this.gameSubtitle) {
            this.gameSubtitle.textContent = subtitles[this.selectedOperation] || 'Calcul Mental';
        }
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
     * Try auto-validation if enabled
     */
    tryAutoValidate(callback) {
        if (!this.autoValidate) return;
        const activeInput = this.getActiveNumpadInput();
        const value = (activeInput === this.answerInput) ? this.answerInput.value.trim() : activeInput.value.trim();
        if (value === '' || value === '-') return;
        const answer = parseInt(value);
        if (isNaN(answer)) return;

        // Check if this answer matches any target
        if (window.game && window.game.isValidTarget(answer)) {
            // Sync inputs
            if (activeInput !== this.answerInput) {
                this.answerInput.value = activeInput.value;
            }
            callback(answer);
            this.answerInput.value = '';
            if (activeInput !== this.answerInput) {
                activeInput.value = '';
            }
        }
    }

    /**
     * Update submit button visibility based on auto-validate setting
     */
    updateSubmitBtnVisibility() {
        if (this.submitBtn) {
            this.submitBtn.style.display = this.autoValidate ? 'none' : '';
        }
        // Also hide/show numpad submit buttons
        document.querySelectorAll('.numpad-btn[data-value="submit"]').forEach(btn => {
            btn.style.display = this.autoValidate ? 'none' : '';
        });
        // Also for side panel
        const sideSubmit = document.querySelector('#numpad-side-panel .numpad-btn[data-value="submit"]');
        if (sideSubmit) {
            sideSubmit.style.display = this.autoValidate ? 'none' : '';
        }
    }

    /**
     * Affiche un écran
     * @param {string} screen - 'menu', 'game', 'gameover', 'pause', 'victory', 'leaderboard', 'review', 'training', 'statistics'
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
        if (this.reviewScreen) {
            this.reviewScreen.classList.remove('active');
        }
        if (this.trainingScreen) {
            this.trainingScreen.classList.remove('active');
        }
        if (this.statisticsScreen) {
            this.statisticsScreen.classList.remove('active');
        }

        switch (screen) {
            case 'menu':
                this.menuScreen.classList.add('active');
                break;
            case 'game':
                this.gameScreen.classList.add('active');
                this.answerInput.value = '';
                // Clear side numpad input too
                const sideInput = document.querySelector('.numpad-side-input');
                if (sideInput) sideInput.value = '';
                this.answerInput.focus({ preventScroll: true });
                this.updateSubmitBtnVisibility();
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
            case 'review':
                if (this.reviewScreen) {
                    this.reviewScreen.classList.add('active');
                }
                break;
            case 'training':
                if (this.trainingScreen) {
                    this.trainingScreen.classList.add('active');
                }
                break;
            case 'statistics':
                if (this.statisticsScreen) {
                    this.statisticsScreen.classList.add('active');
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
        // Reset to exactly 3 hearts (remove extras from extralife powerup)
        this.livesContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const life = document.createElement('span');
            life.className = 'life';
            life.textContent = '❤️';
            this.livesContainer.appendChild(life);
        }
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

        // Sauvegarder les erreurs pour la révision
        this.lastGameErrors = stats.errors || [];
        this.lastGameScore = stats.score;

        // Afficher/masquer le bouton de révision selon s'il y a des erreurs
        if (this.gameoverReviewBtn) {
            if (this.lastGameErrors.length > 0) {
                this.gameoverReviewBtn.classList.remove('hidden');
            } else {
                this.gameoverReviewBtn.classList.add('hidden');
            }
        }

        // Message invité si pas de profil
        this.showGuestPrompt('gameover');

        this.showScreen('gameover');
    }

    /**
     * Affiche le message invité si aucun profil n'est actif
     * @param {string} screen - 'gameover' ou 'victory'
     */
    showGuestPrompt(screen) {
        const prompt = document.getElementById(`guest-prompt-${screen}`);
        if (!prompt) return;

        const profile = profileManager.getActiveProfile();
        if (profile) {
            prompt.classList.add('hidden');
        } else {
            prompt.classList.remove('hidden');
        }
    }

    /**
     * Met à jour le meilleur score
     * @param {number} score
     */
    updateHighScore(score) {
        this.menuHighScore.textContent = score.toLocaleString();
    }

    /**
     * Met à jour le widget de répétition espacée dans le menu
     * @param {{ total, due, mastered, learning }} stats
     */
    updateSRWidget(stats) {
        if (!this.srWidget) return;

        this.srWidget.classList.remove('hidden');

        // Compteurs
        if (this.srMastered) this.srMastered.textContent = stats.mastered;
        if (this.srLearning) this.srLearning.textContent = stats.learning;
        if (this.srTotal)    this.srTotal.textContent    = stats.total;

        // Le bouton reset est visible dès qu'il y a des cartes
        if (this.srResetBtn) {
            if (stats.total > 0) {
                this.srResetBtn.classList.remove('hidden');
            } else {
                this.srResetBtn.classList.add('hidden');
            }
        }

        if (stats.total === 0) {
            // Aucune carte encore — pas de session possible
            if (this.srDueLabel)     this.srDueLabel.textContent = 'Joue une partie pour commencer !';
            if (this.srStartBtn)     this.srStartBtn.classList.add('hidden');
            if (this.srUptodateMsg)  this.srUptodateMsg.classList.add('hidden');
        } else if (stats.due === 0) {
            // Tout à jour — construire le message "quand revenir"
            if (this.srDueLabel) this.srDueLabel.textContent = 'Révisions du jour terminées';
            if (this.srStartBtn) this.srStartBtn.classList.add('hidden');
            if (this.srUptodateMsg) {
                this.srUptodateMsg.textContent = this._buildSRNextMessage(stats);
                this.srUptodateMsg.classList.remove('hidden');
            }
        } else {
            // Cartes dues
            const n = stats.due;
            if (this.srDueLabel) {
                this.srDueLabel.textContent = n === 1
                    ? '1 question à réviser aujourd\'hui'
                    : `${n} questions à réviser aujourd'hui`;
            }
            if (this.srStartBtn)    this.srStartBtn.classList.remove('hidden');
            if (this.srUptodateMsg) this.srUptodateMsg.classList.add('hidden');
        }
    }

    /**
     * Cache le widget SR (SR désactivé ou pas de profil)
     */
    hideSRWidget() {
        if (this.srWidget) this.srWidget.classList.add('hidden');
    }

    /**
     * Construit le message "quand revenir" selon l'état hybride sessions/jours.
     * @param {{ nextReviewSession, nextReviewDate, currentSession }} stats
     * @returns {string}
     */
    _buildSRNextMessage(stats) {
        const parts = [];

        // Phase sessions : combien de parties avant la prochaine révision ?
        if (stats.nextReviewSession !== null) {
            const delta = stats.nextReviewSession - stats.currentSession;
            if (delta <= 1) {
                parts.push('dès la prochaine partie');
            } else {
                parts.push(`dans ${delta} parties`);
            }
        }

        // Phase jours : dans combien de jours ?
        if (stats.nextReviewDate !== null) {
            const daysLeft = Math.ceil((stats.nextReviewDate - Date.now()) / 86_400_000);
            if (daysLeft <= 0) {
                parts.push('aujourd\'hui');
            } else if (daysLeft === 1) {
                parts.push('demain');
            } else {
                parts.push(`dans ${daysLeft} jours`);
            }
        }

        if (parts.length === 0) return 'Tout est maîtrisé ! ✓';
        return `Tout est à jour ✓ — Reviens ${parts.join(' · ')} !`;
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
     * @param {string} color - Couleur du laser (hex)
     * @returns {number} - Durée du voyage en ms pour synchroniser l'explosion
     */
    createLaser(startX, startY, endX, endY, color = '#4fc3f7') {
        // Calculer la longueur et l'angle du laser
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dx, -dy); // angle depuis la verticale (vers le haut)

        // Calculer le temps de voyage basé sur la distance (vitesse: ~2000px/s)
        const travelTime = Math.max(150, Math.min(400, length / 2));

        // Convertir la couleur hex en RGB pour les effets
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 79, g: 195, b: 247 };
        };
        const rgb = hexToRgb(color);

        // 1. Flash de bouche (muzzle flash) au niveau du canon
        const muzzleFlash = document.createElement('div');
        muzzleFlash.className = 'laser-muzzle-flash';
        muzzleFlash.style.left = startX + 'px';
        muzzleFlash.style.top = startY + 'px';
        muzzleFlash.style.setProperty('--laser-color', color);
        muzzleFlash.style.setProperty('--laser-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        this.gameScreen.appendChild(muzzleFlash);

        setTimeout(() => muzzleFlash.remove(), 200);

        // 2. Faisceau laser principal - dessiné sur le canvas
        // On ne crée plus d'élément DOM, le laser sera dessiné par game.js
        const laser = null;

        // 3. Tête lumineuse qui voyage vers la cible (DÉSACTIVÉE POUR TEST)
        let laserHead = null;
        /*
        const laserHead = document.createElement('div');
        laserHead.className = 'laser-head';
        laserHead.style.setProperty('--travel-time', travelTime + 'ms');
        laserHead.style.setProperty('--laser-color', color);
        laserHead.style.setProperty('--laser-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

        // Définir la position initiale AVANT d'ajouter au DOM
        laserHead.style.left = startX + 'px';
        laserHead.style.top = startY + 'px';

        this.gameScreen.appendChild(laserHead);

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

        requestAnimationFrame(animateHead);
        */

        // 4. Particules le long du trajet
        const particleCount = Math.floor(length / 50);
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'laser-particle';
                particle.style.setProperty('--laser-color', color);
                particle.style.setProperty('--laser-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

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
            if (laser) laser.remove();
            if (laserHead) laserHead.remove();
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
        // preventScroll évite le défilement automatique sur mobile
        this.answerInput.focus({ preventScroll: true });
    }

    /**
     * Ajuste l'interface pour le clavier virtuel mobile
     * @param {boolean} isOpen - Le clavier est-il ouvert
     * @param {number} keyboardHeight - Hauteur du clavier en pixels
     */
    adjustForKeyboard(isOpen, keyboardHeight) {
        const answerContainer = document.getElementById('answer-container');
        if (!answerContainer) return;

        if (isOpen) {
            // Repositionner l'input au-dessus du clavier
            // La classe keyboard-open sur game-screen gère cela via CSS
        } else {
            // Restaurer la position par défaut (via CSS)
        }
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

        // Message invité si pas de profil
        this.showGuestPrompt('victory');

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
     * Met a jour les icones de la file de powerups (max 3)
     * @param {string[]} types - Tableau de types de powerups
     */
    updatePowerUpIcons(types) {
        // Supprimer le conteneur existant
        const existing = document.getElementById('powerup-icons-container');
        if (existing) existing.remove();
        this.powerUpIcon = null;

        if (!types || types.length === 0) return;

        const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        const container = document.createElement('div');
        container.id = 'powerup-icons-container';
        container.className = 'powerup-icons-container';

        types.forEach((type, index) => {
            const icon = document.createElement('div');
            icon.className = `powerup-icon ${type}${index > 0 ? ' queued' : ''}`;
            icon.innerHTML = this.getPowerUpIconSVG(type);

            if (index === 0 && !isMobile) {
                const hint = document.createElement('div');
                hint.className = 'powerup-icon-hint';
                hint.textContent = '[Espace]';
                icon.appendChild(hint);
            }

            container.appendChild(icon);
        });

        this.gameScreen.appendChild(container);
        this.powerUpIcon = container.querySelector('.powerup-icon');
    }

    /**
     * @deprecated Utiliser updatePowerUpIcons() a la place
     */
    updatePowerUpIcon(type) {
        this.updatePowerUpIcons(type ? [type] : []);
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
            case 'extralife':
                return `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>`;
            case 'multishot':
                return `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                </svg>`;
            case 'slowdown':
                return `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
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
        const container = document.createElement('div');
        container.className = 'repulsor-container';
        container.style.left = x + 'px';
        container.style.top = y + 'px';

        // 3 anneaux concentriques avec délai décalé
        for (let i = 0; i < 3; i++) {
            const ring = document.createElement('div');
            ring.className = 'repulsor-wave-ring';
            ring.style.animationDelay = (i * 0.15) + 's';
            ring.style.borderColor = `rgba(255, ${152 + i * 30}, ${i * 40}, ${0.8 - i * 0.15})`;
            container.appendChild(ring);
        }

        // Flash central
        const flash = document.createElement('div');
        flash.className = 'repulsor-center-flash';
        container.appendChild(flash);

        // 24 particules projetées radialement
        const particleColors = ['#ff9800', '#ffd740', '#ffffff', '#ff5722', '#ffab40'];
        for (let i = 0; i < 24; i++) {
            const particle = document.createElement('div');
            particle.className = 'repulsor-particle';
            particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];

            const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
            const distance = 120 + Math.random() * 180;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const size = 4 + Math.random() * 6;

            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.animationDelay = (Math.random() * 0.1) + 's';

            container.appendChild(particle);
        }

        this.gameScreen.appendChild(container);

        // Screen shake
        this.gameScreen.classList.add('repulsor-shake');
        setTimeout(() => {
            this.gameScreen.classList.remove('repulsor-shake');
        }, 400);

        setTimeout(() => {
            container.remove();
        }, 1000);
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
            case 'extralife': typeName = 'Vie bonus'; break;
            case 'multishot': typeName = 'Multi-tir'; break;
            case 'slowdown': typeName = 'Ralenti'; break;
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

    // ====================== ÉCRAN DE RÉVISION ======================

    /**
     * Affiche l'écran de révision des erreurs
     */
    showReviewScreen() {
        if (this.reviewScore) {
            this.reviewScore.textContent = this.lastGameScore || 0;
        }
        if (this.reviewErrorCount) {
            this.reviewErrorCount.textContent = this.lastGameErrors.length;
        }

        this.renderReviewErrors(this.lastGameErrors);
        this.showScreen('review');
    }

    /**
     * Affiche les erreurs dans l'écran de révision
     * @param {Array} errors - Liste des erreurs
     */
    renderReviewErrors(errors) {
        if (!this.reviewErrorsList) return;

        if (errors.length === 0) {
            this.reviewErrorsList.innerHTML = '<p class="no-errors">Aucune erreur ! Bravo !</p>';
            if (this.reviewReplayBtn) {
                this.reviewReplayBtn.classList.add('hidden');
            }
            return;
        }

        if (this.reviewReplayBtn) {
            this.reviewReplayBtn.classList.remove('hidden');
        }

        this.reviewErrorsList.innerHTML = errors.map(e => `
            <div class="review-error-card">
                <div class="review-question">${e.question}</div>
                <div class="review-answers">
                    <span class="wrong">Ta réponse: ${e.givenAnswer !== null ? e.givenAnswer : 'Pas répondu'}</span>
                    <span class="correct">Correct: ${e.correctAnswer}</span>
                </div>
            </div>
        `).join('');
    }

    // ====================== ÉCRAN D'ENTRAÎNEMENT ======================

    /**
     * Affiche l'écran d'entraînement
     */
    showTrainingScreen() {
        const profile = profileManager.getActiveProfile();

        if (!profile) {
            this.showError('Crée un profil pour accéder à l\'entraînement');
            return;
        }

        const weakAreas = profileManager.getWeakAreas(profile.id);
        this.renderWeakAreas(weakAreas);
        this.renderTrainingCheckboxes(weakAreas);
        this.showScreen('training');
    }

    /**
     * Affiche les points faibles
     * @param {Array} weakAreas - Liste des points faibles
     */
    renderWeakAreas(weakAreas) {
        if (!this.weakAreasList) return;

        if (weakAreas.length === 0) {
            this.weakAreasList.innerHTML = '<p class="no-weak">Bravo ! Aucun point faible détecté. Continue à jouer pour que je puisse analyser tes performances.</p>';
            return;
        }

        this.weakAreasList.innerHTML = weakAreas.map(area => `
            <div class="weak-area-item">
                <span class="weak-label">${area.label}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${area.successRate}%; background: ${this.getSuccessColor(area.successRate)}"></div>
                </div>
                <span class="weak-percent">${area.successRate}%</span>
            </div>
        `).join('');
    }

    /**
     * Retourne une couleur selon le taux de réussite
     * @param {number} rate - Taux de réussite (0-100)
     * @returns {string}
     */
    getSuccessColor(rate) {
        if (rate < 30) return '#ff5252';
        if (rate < 50) return '#ff9800';
        if (rate < 70) return '#ffd740';
        return '#69f0ae';
    }

    /**
     * Affiche les checkboxes pour sélectionner les zones à travailler
     * @param {Array} weakAreas - Liste des points faibles
     */
    renderTrainingCheckboxes(weakAreas) {
        if (!this.trainingCheckboxes) return;

        this.selectedWeakAreas = [];

        if (weakAreas.length === 0) {
            this.trainingCheckboxes.innerHTML = '<p class="no-areas">Pas de données disponibles pour l\'entraînement ciblé.</p>';
            return;
        }

        this.trainingCheckboxes.innerHTML = weakAreas.map((area, index) => `
            <label class="training-checkbox">
                <input type="checkbox" value="${index}" data-type="${area.type}" data-value="${area.value}">
                <span>${area.label} (${area.successRate}%)</span>
            </label>
        `).join('');

        // Ajouter les event listeners
        this.trainingCheckboxes.querySelectorAll('input').forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    this.selectedWeakAreas.push({
                        type: cb.dataset.type,
                        value: cb.dataset.value
                    });
                } else {
                    this.selectedWeakAreas = this.selectedWeakAreas.filter(
                        a => !(a.type === cb.dataset.type && a.value === cb.dataset.value)
                    );
                }
            });
        });
    }

    /**
     * Démarre le mode entraînement
     * @param {Object} callbacks - Callbacks du jeu
     */
    startTrainingMode(callbacks) {
        if (this.selectedWeakAreas.length === 0) {
            this.showError('Sélectionne au moins un point à travailler');
            return;
        }

        // Construire la configuration d'entraînement
        const tables = [];
        let operationType = 'combined';

        this.selectedWeakAreas.forEach(area => {
            if (area.type === 'table') {
                tables.push(parseInt(area.value));
            } else if (area.type === 'operation') {
                operationType = area.value;
            }
        });

        // Si on a des tables, on utilise multiplication/division
        if (tables.length > 0 && operationType === 'combined') {
            operationType = 'multiplication';
        }

        const modeConfig = {
            mode: 'asteroids',
            count: this.selectedTrainingCount,
            operation: {
                type: operationType,
                tables: tables.length > 0 ? tables : [1, 2, 3, 4, 5],
                digitCount: 1,
                allowNegatives: false
            }
        };

        callbacks.onStartGame(tables.length > 0 ? tables : [1, 2, 3, 4, 5], this.selectedDifficulty, modeConfig);
    }

    // ====================== ÉCRAN STATISTIQUES ======================

    /**
     * Affiche l'écran de statistiques
     */
    showStatisticsScreen() {
        const profile = profileManager.getActiveProfile();

        if (!profile) {
            this.showError('Crée un profil pour voir tes statistiques');
            return;
        }

        const stats = profileManager.getAggregatedStats(profile.id);
        this.renderStatsChart(stats, 'tables');
        this.renderFrequentErrors(stats.frequentErrors);
        this.showScreen('statistics');
    }

    /**
     * Affiche le graphique de statistiques
     * @param {Object} stats - Statistiques agrégées
     * @param {string} type - Type de graphique ('tables' ou 'operations')
     */
    renderStatsChart(stats, type) {
        if (!this.statsChartCanvas) return;

        const ctx = this.statsChartCanvas.getContext('2d');

        // Détruire le graphique existant
        if (this.statsChart) {
            this.statsChart.destroy();
        }

        let labels, data, colors;

        if (type === 'tables') {
            labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            data = labels.map(t => {
                const s = stats.tableStats[t];
                if (!s || s.correct + s.wrong === 0) return 0;
                return Math.round(s.correct / (s.correct + s.wrong) * 100);
            });
            colors = data.map(d => this.getSuccessColor(d));
        } else if (type === 'operations') {
            const ops = ['multiplication', 'addition', 'subtraction', 'division', 'fractions', 'percentages', 'powers'];
            labels = ['×', '+', '−', '÷', '½', '%', 'x²'];
            data = ops.map(op => {
                const s = stats.operationStats[op];
                if (!s || s.correct + s.wrong === 0) return 0;
                return Math.round(s.correct / (s.correct + s.wrong) * 100);
            });
            colors = data.map(d => this.getSuccessColor(d));
        }

        this.statsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Taux de réussite (%)',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#8892b0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    /**
     * Affiche les erreurs fréquentes
     * @param {Array} frequentErrors - Liste des erreurs fréquentes
     */
    renderFrequentErrors(frequentErrors) {
        if (!this.frequentErrorsList) return;

        if (!frequentErrors || frequentErrors.length === 0) {
            this.frequentErrorsList.innerHTML = '<p class="no-errors">Pas encore d\'erreurs enregistrées.</p>';
            return;
        }

        const topErrors = frequentErrors.slice(0, 10);
        this.frequentErrorsList.innerHTML = topErrors.map(e => `
            <div class="frequent-error-item">
                <span class="error-question">${e.question}</span>
                <span class="error-count">${e.count} erreur${e.count > 1 ? 's' : ''}</span>
            </div>
        `).join('');
    }

    // ====================== RÉINITIALISATION ======================

    /**
     * Réinitialise les données d'entraînement après confirmation
     */
    resetTrainingData() {
        const profile = profileManager.getActiveProfile();
        if (!profile) {
            this.showError('Aucun profil actif');
            return;
        }

        if (confirm('Es-tu sûr de vouloir réinitialiser les données d\'entraînement ?\nTes statistiques et historique d\'erreurs seront effacés.')) {
            profileManager.resetAllTrainingData(profile.id);

            // Rafraîchir l'affichage
            const weakAreas = profileManager.getWeakAreas(profile.id);
            this.renderWeakAreas(weakAreas);
            this.renderTrainingCheckboxes(weakAreas);
        }
    }

    /**
     * Réinitialise les statistiques après confirmation
     */
    resetStatistics() {
        const profile = profileManager.getActiveProfile();
        if (!profile) {
            this.showError('Aucun profil actif');
            return;
        }

        if (confirm('Es-tu sûr de vouloir réinitialiser toutes les statistiques ?\nCette action est irréversible !')) {
            profileManager.resetAllTrainingData(profile.id);

            // Rafraîchir l'affichage du graphique
            const stats = profileManager.getAggregatedStats(profile.id);
            this.renderStatsChart(stats, 'tables');
            this.renderFrequentErrors(stats.frequentErrors);
        }
    }
    // ====================== NUMPAD MOBILE ======================

    /**
     * Initialise le numpad custom pour mobile
     */
    initCustomNumpad() {
        const numpad = document.getElementById('custom-numpad');
        if (!numpad) return;

        // Handler générique pour les boutons numpad
        const createHandler = (btn) => {
            let lastTap = 0;
            return (e) => {
                e.preventDefault();
                e.stopPropagation();

                const now = Date.now();
                if (now - lastTap < 300) return;
                lastTap = now;

                const value = btn.dataset.value;
                const activeInput = this.getActiveNumpadInput();

                if (value === 'submit') {
                    if (activeInput !== this.answerInput) {
                        this.answerInput.value = activeInput.value;
                    }
                    this.submitBtn.click();
                    if (activeInput !== this.answerInput) {
                        activeInput.value = '';
                    }
                } else if (value === 'backspace') {
                    activeInput.value = '';
                    if (activeInput !== this.answerInput) {
                        this.answerInput.value = '';
                    }
                    // Dispatch input event to trigger auto-validate via the same path as desktop
                    this.answerInput.dispatchEvent(new Event('input'));
                } else if (value === '-') {
                    if (activeInput.value === '') {
                        activeInput.value = '-';
                    }
                } else {
                    activeInput.value += value;
                    // Sync inputs if using side panel
                    if (activeInput !== this.answerInput) {
                        this.answerInput.value = activeInput.value;
                    }
                    // Dispatch input event to trigger auto-validate via the same path as desktop
                    this.answerInput.dispatchEvent(new Event('input'));
                }
            };
        };

        // Wire main numpad buttons
        numpad.querySelectorAll('.numpad-btn').forEach(btn => {
            const handler = createHandler(btn);
            btn.addEventListener('touchstart', handler, { passive: false });
            btn.addEventListener('click', handler);
        });

        // Wire side panel buttons (submit + backspace)
        const sidePanel = document.getElementById('numpad-side-panel');
        if (sidePanel) {
            sidePanel.querySelectorAll('.numpad-btn').forEach(btn => {
                const handler = createHandler(btn);
                btn.addEventListener('touchstart', handler, { passive: false });
                btn.addEventListener('click', handler);
            });
        }

        // Drag du numpad via le handle
        this.initNumpadDrag(numpad);
    }

    initNumpadDrag(numpad) {
        const handle = document.getElementById('numpad-drag-handle');
        if (!handle) return;

        let isDragging = false;
        let startX, startY, initialLeft, initialBottom;
        let hasMoved = false;

        const getPos = (e) => {
            if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            return { x: e.clientX, y: e.clientY };
        };

        const onStart = (e) => {
            isDragging = true;
            hasMoved = false;
            const pos = getPos(e);
            startX = pos.x;
            startY = pos.y;

            const rect = numpad.getBoundingClientRect();
            const parentRect = numpad.parentElement.getBoundingClientRect();
            initialLeft = rect.left - parentRect.left;
            initialBottom = parentRect.bottom - rect.bottom;

            // Passer en position libre (pas centré)
            numpad.style.left = initialLeft + 'px';
            numpad.style.bottom = initialBottom + 'px';
            numpad.style.transform = 'none';
            numpad.classList.add('dragging');

            e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const pos = getPos(e);
            const dx = pos.x - startX;
            const dy = pos.y - startY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
            if (!hasMoved) return;

            const parentRect = numpad.parentElement.getBoundingClientRect();
            let newLeft = initialLeft + dx;
            let newBottom = initialBottom - dy;

            // Limites
            const numpadWidth = numpad.offsetWidth;
            const numpadHeight = numpad.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, parentRect.width - numpadWidth));
            newBottom = Math.max(0, Math.min(newBottom, parentRect.height - numpadHeight));

            numpad.style.left = newLeft + 'px';
            numpad.style.bottom = newBottom + 'px';
        };

        const onEnd = () => {
            isDragging = false;
            numpad.classList.remove('dragging');
        };

        handle.addEventListener('touchstart', onStart, { passive: false });
        handle.addEventListener('mousedown', onStart);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchend', onEnd);
        document.addEventListener('mouseup', onEnd);
    }

    /**
     * Returns the active input element for the numpad based on layout
     */
    getActiveNumpadInput() {
        if (this.numpadLayout === 'left' || this.numpadLayout === 'right') {
            const sideInput = document.getElementById('numpad-side-input');
            if (sideInput && !document.getElementById('numpad-side-panel').classList.contains('hidden')) {
                return sideInput;
            }
        }
        return this.answerInput;
    }

    /**
     * Set numpad layout and persist
     */
    setNumpadLayout(layout) {
        this.numpadLayout = layout;
        localStorage.setItem('mathGameNumpadLayout', layout);
        this.applyNumpadLayout();
    }

    /**
     * Apply the current numpad layout to the DOM
     */
    applyNumpadLayout() {
        const numpad = document.getElementById('custom-numpad');
        const sidePanel = document.getElementById('numpad-side-panel');
        if (!numpad) return;

        // Reset classes and inline drag position
        numpad.classList.remove('numpad-split', 'numpad-split-left', 'numpad-split-right');
        numpad.style.left = '';
        numpad.style.right = '';
        numpad.style.bottom = '';
        numpad.style.transform = '';

        const normalSubmit = numpad.querySelector('.numpad-normal-submit');

        if (this.numpadLayout === 'left' || this.numpadLayout === 'right') {
            // Split mode: keys on one side, input+OK on the other
            numpad.classList.add('numpad-split');
            if (this.numpadLayout === 'left') {
                numpad.classList.add('numpad-split-left');
            } else {
                numpad.classList.add('numpad-split-right');
            }
            if (normalSubmit) normalSubmit.style.display = 'none';

            // Show side panel only if numpad is actually visible
            if (sidePanel) {
                if (this.numpadVisible) {
                    sidePanel.classList.remove('hidden', 'side-left', 'side-right');
                    sidePanel.classList.add(this.numpadLayout === 'left' ? 'side-right' : 'side-left');
                } else {
                    sidePanel.classList.add('hidden');
                }
            }
            if (this.numpadVisible) {
                if (this.gameScreen) this.gameScreen.classList.add('numpad-side');
            } else {
                if (this.gameScreen) this.gameScreen.classList.remove('numpad-side');
            }
            this.syncSideInput();
        } else {
            // Normal mode
            if (normalSubmit) normalSubmit.style.display = '';
            if (sidePanel) sidePanel.classList.add('hidden');
            if (this.gameScreen) this.gameScreen.classList.remove('numpad-side');
        }
    }

    /**
     * Sync side input with main answer input
     */
    syncSideInput() {
        const sideInput = document.getElementById('numpad-side-input');
        if (sideInput && this.answerInput) {
            sideInput.value = this.answerInput.value;
        }
    }

    /**
     * Met à jour l'affichage des descriptions des modes
     */
    updateModeDescriptions() {
        const splitDesc = document.getElementById('split-desc');
        const armageddonDesc = document.getElementById('armageddon-desc-full');
        if (splitDesc) {
            splitDesc.classList.toggle('visible', this.splitModeCheckbox && this.splitModeCheckbox.checked);
        }
        if (armageddonDesc) {
            armageddonDesc.classList.toggle('visible', this.armageddonModeCheckbox && this.armageddonModeCheckbox.checked);
        }
    }

    /**
     * Affiche le numpad custom
     */
    showNumpad() {
        this.numpadVisible = true;
        const numpad = document.getElementById('custom-numpad');
        if (numpad) {
            numpad.classList.remove('hidden');
            this.gameScreen.classList.add('has-numpad');
        }
        this.applyNumpadLayout();
        // Afficher le bouton toggle dans le HUD
        const toggleBtn = document.getElementById('numpad-toggle-btn');
        if (toggleBtn) {
            toggleBtn.classList.remove('hidden');
            toggleBtn.classList.add('active');
        }
        // Afficher le bouton d'activation powerup mobile
        const activateBtn = document.getElementById('powerup-activate-btn');
        if (activateBtn) {
            activateBtn.classList.remove('hidden');
        }
    }

    /**
     * Cache le numpad custom (complètement, fin de partie)
     */
    hideNumpad() {
        this.numpadVisible = false;
        const numpad = document.getElementById('custom-numpad');
        if (numpad) {
            numpad.classList.add('hidden');
        }
        const sidePanel = document.getElementById('numpad-side-panel');
        if (sidePanel) {
            sidePanel.classList.add('hidden');
        }
        if (this.gameScreen) {
            this.gameScreen.classList.remove('has-numpad');
            this.gameScreen.classList.remove('numpad-side');
        }
        const activateBtn = document.getElementById('powerup-activate-btn');
        if (activateBtn) {
            activateBtn.classList.add('hidden');
        }
        const toggleBtn = document.getElementById('numpad-toggle-btn');
        if (toggleBtn) {
            toggleBtn.classList.add('hidden');
        }
    }

    /**
     * Toggle le numpad (en jeu)
     */
    toggleNumpad() {
        const numpad = document.getElementById('custom-numpad');
        if (!numpad) return;

        const isVisible = !numpad.classList.contains('hidden');
        const toggleBtn = document.getElementById('numpad-toggle-btn');
        const activateBtn = document.getElementById('powerup-activate-btn');
        const isMobile = ('ontouchstart' in window) && window.innerWidth <= 768;

        if (isVisible) {
            this.numpadVisible = false;
            numpad.classList.add('hidden');
            const sidePanel = document.getElementById('numpad-side-panel');
            if (sidePanel) sidePanel.classList.add('hidden');
            this.gameScreen.classList.remove('has-numpad');
            this.gameScreen.classList.remove('numpad-side');
            if (toggleBtn) toggleBtn.classList.remove('active');
            if (activateBtn) activateBtn.classList.add('hidden');
            // Quand on cache le numpad, enlever readOnly pour permettre le clavier natif
            if (this.answerInput) this.answerInput.readOnly = false;
            this.focusInput();
        } else {
            this.numpadVisible = true;
            numpad.classList.remove('hidden');
            this.gameScreen.classList.add('has-numpad');
            if (toggleBtn) toggleBtn.classList.add('active');
            if (activateBtn) activateBtn.classList.remove('hidden');
            // Sur mobile, bloquer le clavier natif quand numpad visible
            if (isMobile && this.answerInput) this.answerInput.readOnly = true;
            this.applyNumpadLayout();
        }
    }

    // ====================== NOUVEAUX POWER-UPS ======================

    /**
     * Affiche l'overlay multishot
     */
    showMultishotOverlay() {
        if (this.multishotOverlay) return;
        this.multishotOverlay = document.createElement('div');
        this.multishotOverlay.className = 'multishot-overlay';
        this.gameScreen.appendChild(this.multishotOverlay);
    }

    /**
     * Cache l'overlay multishot
     */
    hideMultishotOverlay() {
        if (this.multishotOverlay) {
            this.multishotOverlay.classList.add('fading');
            const overlay = this.multishotOverlay;
            this.multishotOverlay = null;
            setTimeout(() => overlay.remove(), 500);
        }
    }

    /**
     * Affiche l'overlay slowdown
     */
    showSlowdownOverlay() {
        if (this.slowdownOverlay) return;
        this.slowdownOverlay = document.createElement('div');
        this.slowdownOverlay.className = 'slowdown-overlay';
        this.gameScreen.appendChild(this.slowdownOverlay);
    }

    /**
     * Cache l'overlay slowdown
     */
    hideSlowdownOverlay() {
        if (this.slowdownOverlay) {
            this.slowdownOverlay.classList.add('fading');
            const overlay = this.slowdownOverlay;
            this.slowdownOverlay = null;
            setTimeout(() => overlay.remove(), 500);
        }
    }

    /**
     * Ajoute un coeur au HUD
     */
    addLife() {
        if (!this.livesContainer) return;
        const life = document.createElement('span');
        life.className = 'life';
        life.textContent = '❤️';
        life.style.animation = 'perfectPop 0.5s ease-out';
        this.livesContainer.appendChild(life);
    }
}

// Instance globale
const ui = new UIManager();
