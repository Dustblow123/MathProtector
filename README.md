# Sauve la Terre - Tables de Multiplication

Un jeu éducatif où tu dois sauver la Terre des astéroïdes en résolvant des multiplications !

## Comment jouer

1. Ouvre `index.html` dans ton navigateur
2. Sélectionne les tables de multiplication que tu veux pratiquer
3. Choisis un niveau de difficulté
4. Clique sur "JOUER"
5. Tape la réponse à la multiplication affichée sur l'astéroïde
6. Appuie sur Entrée pour tirer le laser et détruire l'astéroïde !

## Règles

- Chaque astéroïde affiche une multiplication (ex: 7 × 8)
- Entre la bonne réponse pour le détruire avant qu'il touche la Terre
- Tu as 3 vies - chaque astéroïde qui touche la Terre te fait perdre une vie
- Enchaîne les bonnes réponses pour augmenter ton combo et marquer plus de points !

## Niveaux de difficulté

- **Facile** : Astéroïdes lents, idéal pour débuter
- **Moyen** : Vitesse normale, bon équilibre
- **Difficile** : Astéroïdes rapides et multiples simultanément

## Système de points

- 100 points de base par astéroïde détruit
- Multiplicateur de combo (x2, x3, x4...) pour les bonnes réponses consécutives
- Bonus temps pour les réponses rapides (jusqu'à x2)
- Ton meilleur score est sauvegardé automatiquement

## Contrôles

- **Clavier** : Tape ta réponse et appuie sur Entrée
- **Souris** : Clique sur le bouton d'envoi
- **Pause** : Bouton pause en haut à droite

## Structure du projet

```
├── index.html          # Page principale
├── css/
│   └── style.css       # Styles et animations
├── js/
│   ├── game.js         # Logique principale du jeu
│   ├── asteroid.js     # Classe Astéroïde
│   ├── ui.js           # Gestion interface utilisateur
│   └── audio.js        # Gestion sons/musique
└── README.md
```

## Technologies utilisées

- HTML5 Canvas pour le rendu graphique
- CSS3 pour les animations et l'interface
- JavaScript vanilla (pas de framework)
- Web Audio API pour les sons synthétisés

## Compatibilité

Fonctionne sur tous les navigateurs modernes (Chrome, Firefox, Edge, Safari).
