import React, { useRef, useEffect } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export const Boat = ({ position, rotation = [0, 0, 0] }: any) => {
  const ref = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (ref.current) {
      // Bobbing
      gsap.to(ref.current.position, {
        y: position[1] + 0.2,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random(),
      });
      // Rocking Z
      gsap.to(ref.current.rotation, {
        z: rotation[2] + 0.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      // Rocking X
      gsap.to(ref.current.rotation, {
        x: rotation[0] + 0.05,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [position, rotation]);

  return (
    <group ref={ref} position={position} rotation={rotation}>
       {/* Hull */}
       <Box args={[2, 1, 4]} position={[0, 0.5, 0]}>
         <meshStandardMaterial color="#78350f" />
       </Box>
       {/* Inside */}
       <Box args={[1.6, 0.8, 3.6]} position={[0, 0.6, 0]}>
         <meshStandardMaterial color="#3f1d08" />
       </Box>
       
       {/* Mast */}
       <Box args={[0.1, 5, 0.1]} position={[0, 2.5, 0.5]}>
         <meshStandardMaterial color="#d1d5db" />
       </Box>
       
       {/* Sail */}
       <mesh position={[0, 3, 1]} rotation={[0, Math.PI / 2, 0]}>
         <planeGeometry args={[2.5, 3.5]} />
         <meshStandardMaterial color="#f9fafb" side={2} />
       </mesh>
    </group>
  );
};
