import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../../game/store';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const MinimapMarkers: React.FC<{ config: any }> = ({ config }) => {
  const playerPos = useGameStore((state) => state.playerPos);
  const playerMarkerRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (playerMarkerRef.current) {
      playerMarkerRef.current.layers.set(1);
    }
  }, []);

  return (
    <group>
      {/* Player Marker */}
      <Sphere
        ref={playerMarkerRef}
        args={[2, 16, 16]}
        position={[playerPos[0], playerPos[1], playerPos[2]]} 
      >
        <meshBasicMaterial color="red" />
      </Sphere>

      {/* POI Markers */}
      {config.poi.map((poi: any) => {
        const island = config.islands.find((i: any) => i.id === poi.island) || 
                       config.skyIslands?.find((i: any) => i.id === poi.island) ||
                       config.tunnel.segments.find((t: any) => t.id === poi.island);
        if (!island) return null;
        const x = island.x + poi.xLocal;
        let y = (island as any).y !== undefined ? (island as any).y + poi.yLocal : config.tunnel.y + poi.yLocal;
        
        if ((island as any).type !== undefined) {
          const height = (island as any).type === 'room' ? 8 : 5;
          const floorY = config.tunnel.y - height / 2;
          y = floorY + 1.0 + poi.yLocal;
        }
        
        return (
          <Marker key={poi.id} position={[x, y, 0]} color="yellow" />
        );
      })}
    </group>
  );
};

const Marker: React.FC<{ position: [number, number, number], color: string }> = ({ position, color }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.layers.set(1);
    }
  }, []);

  return (
    <Box ref={ref} args={[3, 3, 3]} position={position}>
      <meshBasicMaterial color={color} />
    </Box>
  );
};
