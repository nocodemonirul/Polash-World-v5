import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Float } from '@react-three/drei';
import { useGameStore } from '../../game/store';
import * as THREE from 'three';

interface ProjectBlockProps {
  islandPos: [number, number, number];
  islandWidth: number;
  islandDepth: number;
  poiData: any;
}

export const ProjectBlock: React.FC<ProjectBlockProps> = ({ islandPos, islandWidth, islandDepth, poiData }) => {
  const playerPos = useGameStore((state) => state.playerPos);
  const setActivePOI = useGameStore((state) => state.setActivePOI);
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Check if player is on this terrain
    // Simple bounding box check
    const dx = Math.abs(playerPos[0] - islandPos[0]);
    const dz = Math.abs(playerPos[2] - islandPos[2]);
    const dy = Math.abs(playerPos[1] - islandPos[1]);

    // If player is within the island's horizontal bounds and close vertically
    const onTerrain = dx < islandWidth / 2 + 1 && dz < islandDepth / 2 + 1 && dy < 5;
    
    if (onTerrain !== isVisible) {
      setIsVisible(onTerrain);
    }
  });

  if (!isVisible) return null;

  return (
    <group position={[0, 2.5, 0]} ref={blockRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Box 
          args={[1.5, 0.8, 0.5]} 
          onClick={() => setActivePOI({ data: poiData })}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} />
        </Box>
        <Text
          position={[0, 0, 0.26]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          OPEN PROJECT
        </Text>
      </Float>
    </group>
  );
};
