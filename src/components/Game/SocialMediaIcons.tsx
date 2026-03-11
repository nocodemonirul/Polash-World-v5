import React from 'react';
import { Box, Text } from '@react-three/drei';
import { Materials } from '../../game/Materials';

interface SocialMediaIconsProps {
  data: {
    title: string;
    socialLinks?: { name: string; url: string }[];
  };
}

export const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ data }) => {
  const { socialLinks } = data;
  if (!socialLinks) return null;

  return (
    <group>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {data.title.toUpperCase()}
      </Text>
      
      {socialLinks.map((link, index) => {
        const x = (index - (socialLinks.length - 1) / 2) * 1.2;
        return (
          <group key={link.name} position={[x, 0, 0]}>
            <Box args={[0.8, 0.8, 0.8]} material={Materials.POI}>
              {/* Simple representation of icon */}
            </Box>
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="top"
            >
              {link.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
