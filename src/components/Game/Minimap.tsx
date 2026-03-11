import React, { useRef, useLayoutEffect, useState } from 'react';
import { useFrame, useThree, createPortal } from '@react-three/fiber';
import { useFBO, OrthographicCamera, Hud } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import { Color } from '../../styles';

export const Minimap = () => {
  const { scene, size, gl } = useThree();
  // Remove reactive subscription
  // const playerPos = useGameStore(state => state.playerPos); 
  const mapCamera = useRef<THREE.OrthographicCamera>(null);
  const mapTarget = useFBO(512, 512);
  const [hudScene] = useState(() => new THREE.Scene());
  const [zoom, setZoom] = useState(2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (mapCamera.current) {
      mapCamera.current.layers.enable(0);
      mapCamera.current.layers.enable(1);
    }
  }, []);

  useFrame(() => {
    if (mapCamera.current) {
      // Get latest player pos imperatively
      const playerPos = useGameStore.getState().playerPos;
      
      // Follow player X + offset
      mapCamera.current.position.set(playerPos[0] + offset.x, 50, offset.y);
      mapCamera.current.lookAt(playerPos[0] + offset.x, 0, offset.y);
      mapCamera.current.updateMatrixWorld();

      // Render to FBO
      const oldTarget = gl.getRenderTarget();
      gl.setRenderTarget(mapTarget);
      gl.clear();
      gl.render(scene, mapCamera.current);
      gl.setRenderTarget(oldTarget);
    }
  });

  const mapSize = 200;
  const margin = 20;
  const x = size.width / 2 - mapSize / 2 - margin;
  const y = -size.height / 2 + mapSize / 2 + margin;

  const handleWheel = (e: any) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(0.5, Math.min(10, prev - e.deltaY * 0.005)));
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    if (!isDragging) return;
    
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    
    // Adjust sensitivity
    const sensitivity = 0.2 / zoom; 
    
    setOffset(prev => ({
      x: prev.x - dx * sensitivity,
      y: prev.y + dy * sensitivity 
    }));
    
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  return (
    <>
      <OrthographicCamera
        ref={mapCamera}
        makeDefault={false}
        position={[0, 50, 0]}
        zoom={zoom}
        near={0.1}
        far={1000}
        left={-50}
        right={50}
        top={50}
        bottom={-50}
      />
      <Hud>
        <orthographicCamera position={[0, 0, 10]} zoom={1} />
        <mesh 
          position={[x, y, 0]} 
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerUp}
        >
           <planeGeometry args={[mapSize, mapSize]} />
           <meshBasicMaterial map={mapTarget.texture} />
        </mesh>
        <lineSegments position={[x, y, 0]} raycast={() => null}>
           <edgesGeometry args={[new THREE.PlaneGeometry(mapSize, mapSize)]} />
           <lineBasicMaterial color="white" />
        </lineSegments>
      </Hud>
    </>
  );
};
