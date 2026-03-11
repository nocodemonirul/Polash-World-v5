import React from 'react';
import { OpeningSpec, LevelConfig } from '../../game/LevelConfig';
import { useGameStore } from '../../game/store';

interface OpeningProps {
  spec: OpeningSpec;
  config: LevelConfig;
}

export const Opening: React.FC<OpeningProps> = ({ spec, config }) => {
  const viewMode = useGameStore((state) => state.viewMode);
  const surfaceIsland = config.islands.find(i => i.id === spec.surfaceIsland);
  const tunnelSeg = config.tunnel.segments.find(t => t.id === spec.tunnelSeg);

  if (!surfaceIsland || !tunnelSeg) return null;

  const startX = surfaceIsland.x + spec.surfaceXLocal;
  const startY = surfaceIsland.y + surfaceIsland.height / 2; // Top of island
  const endX = tunnelSeg.x + spec.tunnelXLocal;
  const endY = config.tunnel.y + 3; // Tunnel ceiling

  const height = Math.max(0.1, startY - endY);
  const midY = (startY + endY) / 2;

  // Hide visuals in side view as requested
  if (viewMode === 'side') {
    return (
      <group position={[startX, midY, 0]}>
        {/* Still keep the light for depth, but no physical indicator */}
        <pointLight position={[0, height/2 - 1, 0]} intensity={2} distance={8} color="#bae6fd" />
      </group>
    );
  }

  return (
    <group position={[startX, midY, 0]}>
      {/* Light inside the shaft */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={15} color="#bae6fd" />
    </group>
  );
};
