import React, { useMemo } from 'react';
import { IslandSpec, OpeningSpec } from '../../game/LevelConfig';
import { Materials } from '../../game/Materials';
import { Box } from '@react-three/drei';
import { ProjectBlock } from './ProjectBlock';
import { GrassPatch, RockGroup, FallenTrunk } from './Decorations';
import * as THREE from 'three';

interface IslandProps {
  spec: IslandSpec;
  poiData?: any;
  openings?: OpeningSpec[];
}

export const Island: React.FC<IslandProps> = ({ spec, poiData, openings = [] }) => {
  const { id, x, y, width, height, depth, budgets } = spec;

  // Visuals: Grass top, Rock bottom
  const grassHeight = 0.5;
  const rockHeight = height - grassHeight;
  const holeRadius = 1.5; // Total diameter 3.0, smaller as requested

  // Find openings that intersect this island
  const relevantOpenings = openings.filter(o => o.surfaceIsland === id);

  // Generate random decorations based on budgets
  const decorations = useMemo(() => {
    const decs = [];
    const topY = height / 2;

    // Grass Patches
    const grassCount = Math.floor(budgets.grass / 20); // Scale down for performance
    for (let i = 0; i < grassCount; i++) {
      const xPos = (Math.random() - 0.5) * (width - 1);
      const zPos = (Math.random() - 0.5) * (depth - 1);
      
      // Don't place grass inside a hole
      const inHole = relevantOpenings.some(o => Math.sqrt(Math.pow(o.surfaceXLocal - xPos, 2) + Math.pow(zPos, 2)) < holeRadius + 0.5);
      if (inHole) continue;

      decs.push(
        <GrassPatch 
          key={`grass-${i}`} 
          position={[xPos, topY, zPos]} 
          count={3 + Math.floor(Math.random() * 5)}
          area={0.8}
        />
      );
    }

    // Rock Groups
    const rockCount = Math.floor(budgets.rocks / 5);
    for (let i = 0; i < rockCount; i++) {
      const xPos = (Math.random() - 0.5) * (width - 1);
      const zPos = (Math.random() - 0.5) * (depth - 1);

      const inHole = relevantOpenings.some(o => Math.sqrt(Math.pow(o.surfaceXLocal - xPos, 2) + Math.pow(zPos, 2)) < holeRadius + 0.5);
      if (inHole) continue;

      decs.push(
        <RockGroup 
          key={`rock-${i}`} 
          position={[xPos, topY, zPos]} 
          scale={0.3 + Math.random() * 0.4}
        />
      );
    }

    // Fallen Trunks (if island has trees budget)
    if (budgets.trees > 2) {
      decs.push(
        <FallenTrunk 
          key="trunk-1"
          position={[
            (Math.random() - 0.5) * (width - 2), 
            topY + 0.1, 
            (Math.random() - 0.5) * (depth - 2)
          ]}
          rotation={[0, Math.random() * Math.PI, 0]}
          scale={0.5 + Math.random() * 0.5}
        />
      );
    }

    return decs;
  }, [width, height, depth, budgets, relevantOpenings, holeRadius]);

  const renderBody = () => {
    return (
      <>
        {/* Grass Top */}
        <Box 
          args={[width, grassHeight, depth]} 
          position={[0, height / 2 - grassHeight / 2, 0]} 
          material={Materials.Grass}
          castShadow
          receiveShadow
        />
        {/* Rock Body */}
        <Box 
          args={[width, rockHeight, depth]} 
          position={[0, -grassHeight / 2, 0]} 
          material={Materials.Rock}
          castShadow
          receiveShadow
        />
      </>
    );
  };

  return (
    <group position={[x, y, 0]}>
      {renderBody()}
      
      {/* Underside Detail (optional) */}
      <Box 
        args={[width * 0.8, 0.5, depth * 0.8]} 
        position={[0, -height / 2 - 0.25, 0]} 
        material={Materials.Dirt}
      />

      {/* Decorations */}
      {decorations}

      {/* Project Block - Only if this island has project POI data */}
      {poiData && (
        <ProjectBlock 
          islandPos={[x, y, 0]} 
          islandWidth={width} 
          islandDepth={depth} 
          poiData={poiData} 
        />
      )}
    </group>
  );
};
