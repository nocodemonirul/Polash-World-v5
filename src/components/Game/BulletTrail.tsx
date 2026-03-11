import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../game/store';
import * as THREE from 'three';

interface BulletTrailProps {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  timestamp: number;
}

export const BulletTrail: React.FC<BulletTrailProps> = ({ id, start, end, timestamp }) => {
  const removeBulletTrail = useGameStore((state) => state.removeBulletTrail);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      removeBulletTrail(id);
    }, 100);
    return () => clearTimeout(timeout);
  }, [id, removeBulletTrail]);

  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  const center = startVec.clone().add(direction.clone().multiplyScalar(0.5));

  return (
    <mesh 
      ref={meshRef} 
      position={center} 
      onUpdate={(self) => self.lookAt(endVec)}
    >
      <boxGeometry args={[0.02, 0.02, length]} />
      <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
    </mesh>
  );
};
