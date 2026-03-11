import React from 'react';
import * as THREE from 'three';
import { Cylinder, Plane } from '@react-three/drei';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

export const Tree: React.FC<TreeProps> = ({ position, scale = 1 }) => {
  const trunkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x6b4226, 
    roughness: 0.9 
  });
  
  const leafMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2ecc71,
    roughness: 0.8,
    side: THREE.DoubleSide 
  });

  const clumpData = [
    [0, 3.5, 0, 1.2],       
    [1.0, 3.0, 0.2, 1.0],   
    [-0.8, 2.8, 0.5, 0.9],  
    [0.4, 2.7, 0.8, 0.8],   
    [-0.3, 3.2, -0.8, 1.0], 
    [0.8, 3.8, -0.4, 0.8],  
    [-0.5, 3.6, 0.3, 0.9]   
  ];

  const leafTilts = React.useMemo(() => {
    return clumpData.map(() => [
      [ (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4 ],
      [ (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4 ],
      [ (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4 ]
    ]);
  }, []);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <Cylinder 
        args={[0.3, 0.5, 3, 8]} 
        position={[0, 1.5, 0]} 
        material={trunkMaterial}
        castShadow
        receiveShadow
      />

      {/* Leaves */}
      {clumpData.map((data, index) => (
        <group key={index} position={[data[0], data[1], data[2]]} scale={[data[3], data[3], data[3]]}>
          {[0, 1, 2].map((i) => (
            <Plane 
              key={i}
              args={[2.5, 2.5]}
              rotation={[
                leafTilts[index][i][0],
                (Math.PI / 3) * i,
                leafTilts[index][i][1]
              ]}
              material={leafMaterial}
              castShadow
              receiveShadow
            />
          ))}
        </group>
      ))}
    </group>
  );
};
