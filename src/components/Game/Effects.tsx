import React from 'react';
import { useGameStore } from '../../game/store';
import { RespawnEffect } from './RespawnEffect';
import { ImpactEffect } from './ImpactEffect';

export const Effects = () => {
  const respawnEffect = useGameStore((state) => state.respawnEffect);
  const impactEffects = useGameStore((state) => state.impactEffects);
  const removeImpactEffect = useGameStore((state) => state.removeImpactEffect);

  return (
    <group>
      {respawnEffect && (
        <RespawnEffect key={respawnEffect.key} position={respawnEffect.position} />
      )}
      {impactEffects.map((effect) => (
        <ImpactEffect 
          key={effect.key} 
          position={effect.position} 
          onComplete={() => removeImpactEffect(effect.key)} 
        />
      ))}
    </group>
  );
};
