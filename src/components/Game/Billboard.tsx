import React from 'react';
import { Box, Text } from '@react-three/drei';
import { Materials } from '../../game/Materials';
import { Color } from '../../styles';

interface BillboardProps {
  title: string;
  description?: string;
}

export const Billboard: React.FC<BillboardProps> = ({ title, description }) => {
  const boardWidth = 4;
  const boardHeight = 2.5;
  const postHeight = 3;
  const postRadius = 0.15;

  return (
    <group>
      {/* Posts */}
      <Box args={[postRadius, postHeight, postRadius]} position={[-boardWidth / 2 + 0.5, postHeight / 2 - 1, 0]}>
        <meshStandardMaterial color="#5D4037" />
      </Box>
      <Box args={[postRadius, postHeight, postRadius]} position={[boardWidth / 2 - 0.5, postHeight / 2 - 1, 0]}>
        <meshStandardMaterial color="#5D4037" />
      </Box>

      {/* Board */}
      <Box args={[boardWidth, boardHeight, 0.2]} position={[0, postHeight - 0.5, 0]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>
      
      {/* Board Frame/Border */}
      <Box args={[boardWidth + 0.2, boardHeight + 0.2, 0.1]} position={[0, postHeight - 0.5, -0.06]}>
        <meshStandardMaterial color="#3E2723" />
      </Box>

      {/* Content */}
      <group position={[0, postHeight - 0.5, 0.11]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.4}
          color={Color.Base.Content[3]} // Dark gray
          anchorX="center"
          anchorY="middle"
          maxWidth={boardWidth - 0.4}
        >
          {title.toUpperCase()}
        </Text>
        
        {description && (
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.25}
            color={Color.Base.Content[2]} // Medium gray
            anchorX="center"
            anchorY="top"
            maxWidth={boardWidth - 0.6}
          >
            {description}
          </Text>
        )}
      </group>
    </group>
  );
};
