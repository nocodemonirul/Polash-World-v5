import React, { useRef, useEffect } from 'react';
import { Torus } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface RespawnEffectProps {
  position: [number, number, number];
}

export const RespawnEffect: React.FC<RespawnEffectProps> = ({ position }) => {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    if (ref.current && materialRef.current) {
      const tl = gsap.timeline();
      tl.to(ref.current.scale, {
        x: 10,
        y: 10,
        z: 10,
        duration: 0.5,
        ease: 'power2.out',
      });
      tl.to(materialRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, 0);
    }
  }, []);

  return (
    <Torus ref={ref} args={[1, 0.1, 16, 100]} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial ref={materialRef} color="#00ff00" transparent opacity={1} />
    </Torus>
  );
};
