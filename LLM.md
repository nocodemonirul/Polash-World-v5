# LLM Instructions

## Codebase Overview

- **Entry Point**: `src/main.tsx` -> `src/App.tsx`.
- **Game Loop**: `src/components/Game/Player.tsx` (Physics & Movement).
- **World Generation**: `src/App.tsx` renders `Island`, `Tunnel`, `Opening`, `POI` based on `LevelConfig`.
- **Styling**: CSS-in-JS objects in `src/styles.tsx`. NO TAILWIND.

## Modification Rules

1. **No Tailwind**: Use `src/styles.tsx` tokens.
2. **Mobile First**: Ensure UI scales.
3. **Framer Motion**: Use for UI animations.
4. **Config**: Edit `src/game/LevelConfig.tsx` to change the map.
