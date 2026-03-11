import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

export const SoundManager = () => {
  const { camera } = useThree();
  const listener = useRef(new THREE.AudioListener());

  const soundTrigger = useGameStore((state) => state.soundTrigger);

  useEffect(() => {
    camera.add(listener.current);
    return () => {
      camera.remove(listener.current);
    };
  }, [camera]);

  useEffect(() => {
    if (soundTrigger) {
      const { sound, position, volume = 1, pitch = 1 } = soundTrigger;
      
      // Use Web Audio API directly to generate synthetic sounds
      // This avoids "Unable to decode audio data" errors from missing files
      const audioCtx = listener.current.context;
      
      // Simple synthetic sound generator
      const playSyntheticSound = () => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (sound === 'footstep') {
          // Low thump for footstep
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(150 * pitch, now);
          oscillator.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
          
          gainNode.gain.setValueAtTime(volume * 0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          
          oscillator.start(now);
          oscillator.stop(now + 0.1);
        } else if (sound === 'fire') {
          // Noise-like sound for firing
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(400 * pitch, now);
          oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.05);
          
          gainNode.gain.setValueAtTime(volume * 0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          
          oscillator.start(now);
          oscillator.stop(now + 0.05);
        } else if (sound === 'reload') {
          // Double click sound for reload
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(800 * pitch, now);
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
          
          gainNode.gain.setValueAtTime(volume * 0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          
          oscillator.start(now);
          oscillator.stop(now + 0.1);

          // Second click
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(600 * pitch, now + 0.3);
          osc2.frequency.exponentialRampToValueAtTime(300, now + 0.4);
          gain2.gain.setValueAtTime(volume * 0.1, now + 0.3);
          gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc2.start(now + 0.3);
          osc2.stop(now + 0.4);
        }
      };

      // Ensure AudioContext is resumed (browsers block auto-play)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(playSyntheticSound);
      } else {
        playSyntheticSound();
      }
    }
  }, [soundTrigger]);

  return null;
};
