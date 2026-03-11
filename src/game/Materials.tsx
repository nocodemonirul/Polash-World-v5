import * as THREE from 'three';

export const Materials = {
  Grass: new THREE.MeshToonMaterial({ color: '#4ade80', gradientMap: null }),
  Rock: new THREE.MeshToonMaterial({ color: '#78716c', gradientMap: null }),
  Dirt: new THREE.MeshToonMaterial({ color: '#57534e', gradientMap: null }),
  Water: new THREE.MeshPhysicalMaterial({ 
    color: '#0ea5e9', 
    transmission: 0.9, 
    opacity: 0.8, 
    metalness: 0.1, 
    roughness: 0.1, 
    ior: 1.33, 
    thickness: 2.0 
  }),
  TunnelFloor: new THREE.MeshStandardMaterial({ color: '#57534e', roughness: 0.9 }), // Dirt/Soil
  TunnelWall: new THREE.MeshStandardMaterial({ color: '#44403c', roughness: 1.0 }),  // Dark Rock
  TunnelRib: new THREE.MeshStandardMaterial({ color: '#78716c', roughness: 0.8 }),   // Lighter Rock
  TunnelLight: new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 1, toneMapped: false }), // Warm glow
  Ladder: new THREE.MeshStandardMaterial({ color: '#d97706' }),
  POI: new THREE.MeshBasicMaterial({ color: '#facc15' }),
  Cloud: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8 }),
};
