import React, { useRef, useEffect, useMemo } from 'react';
import { TunnelSegSpec, OpeningSpec } from '../../game/LevelConfig';
import { Materials } from '../../game/Materials';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface TunnelProps {
  spec: TunnelSegSpec;
  y: number;
  isStart?: boolean;
  isEnd?: boolean;
  openings?: OpeningSpec[];
}

const OrganicLight: React.FC<{ type: string, lightColor: string, height: number }> = ({ type, lightColor, height }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (lightRef.current && materialRef.current) {
      const flicker = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      lightRef.current.intensity = flicker;
      materialRef.current.emissiveIntensity = flicker;
    }
  });

  return (
    <group>
      {/* Glowing Crystal/Mushroom */}
      <mesh position={[0, height/2 - 0.5, 0]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial ref={materialRef} color={lightColor} emissive={lightColor} emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <pointLight 
        ref={lightRef}
        position={[0, height/2 - 1, 0]} 
        intensity={1} 
        distance={10} 
        color={lightColor} 
      />
    </group>
  );
};

export const Tunnel: React.FC<TunnelProps> = ({ spec, y, isStart, isEnd, openings = [] }) => {
  const { width, type, x: segX } = spec;
  const height = 6; // Constant height for all segments
  const depth = 5;
  
  // Find openings that intersect this segment
  const relevantOpenings = openings.filter(o => o.tunnelSeg === spec.id);

  // Random rock positions
  const rocks = Array.from({ length: Math.floor(width / 2) }, (_, i) => ({
    x: -width/2 + Math.random() * width,
    y: -height/2 + Math.random() * height,
    z: -depth/2 + Math.random() * depth,
    scale: 0.5 + Math.random() * 1.5,
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    id: i
  }));

  const lightColor = type === 'room' ? '#fde68a' : type === 'junction' ? '#e9d5ff' : '#bae6fd';
  const holeRadius = 1.5; // Total diameter 3.0

  // Helper to render segmented ceiling
  const renderCeiling = () => {
    if (relevantOpenings.length === 0) {
      return (
        <>
          <Box args={[width, 1.5, depth]} position={[0, -0.25, 0]} material={Materials.Rock} receiveShadow castShadow />
          <Box args={[width, 0.5, depth]} position={[0, 0.75, 0]} material={Materials.Grass} receiveShadow castShadow />
        </>
      );
    }

    // Create a shape with circular holes for the tunnel ceiling
    const shape = new THREE.Shape();
    // Rectangle for the ceiling segment
    shape.moveTo(-width / 2, -depth / 2);
    shape.lineTo(width / 2, -depth / 2);
    shape.lineTo(width / 2, depth / 2);
    shape.lineTo(-width / 2, depth / 2);
    shape.lineTo(-width / 2, -depth / 2);

    // Add all circular holes to the same shape
    relevantOpenings.forEach((o) => {
      const holePath = new THREE.Path();
      holePath.absarc(o.tunnelXLocal, 0, holeRadius, 0, Math.PI * 2, true);
      shape.holes.push(holePath);
    });

    return (
      <group>
        {/* Rock Body (Ceiling) */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[shape, { depth: 1.5, bevelEnabled: false }]} />
          <primitive object={Materials.Rock} attach="material" />
        </mesh>
        {/* Grass Top (Surface above tunnel) */}
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[shape, { depth: 0.5, bevelEnabled: false }]} />
          <primitive object={Materials.Grass} attach="material" />
        </mesh>
      </group>
    );
  };

  return (
    <group position={[spec.x, y, 0]}>
      {/* Main Shell (Terrain Structure) */}
      <group>
        {/* Floor (Dirt/Soil) */}
        <Box 
          args={[width, 1, depth]} 
          position={[0, -height/2 - 0.5, 0]} 
          material={Materials.Dirt}
          receiveShadow
        />
        {/* Ceiling (Terrain: Grass top, Rock body) */}
        <group position={[0, height/2 + 1, 0]}>
          {renderCeiling()}
        </group>
        {/* Back Wall (Rock) */}
        <Box 
          args={[width, height + 4, 1]} 
          position={[0, 0, -depth/2 - 0.5]} 
          material={Materials.Rock}
          receiveShadow
        />
        {/* Side Walls (Closing the tunnel) */}
        {isStart && (
          <Box 
            args={[1, height + 4, depth + 2]} 
            position={[-width/2 - 0.5, 0, 0]} 
            material={Materials.Rock}
            receiveShadow
          />
        )}
        {isEnd && (
          <Box 
            args={[1, height + 4, depth + 2]} 
            position={[width/2 + 0.5, 0, 0]} 
            material={Materials.Rock}
            receiveShadow
          />
        )}
      </group>

      {/* Organic Rocks */}
      {rocks.map((rock) => (
        <mesh 
          key={rock.id} 
          position={[rock.x, rock.y, rock.z]} 
          rotation={rock.rotation as any}
          scale={rock.scale}
        >
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color={Math.random() > 0.5 ? '#44403c' : '#57534e'} roughness={1} />
        </mesh>
      ))}

      {/* Ambient Organic Lights */}
      {Array.from({ length: Math.ceil(width / 8) }).map((_, i) => (
        <group key={i} position={[-width/2 + (i + 0.5) * 8, 0, 0]}>
          <OrganicLight type={type} lightColor={lightColor} height={height} />
        </group>
      ))}
      
      {/* Room specific details (Natural Cave Formations) */}
      {type === 'room' && (
        <group>
           {/* Stalactites */}
           {Array.from({ length: 5 }).map((_, i) => (
             <mesh key={i} position={[-width/4 + Math.random() * width/2, height/2 - 0.5, -depth/4 + Math.random() * depth/2]} rotation={[Math.PI, 0, 0]}>
               <coneGeometry args={[0.3, 2, 4]} />
               <meshStandardMaterial color="#44403c" />
             </mesh>
           ))}
        </group>
      )}
    </group>
  );
};
