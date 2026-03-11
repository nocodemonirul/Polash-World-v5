import { create } from 'zustand';

interface GameState {
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  activePOI: any | null;
  setActivePOI: (poi: any | null) => void;
  hint: string | null;
  setHint: (hint: string | null) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  viewMode: 'side' | 'eyes' | 'free';
  setViewMode: (mode: 'side' | 'eyes' | 'free') => void;
  health: number;
  setHealth: (health: number) => void;
  fuel: number;
  setFuel: (fuel: number) => void;
  timeOfDay: number;
  setTimeOfDay: (time: number) => void;
  isDayNightCycleActive: boolean;
  setDayNightCycleActive: (active: boolean) => void;
  bullets: { id: string; position: [number, number, number]; velocity: [number, number, number] }[];
  addBullet: (bullet: { id: string; position: [number, number, number]; velocity: [number, number, number] }) => void;
  removeBullet: (id: string) => void;
  bulletTrails: { id: string; start: [number, number, number]; end: [number, number, number]; timestamp: number }[];
  addBulletTrail: (trail: { id: string; start: [number, number, number]; end: [number, number, number] }) => void;
  removeBulletTrail: (id: string) => void;
  respawnEffect: { position: [number, number, number]; key: number } | null;
  triggerRespawnEffect: (position: [number, number, number]) => void;
  isFiringFromUI: boolean;
  setFiringFromUI: (isFiring: boolean) => void;
  isFlying: boolean;
  setFlying: (isFlying: boolean) => void;
  toggleFlying: () => void;
  ammo: number;
  setAmmo: (ammo: number) => void;
  maxAmmo: number;
  isReloading: boolean;
  setReloading: (reloading: boolean) => void;
  cameraCommand: 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right' | 'reset' | null;
  setCameraCommand: (command: 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right' | 'reset' | null) => void;
  isRotationLocked: boolean;
  setRotationLocked: (locked: boolean) => void;
  isFollowingPlayer: boolean;
  setFollowingPlayer: (following: boolean) => void;
  soundTrigger: { sound: string; position: [number, number, number]; volume?: number; pitch?: number; key: number } | null;
  triggerSound: (sound: string, position: [number, number, number], volume?: number, pitch?: number) => void;
  impactEffects: { position: [number, number, number]; key: number }[];
  triggerImpactEffect: (position: [number, number, number]) => void;
  removeImpactEffect: (key: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerPos: [0, 0, 0],
  setPlayerPos: (pos) => set({ playerPos: pos }),
  activePOI: null,
  setActivePOI: (poi) => set({ activePOI: poi }),
  hint: null,
  setHint: (hint) => set({ hint }),
  isPaused: false,
  setPaused: (paused) => set({ isPaused: paused }),
  viewMode: 'free',
  setViewMode: (mode) => set({ viewMode: mode }),
  health: 100,
  setHealth: (health) => set({ health }),
  fuel: 100,
  setFuel: (fuel) => set({ fuel }),
  timeOfDay: 12, // Start at noon
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  isDayNightCycleActive: false, // Default to false (Day version)
  setDayNightCycleActive: (active) => set({ isDayNightCycleActive: active }),
  bullets: [],
  addBullet: (bullet) => set((state) => ({ bullets: [...state.bullets, bullet] })),
  removeBullet: (id) => set((state) => ({ bullets: state.bullets.filter(b => b.id !== id) })),
  bulletTrails: [],
  addBulletTrail: (trail) => set((state) => ({ 
    bulletTrails: [...state.bulletTrails, { ...trail, timestamp: Date.now() }] 
  })),
  removeBulletTrail: (id) => set((state) => ({ 
    bulletTrails: state.bulletTrails.filter(t => t.id !== id) 
  })),
  respawnEffect: null,
  triggerRespawnEffect: (position) => set({ respawnEffect: { position, key: Date.now() } }),
  isFiringFromUI: false,
  setFiringFromUI: (isFiring) => set({ isFiringFromUI: isFiring }),
  isFlying: false,
  setFlying: (isFlying) => set({ isFlying }),
  toggleFlying: () => set((state) => ({ isFlying: !state.isFlying })),
  ammo: 30,
  setAmmo: (ammo) => set({ ammo }),
  maxAmmo: 30,
  isReloading: false,
  setReloading: (reloading) => set({ isReloading: reloading }),
  cameraCommand: 'front',
  setCameraCommand: (command) => set({ cameraCommand: command }),
  isRotationLocked: false,
  setRotationLocked: (locked) => set({ isRotationLocked: locked }),
  isFollowingPlayer: true,
  setFollowingPlayer: (following) => set({ isFollowingPlayer: following }),
  soundTrigger: null,
  triggerSound: (sound, position, volume = 1, pitch = 1) => set({ soundTrigger: { sound, position, volume, pitch, key: Date.now() } }),
  impactEffects: [],
  triggerImpactEffect: (position) => set((state) => ({ 
    impactEffects: [...state.impactEffects, { position, key: Date.now() }]
  })),
  removeImpactEffect: (key) => set((state) => ({ 
    impactEffects: state.impactEffects.filter(e => e.key !== key)
  })),
}));
