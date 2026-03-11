import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import { checkCollision } from '../../game/Physics';

interface BulletProps {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  colliders: any[];
}

export const Bullet: React.FC<BulletProps> = ({ id, position, velocity, colliders }) => {
  const ref = useRef<THREE.Mesh>(null);
  const removeBullet = useGameStore((state) => state.removeBullet);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.x += velocity[0] * delta;
      ref.current.position.y += velocity[1] * delta;
      ref.current.position.z += velocity[2] * delta;

      const collision = checkCollision(
        { x: ref.current.position.x, y: ref.current.position.y },
        { w: 0.2, h: 0.2 },
        colliders
      );

      if (collision) {
        removeBullet(id);
      }
      
      // Remove bullet if it goes too far
      if (ref.current.position.length() > 200) {
        removeBullet(id);
      }
    }
  });

  return (
    <Sphere ref={ref} args={[0.1, 8, 8]} position={position}>
      <meshBasicMaterial color="yellow" />
    </Sphere>
  );
};
