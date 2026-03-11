import React, { useRef, useEffect } from 'react';
import { Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export const Lighthouse = ({ position }: { position: [number, number, number] }) => {
  const lightRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (lightRef.current) {
      gsap.to(lightRef.current.rotation, {
        y: -Math.PI * 2,
        duration: 5,
        repeat: -1,
        ease: 'none',
      });
    }
  }, []);

  return (
    <group position={position}>
      {/* Base Rock */}
      <Cylinder args={[6, 8, 4, 8]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </Cylinder>
      
      {/* Tower Segments (Stripes) */}
      <Cylinder args={[3.5, 4, 5, 16]} position={[0, 6.5, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Cylinder>
      <Cylinder args={[3, 3.5, 5, 16]} position={[0, 11.5, 0]}>
        <meshStandardMaterial color="#f3f4f6" />
      </Cylinder>
      <Cylinder args={[2.5, 3, 5, 16]} position={[0, 16.5, 0]}>
        <meshStandardMaterial color="#ef4444" />
      </Cylinder>
      <Cylinder args={[2, 2.5, 5, 16]} position={[0, 21.5, 0]}>
        <meshStandardMaterial color="#f3f4f6" />
      </Cylinder>

      {/* Lantern Room */}
      <Cylinder args={[2.2, 2.2, 0.5, 16]} position={[0, 24.25, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder args={[1.8, 1.8, 2.5, 8]} position={[0, 25.75, 0]}>
        <meshStandardMaterial color="#e5e7eb" opacity={0.3} transparent />
      </Cylinder>
      <Cylinder args={[2.2, 0.5, 1, 16]} position={[0, 27.5, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>

      {/* Rotating Light */}
      <group ref={lightRef} position={[0, 25.5, 0]}>
        <Box args={[1, 1, 1]} position={[0, 0, 0]}>
           <meshBasicMaterial color="#ffff00" />
        </Box>
        <spotLight 
          position={[0, 0, 0]} 
          target-position={[20, -10, 0]}
          intensity={500} 
          distance={200} 
          angle={0.6} 
          penumbra={0.4} 
          color="#ffffaa"
          castShadow
        />
        {/* Light Beam Volumetric Fake */}
        <mesh position={[0, 0, 15]} rotation={[Math.PI/2, 0, 0]}>
           <cylinderGeometry args={[0.5, 8, 30, 16, 1, true]} />
           <meshBasicMaterial color="#ffffaa" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};
