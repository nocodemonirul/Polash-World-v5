import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Box, Capsule } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export const Gun = forwardRef((props, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const muzzleFlashRef = useRef<THREE.Group>(null);
  const slideColor = "#4b5563"; // Slate 600
  const gripColor = "#1f2937"; // Slate 800
  const detailColor = "#9ca3af"; // Slate 400

  useImperativeHandle(ref, () => ({
    group: groupRef.current,
    triggerRecoil: () => {
      if (groupRef.current) {
        // Reset position/rotation just in case
        gsap.killTweensOf(groupRef.current.position);
        gsap.killTweensOf(groupRef.current.rotation);
        
        gsap.to(groupRef.current.position, {
          z: -0.15,
          duration: 0.05,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        });
        gsap.to(groupRef.current.rotation, {
          x: -0.3,
          duration: 0.05,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        });

        // Muzzle Flash
        if (muzzleFlashRef.current) {
          muzzleFlashRef.current.visible = true;
          muzzleFlashRef.current.scale.set(1, 1, 1);
          gsap.to(muzzleFlashRef.current.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.1,
            onComplete: () => {
              if (muzzleFlashRef.current) muzzleFlashRef.current.visible = false;
            }
          });
        }
      }
    },
    triggerReload: () => {
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          x: -Math.PI * 0.5,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
        gsap.to(groupRef.current.position, {
          y: -0.5,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }
    }
  }));

  return (
    <group ref={groupRef}>
      {/* Slide / Upper Receiver - Chunkier */}
      <Box args={[0.14, 0.22, 0.45]} position={[0, 0.12, 0.05]}>
        <meshStandardMaterial color={slideColor} />
      </Box>

      {/* Muzzle Tip - More pronounced */}
      <Box args={[0.08, 0.08, 0.1]} position={[0, 0.12, 0.25]}>
        <meshStandardMaterial color={detailColor} />
      </Box>

      {/* Grip - Rounded like the images */}
      <group position={[0, -0.05, -0.1]} rotation={[0.4, 0, 0]}>
        <Capsule args={[0.06, 0.25, 4, 8]}>
          <meshStandardMaterial color={gripColor} />
        </Capsule>
      </group>

      {/* Trigger Guard Area */}
      <Box args={[0.04, 0.1, 0.15]} position={[0, 0, 0.05]}>
        <meshStandardMaterial color={gripColor} />
      </Box>

      {/* Slide Details */}
      <Box args={[0.15, 0.04, 0.02]} position={[0, 0.15, -0.05]}>
        <meshStandardMaterial color={detailColor} />
      </Box>
      <Box args={[0.15, 0.04, 0.02]} position={[0, 0.15, -0.1]}>
        <meshStandardMaterial color={detailColor} />
      </Box>

      {/* Sights */}
      <Box args={[0.04, 0.04, 0.04]} position={[0, 0.23, 0.2]}>
        <meshStandardMaterial color={gripColor} />
      </Box>
      <Box args={[0.04, 0.04, 0.04]} position={[0, 0.23, -0.1]}>
        <meshStandardMaterial color={gripColor} />
      </Box>

      {/* Muzzle Flash */}
      <group ref={muzzleFlashRef} position={[0, 0.12, 0.35]} visible={false}>
        <Box args={[0.2, 0.2, 0.2]}>
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
        </Box>
        <pointLight color="#fbbf24" intensity={2} distance={2} />
      </group>
    </group>
  );
});


