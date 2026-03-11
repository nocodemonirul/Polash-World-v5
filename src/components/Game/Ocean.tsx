import React, { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Ocean = () => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current && materialRef.current.userData.shader) {
      materialRef.current.userData.shader.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const onBeforeCompile = useCallback((shader: any) => {
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader = `
      uniform float uTime;
      ${shader.vertexShader}
    `;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        #include <begin_vertex>
        float wave = sin(position.x * 0.05 + uTime) * 2.0 + cos(position.y * 0.05 + uTime * 0.8) * 2.0;
        transformed.z += wave;
      `
    );
    if (materialRef.current) {
        materialRef.current.userData.shader = shader;
    }
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -40, 0]} receiveShadow>
      <planeGeometry args={[2000, 2000, 100, 100]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#006994" 
        roughness={0.1} 
        metalness={0.1} 
        transparent
        opacity={0.8}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
};
