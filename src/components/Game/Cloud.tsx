import React, { useRef, useEffect } from 'react';
import { Cloud as DreiCloud } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface CloudProps {
  position: [number, number, number];
  speed?: number;
  opacity?: number;
  segments?: number;
  bounds?: [number, number, number];
  volume?: number;
  color?: string;
}

export const Cloud: React.FC<CloudProps> = ({ 
  position, 
  speed = 1, 
  opacity = 0.5,
  segments = 20,
  bounds = [10, 2, 10],
  volume = 6,
  color = "white"
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      const duration = 250 / (speed || 1);
      gsap.fromTo(groupRef.current.position, 
        { x: -50 },
        {
          x: 200,
          duration: duration,
          repeat: -1,
          ease: 'none',
          delay: Math.random() * duration,
        }
      );
    }
  }, [speed]);

  return (
    <group ref={groupRef} position={position}>
      <DreiCloud 
        opacity={opacity} 
        speed={0.4} // Internal animation speed
        segments={segments} 
        volume={volume}
        color={color}
      />
    </group>
  );
};
