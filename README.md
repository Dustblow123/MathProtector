# Sauve la Terre 🌍

Un jeu éducatif de maths où des astéroïdes menacent la Terre. Réponds correctement aux questions pour les détruire au laser avant qu'ils n'atteignent la surface !

Jouable directement dans le navigateur, sans installation — **100 % JavaScript vanilla**.

---

## Fonctionnalités

### Opérations mathématiques
- Multiplication, addition, soustraction, division
- Fractions, pourcentages, puissances (niveaux avancés)
- Tables de 1 à 10 sélectionnables individuellement

### Modes de jeu
| Mode | Description |
|---|---|
| **Infini** | Survie continue, score croissant |
| **Chrono** | Détruire un maximum d'astéroïdes en temps limité |
| **Objectif** | Atteindre un nombre précis d'astéroïdes détruits |
| **Armageddon** | Vagues en rafale à intervalles très courts |
| **Révision du jour** | Questions dues selon la répétition espacée |
| **Rejouer mes erreurs** | Retravailler les questions ratées en fin de partie |

### Niveaux de difficulté
- **Facile** — astéroïdes lents, un seul à la fois
- **Moyen** — vitesse normale, équilibre idéal
- **Difficile** — rapides et nombreux simultanément

### Répétition espacée (SR)
Système hybride sessions / jours inspiré de SM-2 :

| Étape | Intervalle |
|---|---|
| Nouvelle carte / échec | session suivante |
| 1ère réussite | +3 sessions |
| 2ème réussite | +3 jours |
| 3ème réussite | +7 jours |
| 4ème+ | ×EF (SM-2) |

Jouer plusieurs sessions dans la journée fait avancer les cartes plus vite. Le widget du menu affiche les cartes dues, en cours et maîtrisées.

### Power-ups (jusqu'à 3 en file)
| Power-up | Effet |
|---|---|
| 🛡️ Bouclier | Absorbe la prochaine vie perdue |
| ❄️ Gel | Fige tous les astéroïdes pendant quelques secondes |
| 💥 Répulseur | Repousse les astéroïdes vers le haut |
| ⚡ Multitir | Tire automatiquement sur tous les astéroïdes |
| 🐢 Ralentissement | Réduit la vitesse de tous les astéroïdes |
| ➕ Vie extra | Redonne une vie |

Activation : **Espace** (clavier) ou bouton dédié (mobile).

### Profils joueurs
- Plusieurs profils indépendants (nom + avatar emoji)
- Historique de sessions, erreurs fréquentes, progressions
- Stats par opération, table et difficulté

### Audio (Web Audio API — procédural, sans fichier)
- 4 musiques sélectionnables : Base, Calme, Épique, Rythmée
- Effets sonores : laser, explosion, combo, victoire, etc.
- Contrôles séparés musique / effets sonores

### Mobile
- Numpad tactile intégré
- Responsive canvas
- Validation automatique à la saisie complète

---

## Lancer le jeu

```
Ouvrir index.html dans un navigateur moderne
```

Aucune dépendance, aucun serveur requis.

---

## Contrôles

| Action | Clavier | Mobile |
|---|---|---|
| Répondre | Taper + **Entrée** | Numpad tactile |
| Activer power-up | **Espace** | Bouton ⚡ |
| Pause | Bouton pause | Bouton pause |

---

## Structure du projet

```
├── index.html                  # Interface complète (menu, jeu, écrans)
├── css/
│   └── style.css               # Styles, animations, responsive
└── js/
    ├── game.js                 # Logique principale, boucle de jeu
    ├── asteroid.js             # Classe Asteroid (spawn, physique, rendu)
    ├── powerup.js              # Classe PowerUp (types, effets, rendu)
    ├── audio.js                # AudioManager (musiques et SFX procéduraux)
    ├── ui.js                   # UIManager (DOM, écrans, widgets)
    ├── profile.js              # Profils, sessions, historique
    ├── spaced-repetition.js    # Algorithme SR hybride sessions/jours
    └── question-generator.js   # Génération de questions par type
```

---

## Technologies

- **HTML5 Canvas** — rendu graphique du jeu
- **CSS3** — animations, transitions, layout responsive
- **JavaScript ES2020** — logique, classes, modules
- **Web Audio API** — musique et effets synthétisés en temps réel
- **localStorage** — persistance des profils, scores et cartes SR

---

## Compatibilité

Navigateurs modernes : Chrome, Firefox, Edge, Safari (desktop et mobile).
