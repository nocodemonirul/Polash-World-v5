import React, { useRef, useEffect } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export const Ship = ({ position, rotation = [0, 0, 0], scale = 1 }: any) => {
  const ref = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (ref.current) {
      // Bobbing
      gsap.to(ref.current.position, {
        y: position[1] + 0.5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      // Rocking Z
      gsap.to(ref.current.rotation, {
        z: rotation[2] + 0.02,
        duration: 3.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      // Rocking X
      gsap.to(ref.current.rotation, {
        x: rotation[0] + 0.01,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [position, rotation]);

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* Hull */}
      <Box args={[8, 4, 24]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#1e3a8a" /> {/* Dark Blue Hull */}
      </Box>
      <Box args={[8.2, 1, 24.2]} position={[0, 4, 0]}>
         <meshStandardMaterial color="#dc2626" /> {/* Red Stripe */}
      </Box>
      
      {/* Deck */}
      <Box args={[7, 0.5, 22]} position={[0, 4.5, 0]}>
        <meshStandardMaterial color="#9ca3af" />
      </Box>

      {/* Bridge / Superstructure */}
      <group position={[0, 6, 6]}>
        <Box args={[6, 3, 6]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f3f4f6" />
        </Box>
        {/* Windows */}
        <Box args={[6.1, 1, 5]} position={[0, 1, 0]}>
           <meshStandardMaterial color="#1f2937" />
        </Box>
        {/* Roof */}
        <Box args={[6.5, 0.5, 6.5]} position={[0, 1.75, 0]}>
           <meshStandardMaterial color="#f3f4f6" />
        </Box>
      </group>

      {/* Containers */}
      <Box args={[2, 2, 4]} position={[-1.5, 5.5, -4]}>
         <meshStandardMaterial color="#b91c1c" />
      </Box>
      <Box args={[2, 2, 4]} position={[1.5, 5.5, -4]}>
         <meshStandardMaterial color="#15803d" />
      </Box>
      <Box args={[2, 2, 4]} position={[0, 7.5, -4]}>
         <meshStandardMaterial color="#d97706" />
      </Box>

      {/* Chimney */}
      <Box args={[1.5, 4, 1.5]} position={[0, 8, 2]}>
        <meshStandardMaterial color="#374151" />
      </Box>
    </group>
  );
};
