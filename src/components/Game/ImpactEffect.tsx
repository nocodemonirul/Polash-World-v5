import React, { useRef, useEffect, useMemo } from 'react';
import { Points } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface ImpactEffectProps {
  position: [number, number, number];
  onComplete: () => void;
}

const PARTICLE_COUNT = 20;
const DURATION = 0.5; // seconds

export const ImpactEffect: React.FC<ImpactEffectProps> = ({ position, onComplete }) => {
  const particlesRef = useRef<THREE.Points>(null);

  const initialVelocities = useMemo(() => 
    Array.from({ length: PARTICLE_COUNT }, () => 
      new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      )
    ), []);

  useEffect(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const material = particlesRef.current.material as THREE.PointsMaterial;

      const obj = { life: 0 };
      gsap.to(obj, {
        life: 1,
        duration: DURATION,
        ease: 'none',
        onUpdate: () => {
          const progress = obj.life;
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const vel = initialVelocities[i];
            positions[i * 3] = vel.x * progress * DURATION;
            positions[i * 3 + 1] = vel.y * progress * DURATION;
            positions[i * 3 + 2] = vel.z * progress * DURATION;
          }
          particlesRef.current!.geometry.attributes.position.needsUpdate = true;
          material.opacity = 1 - progress;
        },
        onComplete: onComplete
      });
    }
  }, [onComplete, initialVelocities]);

  return (
    <Points ref={particlesRef} positions={new Float32Array(PARTICLE_COUNT * 3)} position={position}>
      <pointsMaterial color="#ffeb3b" size={0.1} transparent opacity={1} />
    </Points>
  );
};
