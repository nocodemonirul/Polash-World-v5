import React from 'react';
import { useGameStore } from '../../game/store';
import { Bullet } from './Bullet';
import { BulletTrail } from './BulletTrail';
import { getColliders } from '../../game/Physics';

export const Bullets: React.FC<{ config: any }> = ({ config }) => {
  const bullets = useGameStore((state) => state.bullets);
  const bulletTrails = useGameStore((state) => state.bulletTrails);
  const colliders = getColliders(config);

  return (
    <group>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} {...bullet} colliders={colliders} />
      ))}
      {bulletTrails.map((trail) => (
        <BulletTrail key={trail.id} {...trail} />
      ))}
    </group>
  );
};
