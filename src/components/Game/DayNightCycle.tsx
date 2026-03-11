import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { useGameStore } from '../../game/store';
import * as THREE from 'three';

export const DayNightCycle = () => {
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const setTimeOfDay = useGameStore((state) => state.setTimeOfDay);
  const isDayNightCycleActive = useGameStore((state) => state.isDayNightCycleActive);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const { scene } = useThree();

  useFrame((state, delta) => {
    // Only advance time if cycle is active
    if (isDayNightCycleActive) {
      // Advance time: 24 game hours = 120 real seconds (2 minutes)
      const newTime = (timeOfDay + delta * 0.2) % 24;
      setTimeOfDay(newTime);
    }

    // Calculate sun angle
    const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
    const sunX = Math.cos(angle) * 100;
    const sunY = Math.sin(angle) * 100;
    
    // Update Directional Light (Sun)
    if (directionalLightRef.current) {
      directionalLightRef.current.position.set(sunX, sunY, 50);
      
      const sunHeight = Math.sin(angle);
      const intensity = Math.max(0, sunHeight * 1.5);
      directionalLightRef.current.intensity = intensity;
      
      const color = new THREE.Color();
      if (sunHeight < 0.1 && sunHeight > -0.1) {
         // Sunrise/Sunset
         color.setHSL(0.05, 0.8, 0.5); 
      } else if (sunHeight >= 0.1) {
         // Day
         color.setHSL(0.1, 0.1, 0.95);
      } else {
         // Night
         color.setHSL(0.6, 0.5, 0.1);
      }
      directionalLightRef.current.color.lerp(color, 0.1);
    }

    // Update Ambient Light, Background & Fog
    if (ambientLightRef.current) {
        const sunHeight = Math.sin(angle);
        let targetIntensity = 0.8; // Brighter day
        let targetColor = new THREE.Color("#ffffff"); // Day
        let targetBg = new THREE.Color("#87CEEB"); // Day BG

        if (sunHeight <= 0) {
            // Night
            targetIntensity = 0.2;
            targetColor.set("#1e1b4b"); // Night Blue
            targetBg.set("#0f172a"); // Night BG
        }

        ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, targetIntensity, 0.05);
        ambientLightRef.current.color.lerp(targetColor, 0.05);
        
        if (scene.background instanceof THREE.Color) {
            scene.background.lerp(targetBg, 0.05);
        } else {
            scene.background = targetBg;
        }

        // Remove fog logic
        scene.fog = null;
    }
  });

  const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
  const sunPosition: [number, number, number] = [Math.cos(angle) * 100, Math.sin(angle) * 100, 0];

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.1} color="#1e1b4b" />
      <directionalLight
        ref={directionalLightRef}
        castShadow
        intensity={2} // Increased intensity
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <Sky 
        sunPosition={sunPosition} 
        turbidity={0.8} 
        rayleigh={0.5} 
        mieCoefficient={0.005} 
        mieDirectionalG={0.7} 
      />
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      <color attach="background" args={['#87CEEB']} />
    </>
  );
};
