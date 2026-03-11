import { useState, useEffect } from 'react';
import { useGameStore } from './store';

export const usePlayerControls = () => {
  const [input, setInput] = useState({
    left: false,
    right: false,
    jump: false,
    interact: false,
    map: false,
    down: false,
    fly: false,
    fire: false,
    reload: false,
  });

  const viewMode = useGameStore((state) => state.viewMode);

  useEffect(() => {
    // We no longer force inputs to false in free mode, 
    // allowing the player to move while in free cam.
  }, [viewMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow movement in all modes including free cam
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setInput((prev) => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setInput((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          setInput((prev) => ({ ...prev, jump: true }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setInput((prev) => ({ ...prev, down: true }));
          break;
        case 'KeyE':
        case 'Enter':
          setInput((prev) => ({ ...prev, interact: true }));
          break;
        case 'KeyM':
          setInput((prev) => ({ ...prev, map: true }));
          break;
    case 'KeyF':
      useGameStore.getState().toggleFlying();
      break;
        case 'KeyX':
          setInput((prev) => ({ ...prev, fire: true }));
          break;
        case 'KeyR':
          setInput((prev) => ({ ...prev, reload: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Allow movement in all modes including free cam
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setInput((prev) => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setInput((prev) => ({ ...prev, right: false }));
          break;
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          setInput((prev) => ({ ...prev, jump: false }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setInput((prev) => ({ ...prev, down: false }));
          break;
        case 'KeyE':
        case 'Enter':
          setInput((prev) => ({ ...prev, interact: false }));
          break;
        case 'KeyM':
          setInput((prev) => ({ ...prev, map: false }));
          break;
        case 'KeyX':
          setInput((prev) => ({ ...prev, fire: false }));
          break;
        case 'KeyR':
          setInput((prev) => ({ ...prev, reload: false }));
          break;
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
        // Don't fire with mouse in free cam mode to allow for dragging
        if (e.button === 0 && useGameStore.getState().viewMode !== 'free') { 
            setInput((prev) => ({ ...prev, fire: true }));
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 0) {
            setInput((prev) => ({ ...prev, fire: false }));
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const unsubscribe = useGameStore.subscribe(
      (state) => {
        setInput((prev) => ({ 
          ...prev, 
          fire: state.isFiringFromUI,
        }));
      }
    );

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      unsubscribe();
    };
  }, []);

  return input;
};
