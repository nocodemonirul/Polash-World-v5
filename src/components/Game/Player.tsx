import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { usePlayerControls } from '../../game/Controls';
import { getColliders, checkCollision, resolveCollision } from '../../game/Physics';
import { useGameStore } from '../../game/store';
import { Box, Capsule, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Gun } from './Gun';
import { v4 as uuidv4 } from 'uuid';
import gsap from 'gsap';

const GRAVITY = 30;
const JUMP_FORCE = 12;
const MOVE_SPEED = 10;
const PLAYER_SIZE = { w: 0.8, h: 1.6 };

export const Player: React.FC<{ config: any }> = ({ config }) => {
  const { camera } = useThree();
  const input = usePlayerControls();
  const setPlayerPos = useGameStore((state) => state.setPlayerPos);
  const setHint = useGameStore((state) => state.setHint);
  const setActivePOI = useGameStore((state) => state.setActivePOI);
  const viewMode = useGameStore((state) => state.viewMode);
  const setViewMode = useGameStore((state) => state.setViewMode);
  const fuel = useGameStore((state) => state.fuel);
  const setFuel = useGameStore((state) => state.setFuel);
  const isFlying = useGameStore((state) => state.isFlying);
  const setFlying = useGameStore((state) => state.setFlying);
  const addBullet = useGameStore((state) => state.addBullet);
  const triggerRespawnEffect = useGameStore((state) => state.triggerRespawnEffect);
  const triggerSound = useGameStore((state) => state.triggerSound);

  const setHealth = useGameStore((state) => state.setHealth);
  const health = useGameStore((state) => state.health);
  const ammo = useGameStore((state) => state.ammo);
  const setAmmo = useGameStore((state) => state.setAmmo);
  const maxAmmo = useGameStore((state) => state.maxAmmo);
  const isReloading = useGameStore((state) => state.isReloading);
  const setReloading = useGameStore((state) => state.setReloading);
  const addBulletTrail = useGameStore((state) => state.addBulletTrail);
  const triggerImpactEffect = useGameStore((state) => state.triggerImpactEffect);
  const cameraCommand = useGameStore((state) => state.cameraCommand);
  const setCameraCommand = useGameStore((state) => state.setCameraCommand);
  const isRotationLocked = useGameStore((state) => state.isRotationLocked);
  const setRotationLocked = useGameStore((state) => state.setRotationLocked);
  const isFollowingPlayer = useGameStore((state) => state.isFollowingPlayer);
  const setFollowingPlayer = useGameStore((state) => state.setFollowingPlayer);

  const pos = useRef(new THREE.Vector3(0, 5, 0));
  const orbitRef = useRef<any>(null);
  const isInteracting = useRef(false);
  const isTransitioning = useRef(false);
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const prevVelY = useRef(0); // Track previous frame velocity for impact
  const grounded = useRef(false);
  const lastMapKey = useRef(false);
  const lastFireTime = useRef(0);
  const mainGroupRef = useRef<THREE.Group>(null);
  const characterRef = useRef<THREE.Group>(null);
  const gunRef = useRef<any>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const backpackRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Group>(null);
  
  // Animation State
  const animState = useRef({
    walkTime: 0,
    isSitting: false,
    isFlying: false,
  });

  const colliders = getColliders(config);
  const raycaster = useRef(new THREE.Raycaster());

  // Handle view mode changes with smooth transitions
  useEffect(() => {
    isTransitioning.current = true;
    
    const target = new THREE.Vector3(pos.current.x, pos.current.y, 0);
    let newPos = new THREE.Vector3();
    let newUp = new THREE.Vector3(0, 1, 0);
    let lookAtTarget = target.clone();

    if (viewMode === 'free') {
      newPos.set(pos.current.x, pos.current.y + 2, 25);
    } else if (viewMode === 'side') {
      newPos.set(pos.current.x, pos.current.y + 2, 15);
    } else if (viewMode === 'eyes') {
      const eyePos = new THREE.Vector3(0, 0.2, 0.2);
      if (bodyRef.current) {
        const worldEye = eyePos.clone();
        bodyRef.current.localToWorld(worldEye);
        newPos.copy(worldEye);
      } else {
        newPos.set(pos.current.x, pos.current.y + 1.0, 0);
      }
      
      const lookDir = new THREE.Vector3(0, 0, 1);
      if (characterRef.current) {
        lookDir.applyQuaternion(characterRef.current.getWorldQuaternion(new THREE.Quaternion()));
      }
      lookAtTarget.copy(newPos).add(lookDir.multiplyScalar(5));
    }

    // Animate camera position
    gsap.to(camera.position, {
      x: newPos.x,
      y: newPos.y,
      z: newPos.z,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (viewMode !== 'eyes') {
          camera.lookAt(target);
        } else {
          camera.lookAt(lookAtTarget);
        }
      },
      onComplete: () => {
        isTransitioning.current = false;
        if (viewMode === 'free' && orbitRef.current) {
          orbitRef.current.target.copy(target);
          orbitRef.current.update();
        }
      }
    });

    // Animate camera up vector
    gsap.to(camera.up, {
      x: newUp.x,
      y: newUp.y,
      z: newUp.z,
      duration: 0.8,
      ease: 'power2.inOut'
    });

  }, [viewMode]);

  useFrame((state, delta) => {
    if (useGameStore.getState().isPaused) return;
    
    const d = Math.min(delta, 0.1); // Cap delta to prevent huge jumps

    // Firing Logic
    const currentTime = state.clock.elapsedTime;
    const fireRate = 0.2; // 200ms

    const triggerReload = () => {
      if (!isReloading && ammo < maxAmmo) {
        setReloading(true);
        triggerSound('reload', [pos.current.x, pos.current.y, pos.current.z], 0.5, 1);
        if (gunRef.current) gunRef.current.triggerReload();
        setTimeout(() => {
          setAmmo(maxAmmo);
          setReloading(false);
        }, 1500);
      }
    };

    if (input.reload) {
      triggerReload();
    }

    if (input.fire && !isReloading && currentTime - lastFireTime.current > fireRate) {
      if (ammo <= 0) {
        triggerReload();
      } else {
        lastFireTime.current = currentTime;
        setAmmo(ammo - 1);

        const muzzlePos = new THREE.Vector3();
        const bulletDirection = new THREE.Vector3();

        if (gunRef.current && gunRef.current.group) {
          // Get muzzle position in world space
          // Local muzzle position is [0, 0.12, 0.35] based on Gun.tsx
          const localMuzzle = new THREE.Vector3(0, 0.12, 0.35);
          muzzlePos.copy(localMuzzle);
          gunRef.current.group.localToWorld(muzzlePos);

          // Get gun's forward direction in world space
          // Local forward is [0, 0, 1]
          const localForward = new THREE.Vector3(0, 0, 1);
          bulletDirection.copy(localForward);
          bulletDirection.applyQuaternion(gunRef.current.group.getWorldQuaternion(new THREE.Quaternion()));
        } else {
          // Fallback to camera if gun ref is not ready
          camera.getWorldPosition(muzzlePos);
          camera.getWorldDirection(bulletDirection);
        }

        // Raycast
        raycaster.current.set(muzzlePos, bulletDirection);
        
        const trailId = uuidv4();
        const trailLength = 50;
        const endPos = muzzlePos.clone().add(bulletDirection.clone().multiplyScalar(trailLength));
        
        addBulletTrail({
          id: trailId,
          start: [muzzlePos.x, muzzlePos.y, muzzlePos.z],
          end: [endPos.x, endPos.y, endPos.z]
        });

        triggerSound('fire', [pos.current.x, pos.current.y, pos.current.z], 0.5, 1);

        if (gunRef.current) {
          gunRef.current.triggerRecoil();
        }
      }
    }

    // Toggle View Mode
    if (input.map && !lastMapKey.current) {
      const modes: ('side' | 'eyes' | 'free')[] = ['side', 'eyes', 'free'];
      const currentIndex = modes.indexOf(viewMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      setViewMode(modes[nextIndex]);
    }
    lastMapKey.current = input.map;

    // Fuel Logic (Unlimited)
    if (fuel < 100) {
      setFuel(100); // Keep fuel full
    }

    // Store previous velocity before update
    prevVelY.current = vel.current.y;

    // 4. Integration & Collision
    if (isFlying) {
      // Flight Physics
      vel.current.y = 0; // No gravity
      if (input.jump) vel.current.y = MOVE_SPEED;
      if (input.down) vel.current.y = -MOVE_SPEED;
      
      if (input.left) {
        vel.current.x = -MOVE_SPEED;
        if (characterRef.current) characterRef.current.rotation.y = -Math.PI / 2;
      } else if (input.right) {
        vel.current.x = MOVE_SPEED;
        if (characterRef.current) characterRef.current.rotation.y = Math.PI / 2;
      } else {
        vel.current.x = 0;
      }
    } else {
      // Normal Physics
      // Apply Gravity
      vel.current.y -= GRAVITY * d;
      
      // Apply Horizontal Input
      if (input.left) {
        vel.current.x = -MOVE_SPEED;
        if (characterRef.current) characterRef.current.rotation.y = -Math.PI / 2;
      } else if (input.right) {
        vel.current.x = MOVE_SPEED;
        if (characterRef.current) characterRef.current.rotation.y = Math.PI / 2;
      } else {
        vel.current.x = 0;
      }

      // Jump
      if (input.jump && grounded.current) {
        vel.current.y = JUMP_FORCE;
        grounded.current = false;
      }
    }

    // --- SWEEP TEST COLLISION ---
    
    // X Axis
    const deltaX = vel.current.x * d;
    if (Math.abs(deltaX) > 0.001) {
      const hitX = resolveCollision(
        { x: pos.current.x, y: pos.current.y + 0.05 }, // Start pos (with skin)
        { x: deltaX, y: 0 }, // Velocity vector
        { w: PLAYER_SIZE.w, h: PLAYER_SIZE.h - 0.1 }, // Size (shrunk Y)
        colliders
      );

      if (hitX.hit) {
        vel.current.x = 0;
        pos.current.x += deltaX * hitX.time;
        pos.current.x += hitX.normal.x * 0.001; // Nudge
      } else {
        pos.current.x += deltaX;
      }
    }

    // Y Axis
    const deltaY = vel.current.y * d;
    if (Math.abs(deltaY) > 0.001) {
      const hitY = resolveCollision(
        { x: pos.current.x, y: pos.current.y }, // Start pos
        { x: 0, y: deltaY }, // Velocity vector
        { w: PLAYER_SIZE.w - 0.1, h: PLAYER_SIZE.h }, // Size (shrunk X)
        colliders
      );

      if (hitY.hit) {
        if (vel.current.y < 0) {
          // Landing
          if (!grounded.current) {
             // Just landed
             const impactVel = prevVelY.current;
             if (impactVel < -20 && !isFlying) {
               const damage = Math.floor((Math.abs(impactVel) - 20) * 2);
               setHealth(Math.max(0, health - damage));
             }
          }
          grounded.current = true;
          vel.current.y = 0;
          pos.current.y += deltaY * hitY.time;
          pos.current.y += hitY.normal.y * 0.001; // Nudge
        } else {
          // Hitting head
          vel.current.y = 0;
          pos.current.y += deltaY * hitY.time;
          pos.current.y += hitY.normal.y * 0.001; // Nudge
        }
      } else {
        grounded.current = false;
        pos.current.y += deltaY;
      }
    } else {
      // If not moving vertically, check if we are still grounded
      if (grounded.current) {
         const groundCheck = checkCollision(
           { x: pos.current.x, y: pos.current.y - 0.1 },
           { w: PLAYER_SIZE.w - 0.1, h: PLAYER_SIZE.h },
           colliders
         );
         if (!groundCheck) {
           grounded.current = false;
         }
      }
    }

    // Respawn if fallen or dead
    if (pos.current.y < -50 || health <= 0) {
      triggerRespawnEffect([0, 5, 0]);
      pos.current.set(0, 5, 0);
      vel.current.set(0, 0, 0);
      setHealth(100);
      setFuel(100);
    }

    // Apply Position
    setPlayerPos([pos.current.x, pos.current.y, pos.current.z]);
    if (mainGroupRef.current) {
      mainGroupRef.current.position.set(pos.current.x, pos.current.y, 0);
    }

    // --- ANIMATION LOGIC ---
    const isMoving = Math.abs(vel.current.x) > 0.1;
    const isJumping = !grounded.current && !isFlying;
    const isSitting = input.down && grounded.current && !isMoving;
    
    // Flame Animation
    if (flameRef.current) {
        if (isFlying) {
            flameRef.current.visible = true;
            const flicker = 0.8 + Math.random() * 0.4;
            flameRef.current.scale.set(flicker, flicker, flicker);
        } else {
            flameRef.current.visible = false;
        }
    }

    // Walk Animation
    if (isMoving && grounded.current) {
      const prevWalkTime = animState.current.walkTime;
      animState.current.walkTime += d * 10;
      const legAngle = Math.sin(animState.current.walkTime) * 0.5;
      
      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (bodyRef.current) bodyRef.current.position.y = 0.92 + Math.abs(Math.sin(animState.current.walkTime * 2)) * 0.05;

      // Trigger footstep sound
      if (Math.floor(prevWalkTime / Math.PI) !== Math.floor(animState.current.walkTime / Math.PI)) {
        const volume = 0.3 + Math.random() * 0.2;
        const pitch = 0.9 + Math.random() * 0.2;
        triggerSound('footstep', [pos.current.x, pos.current.y, pos.current.z], volume, pitch);
      }
    } 
    // Jump/Fly Animation
    else if (isJumping || (isFlying && !grounded.current)) {
       if (leftLegRef.current) leftLegRef.current.rotation.x = 0.2;
       if (rightLegRef.current) rightLegRef.current.rotation.x = -0.2;
       if (bodyRef.current) bodyRef.current.position.y = 1.02; // Legs dangle
       
       // Flying tilt
       if (isFlying && characterRef.current) {
          characterRef.current.rotation.z = vel.current.x * -0.05; // Tilt forward/back
       } else if (characterRef.current) {
          characterRef.current.rotation.z = 0;
       }
    }
    // Sit Animation
    else if (isSitting) {
       if (leftLegRef.current) leftLegRef.current.rotation.x = -1.5; // Legs forward
       if (rightLegRef.current) rightLegRef.current.rotation.x = -1.5;
       if (bodyRef.current) bodyRef.current.position.y = 0.52; // Lower body
    }
    // Idle
    else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.position.y = 0.92 + Math.sin(state.clock.elapsedTime * 2) * 0.02; // Breathing
      if (characterRef.current) characterRef.current.rotation.z = 0;
    }


    // Update OrbitControls target in free mode to follow player
    if (viewMode === 'free' && orbitRef.current && isFollowingPlayer && !isInteracting.current) {
      orbitRef.current.target.lerp(new THREE.Vector3(pos.current.x, pos.current.y, 0), 0.1);
      orbitRef.current.update();
    }

    // 5. Camera Follow
    if (cameraCommand && viewMode === 'free') {
      setFollowingPlayer(true);
      const target = new THREE.Vector3(pos.current.x, pos.current.y, 0);
      const dist = 30;
      const newPos = new THREE.Vector3();
      const newUp = new THREE.Vector3(0, 1, 0);
      
      switch (cameraCommand) {
        case 'top':
          newPos.set(target.x, target.y + dist, 0.01);
          newUp.set(0, 0, -1);
          setRotationLocked(false);
          break;
        case 'bottom':
          newPos.set(target.x, target.y - dist, 0.01);
          newUp.set(0, 0, 1);
          setRotationLocked(false);
          break;
        case 'front':
          newPos.set(target.x, target.y, dist);
          newUp.set(0, 1, 0);
          setRotationLocked(true);
          break;
        case 'back':
          newPos.set(target.x, target.y, -dist);
          newUp.set(0, 1, 0);
          setRotationLocked(false);
          break;
        case 'left':
          newPos.set(target.x - dist, target.y, 0);
          newUp.set(0, 1, 0);
          setRotationLocked(false);
          break;
        case 'right':
          newPos.set(target.x + dist, target.y, 0);
          newUp.set(0, 1, 0);
          setRotationLocked(false);
          break;
        case 'reset':
          newPos.set(target.x, target.y + 5, 20);
          newUp.set(0, 1, 0);
          setRotationLocked(false);
          break;
      }

      // Smooth transition with GSAP
      gsap.to(camera.position, {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(target);
          if (orbitRef.current) {
            orbitRef.current.update();
          }
        }
      });

      gsap.to(camera.up, {
        x: newUp.x,
        y: newUp.y,
        z: newUp.z,
        duration: 0.8,
        ease: 'power2.inOut'
      });

      if (orbitRef.current) {
        gsap.to(orbitRef.current.target, {
          x: target.x,
          y: target.y,
          z: target.z,
          duration: 0.8,
          ease: 'power2.inOut'
        });
      }

      setCameraCommand(null);
    }

    if (viewMode === 'side' && !isTransitioning.current) {
      // Side View: Smooth follow from distance
      const targetX = pos.current.x;
      const targetY = pos.current.y + 2;
      const targetZ = 15;
      
      const targetPos = new THREE.Vector3(targetX, targetY, targetZ);
      camera.position.lerp(targetPos, 0.1);
      camera.lookAt(targetX, targetY, 0);
    } else if (viewMode === 'eyes' && !isTransitioning.current) {
      // Eyes View: First person
      const eyePos = new THREE.Vector3(0, 0.2, 0.2); // Relative to bodyRef
      if (bodyRef.current) {
        bodyRef.current.localToWorld(eyePos);
      } else {
        eyePos.set(pos.current.x, pos.current.y + 1.0, 0);
      }
      
      camera.position.copy(eyePos);
      
      // Look forward based on character rotation
      const lookDir = new THREE.Vector3(0, 0, 1);
      if (characterRef.current) {
        lookDir.applyQuaternion(characterRef.current.getWorldQuaternion(new THREE.Quaternion()));
      }
      camera.lookAt(eyePos.x + lookDir.x * 10, eyePos.y + lookDir.y * 10, eyePos.z + lookDir.z * 10);
    }
    // In 'free' mode, OrbitControls takes over

    // 6. Interaction Check (POI)
    let nearbyPOI = null;
    for (const poi of config.poi) {
      const island = config.islands.find((i: any) => i.id === poi.island);
      if (island) {
        const poiX = island.x + poi.xLocal;
        const poiY = island.y + poi.yLocal;
        const dist = Math.sqrt(Math.pow(pos.current.x - poiX, 2) + Math.pow(pos.current.y - poiY, 2));
        if (dist < 2) {
          nearbyPOI = poi;
          break;
        }
      }
    }

    if (nearbyPOI) {
      setHint(`Press E to open ${nearbyPOI.data.title}`);
      if (input.interact) {
        setActivePOI(nearbyPOI);
      }
    } else {
      setHint(null);
    }
  });

  const bodyColor = "#ef4444"; // Red
  const visorColor = "#7dd3fc"; // Light blue

  return (
    <>
      <group ref={mainGroupRef}>
        <group ref={characterRef} rotation={[0, Math.PI / 2, 0]}>
          {/* Main Body Group */}
          <group ref={bodyRef} position={[0, 0.92, 0]}>
              {/* Body Capsule */}
              <Capsule args={[0.35, 0.6, 4, 8]} visible={viewMode !== 'eyes'}>
              <meshStandardMaterial color={bodyColor} />
              </Capsule>
              
              {/* Backpack */}
              <group ref={backpackRef} visible={viewMode !== 'eyes'}>
                  <Box args={[0.3, 0.5, 0.25]} position={[0, 0.1, -0.3]}>
                    <meshStandardMaterial color={bodyColor} />
                  </Box>
                  {/* Jetpack Flame */}
                  <group ref={flameRef} position={[0, -0.2, -0.3]} visible={false}>
                      <Box args={[0.15, 0.3, 0.15]} position={[0, -0.15, 0]}>
                          <meshBasicMaterial color="#fbbf24" />
                      </Box>
                      <Box args={[0.1, 0.2, 0.1]} position={[0, -0.25, 0]}>
                          <meshBasicMaterial color="#ef4444" />
                      </Box>
                  </group>
              </group>

              {/* Visor */}
              <Box args={[0.4, 0.25, 0.15]} position={[0, 0.2, 0.3]} visible={viewMode !== 'eyes'}>
              <meshStandardMaterial color={visorColor} roughness={0.2} metalness={0.8} />
              </Box>

              {/* Arms & Gun */}
              {/* Right Arm (Holding Gun) */}
              <group position={[0.25, -0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                <Capsule args={[0.08, 0.3, 4, 8]}>
                  <meshStandardMaterial color={bodyColor} />
                </Capsule>
                <group position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <Gun ref={gunRef} />
                </group>
              </group>

              {/* Left Arm (Supporting/Tactical) */}
              <group position={[-0.25, -0.15, 0.1]} rotation={[Math.PI / 3, 0, 0.2]}>
                <Capsule args={[0.08, 0.25, 4, 8]}>
                  <meshStandardMaterial color={bodyColor} />
                </Capsule>
              </group>
          </group>
          
          {/* Legs */}
          <group position={[0, 0.42, 0]} visible={viewMode !== 'eyes'}>
              <group ref={leftLegRef} position={[-0.15, 0, 0]}>
                  <Capsule args={[0.12, 0.3, 4, 8]} position={[0, -0.15, 0]}>
                      <meshStandardMaterial color={bodyColor} />
                  </Capsule>
              </group>
              <group ref={rightLegRef} position={[0.15, 0, 0]}>
                  <Capsule args={[0.12, 0.3, 4, 8]} position={[0, -0.15, 0]}>
                      <meshStandardMaterial color={bodyColor} />
                  </Capsule>
              </group>
          </group>
        </group>
      </group>
      {viewMode !== 'free' && <primitive object={camera} />}
      {viewMode === 'free' && (
        <OrbitControls 
          ref={orbitRef}
          onStart={() => { 
            isInteracting.current = true; 
            setFollowingPlayer(false);
          }}
          onEnd={() => { isInteracting.current = false; }}
          enableDamping 
          dampingFactor={0.05} 
          makeDefault 
          target={[pos.current.x, pos.current.y, 0]}
          screenSpacePanning={true}
          enableRotate={!isRotationLocked}
          mouseButtons={{
            LEFT: isRotationLocked ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: isRotationLocked ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN
          }}
          minDistance={2}
          maxDistance={1000}
        />
      )}
    </>
  );
};
