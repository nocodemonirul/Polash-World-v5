# Polash World

A 3D side-scrolling platformer with floating islands, tunnels, and interactive POIs.

## Directory Structure

- `src/components/Core`: Basic UI elements.
- `src/components/Game`: Game-specific components (World, Player, Island, etc.).
- `src/game`: Game logic, config, and systems (Physics, Input, Store).
- `src/materials`: Custom shaders/materials.
- `src/assets`: Static assets.

## Key Features

- **Config-Driven Levels**: Levels are defined in `src/game/LevelConfig.tsx`.
- **Custom Physics**: Simple AABB collision detection in `src/game/Physics.tsx`.
- **Reactive State**: Zustand store for game state.
- **Framer Motion**: UI animations.
- **Three.js**: 3D rendering via React Three Fiber.

## Controls

- **WASD / Arrow Keys**: Move and Jump.
- **E / Enter**: Interact with POIs.
