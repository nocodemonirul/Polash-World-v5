import React, { useRef, useEffect } from 'react';
import { POISpec } from '../../game/LevelConfig';
import { Materials } from '../../game/Materials';
import { Octahedron, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Billboard } from './Billboard';
import { SocialMediaIcons } from './SocialMediaIcons';
import gsap from 'gsap';

interface POIProps {
  spec: POISpec;
  config: any;
}

export const POI: React.FC<POIProps> = ({ spec, config }) => {
  const island = config.islands.find((i: any) => i.id === spec.island) || 
                 config.skyIslands?.find((i: any) => i.id === spec.island) ||
                 config.tunnel.segments.find((t: any) => t.id === spec.island);
  if (!island) return null;

  const x = island.x + spec.xLocal;
  let y = (island as any).y !== undefined ? (island as any).y + spec.yLocal : config.tunnel.y + spec.yLocal;

  // If it's a tunnel segment, adjust Y to be relative to the floor
  if ((island as any).type !== undefined) {
    const height = (island as any).type === 'room' ? 8 : 5;
    const floorY = config.tunnel.y - height / 2;
    // We want the base of the billboard (at -1 relative to origin) to touch the floor if yLocal is 0
    y = floorY + 1.0 + spec.yLocal; 
  }

  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      // Rotation
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 3,
        repeat: -1,
        ease: 'none',
      });
      // Bobbing
      gsap.to(meshRef.current.position, {
        y: y + 0.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [y]);

  if (spec.type === 'project' || spec.type === 'about') {
    return (
      <group position={[x, y - (spec.type === 'project' ? 1.5 : 0), 0]}>
        <Billboard title={spec.data.title} description={spec.data.description} />
      </group>
    );
  }

  if (spec.type === 'social') {
    return (
      <group position={[x, y, 0]}>
        <SocialMediaIcons data={spec.data} />
      </group>
    );
  }

  if (spec.type === 'contact') {
    return (
      <group position={[x, y, 0]}>
        <Sphere 
          ref={meshRef as any}
          args={[0.6, 32, 32]} 
          material={Materials.POI}
        />
        <Text 
          position={[0, 1.2, 0]} 
          fontSize={0.6} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          fontWeight="bold"
        >
          {spec.data.title}
        </Text>
      </group>
    );
  }

  return (
    <group position={[x, y, 0]}>
      <Octahedron 
        ref={meshRef}
        args={[0.5]} 
        material={Materials.POI}
      />
      <Text 
        position={[0, 1, 0]} 
        fontSize={0.5} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
      >
        {spec.data.title}
      </Text>
    </group>
  );
};
