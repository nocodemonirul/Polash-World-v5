import React, { useMemo } from 'react';
import { Plane, Cylinder, Dodecahedron, Box } from '@react-three/drei';
import * as THREE from 'three';

export const GrassBlade: React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Plane args={[0.2, 0.4]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#4ade80" side={THREE.DoubleSide} alphaTest={0.5} />
      </Plane>
      <Plane args={[0.2, 0.4]} position={[0, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} alphaTest={0.5} />
      </Plane>
    </group>
  );
};

export const FallenTrunk: React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Cylinder args={[0.3, 0.3, 2, 8]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#78350f" />
      </Cylinder>
      {/* Some bark texture details */}
      <Box args={[0.1, 0.4, 0.1]} position={[0.5, 0.2, 0.2]} rotation={[0.2, 0.4, 0.1]}>
        <meshStandardMaterial color="#451a03" />
      </Box>
    </group>
  );
};

export const RockGroup: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  const rocks = useMemo(() => {
    return [
      { pos: [0, 0, 0] as [number, number, number], rot: [Math.random(), Math.random(), Math.random()] as [number, number, number], s: 0.8 + Math.random() * 0.4 },
      { pos: [0.6, -0.1, 0.3] as [number, number, number], rot: [Math.random(), Math.random(), Math.random()] as [number, number, number], s: 0.5 + Math.random() * 0.3 },
      { pos: [-0.4, -0.2, -0.5] as [number, number, number], rot: [Math.random(), Math.random(), Math.random()] as [number, number, number], s: 0.4 + Math.random() * 0.4 },
    ];
  }, []);

  return (
    <group position={position} scale={scale}>
      {rocks.map((rock, i) => (
        <Dodecahedron key={i} args={[rock.s, 0]} position={rock.pos} rotation={rock.rot}>
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </Dodecahedron>
      ))}
    </group>
  );
};

export const GrassPatch: React.FC<{ position: [number, number, number]; count?: number; area?: number }> = ({ position, count = 5, area = 1 }) => {
  const blades = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      pos: [(Math.random() - 0.5) * area, 0, (Math.random() - 0.5) * area] as [number, number, number],
      rot: [0, Math.random() * Math.PI, 0] as [number, number, number],
      s: 0.8 + Math.random() * 0.4
    }));
  }, [count, area]);

  return (
    <group position={position}>
      {blades.map((blade, i) => (
        <GrassBlade key={i} position={blade.pos} rotation={blade.rot} scale={blade.s} />
      ))}
    </group>
  );
};
