# MathProtector Project Memory

## Recent Changes (2026-02-06)

### Auto-validation Feature
- Added auto-validation option (enabled by default) that automatically submits when input matches any target
- UIManager tracks `autoValidate` state (persisted to localStorage)
- `tryAutoValidate()` method checks current input against game targets using `game.isValidTarget()`
- Submit button hidden when auto-validation is enabled via `updateSubmitBtnVisibility()`
- Works with both desktop keyboard input and mobile numpad
- Game.isValidTarget() checks asteroids and active powerup for matching answers

### Numpad Layout Default
- Changed default numpad layout from 'normal' to 'right' (right-handed mode)
- Updated both localStorage default and HTML active button

### Asteroid Label Overlap Prevention
- Asteroid questions now drawn separately from asteroid bodies to enable positioning
- `drawAsteroidQuestions()` in Game sorts asteroids by Y position (priority to lowest/closest to Earth)
- Overlap detection pushes labels upward to avoid collisions
- Asteroid.draw() now accepts `skipQuestion` parameter
- New `drawQuestionAt(ctx, bubbleX, bubbleY)` method for positioned rendering

## Architecture
- **Game**: `js/game.js` - Main game class, game loop, powerup management
- **UI**: `js/ui.js` - UIManager class, DOM effects, HUD, screens
- **Asteroid**: `js/asteroid.js` - Asteroid class with math questions
- **PowerUp**: `js/powerup.js` - PowerUp class (extends to 6 types)
- **CSS**: `css/style.css` - Large file (~3820 lines), append new sections at end
- **HTML**: `index.html` - Single page with multiple screens

## Key Patterns
- Global instances: `ui` (UIManager), `audioManager`, `profileManager`, `window.game`
- Canvas-based game with DOM overlays for effects
- Mobile detection: `('ontouchstart' in window) || (navigator.maxTouchPoints > 0)`
- Speed normalization: use time-based travel (distance / (time * 60fps)) instead of fixed speeds
- Earth margin proportional: `120 * (canvasHeight / 1080)`

## Auto-validation Implementation Pattern
- Property in constructor with localStorage fallback
- Checkbox event listener in init() to toggle and persist
- Input event listener calls tryAutoValidate() on every keystroke
- Numpad handler syncs inputs then calls tryAutoValidate()
- Submit buttons hidden/shown via updateSubmitBtnVisibility()
- Game provides isValidTarget() to validate without side effects

## Power-up System
- 6 types: shield, freeze, repulsor, extralife, multishot, slowdown
- extralife: activates immediately on collect (no storage)
- multishot: only available when splitMode is active
- Stored powerup activated via Space key (desktop) or floating button (mobile)
- New powerups need: colors in powerup.js, icon in drawIcon(), SVG in ui.js getPowerUpIconSVG(), CSS class for .powerup-icon/.powerup-collected

## Mobile Numpad
- Custom numpad replaces native keyboard (input set to readOnly)
- Numpad shown/hidden with game start/end
- `has-numpad` class on `#game-screen` repositions answer container
- Three layouts: normal (centered), left (keys left, input right), right (keys right, input left)
