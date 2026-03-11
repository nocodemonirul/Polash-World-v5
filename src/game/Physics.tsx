import { LevelConfig } from './LevelConfig';

export interface Box {
  min: { x: number; y: number };
  max: { x: number; y: number };
}

export const getColliders = (config: LevelConfig): Box[] => {
  const colliders: Box[] = [];
  const holeWidth = 3.0; // Matches Tunnel.tsx and Opening.tsx radius * 2

  // Islands
  config.islands.forEach(island => {
    colliders.push({
      min: { x: island.x - island.width / 2, y: island.y - island.height / 2 },
      max: { x: island.x + island.width / 2, y: island.y + island.height / 2 }
    });
  });

  // Sky Islands
  config.skyIslands.forEach(island => {
    colliders.push({
      min: { x: island.x - island.width / 2, y: island.y - island.height / 2 },
      max: { x: island.x + island.width / 2, y: island.y + island.height / 2 }
    });
  });

  // Tunnels (Floor and Ceiling)
  config.tunnel.segments.forEach(seg => {
    const y = config.tunnel.y;
    const height = 6; // Matches Tunnel.tsx constant height
    
    // Floor
    colliders.push({
      min: { x: seg.x - seg.width / 2, y: y - height / 2 - 1.0 },
      max: { x: seg.x + seg.width / 2, y: y - height / 2 }
    });

    const relevantOpenings = config.openings.filter(o => o.tunnelSeg === seg.id);

    if (relevantOpenings.length === 0) {
      // Ceiling (Inside)
      colliders.push({
        min: { x: seg.x - seg.width / 2, y: y + height / 2 },
        max: { x: seg.x + seg.width / 2, y: y + height / 2 + 1.0 }
      });

      // Top Surface (Outside/Above)
      colliders.push({
        min: { x: seg.x - seg.width / 2, y: y + 5.0 - 0.5 },
        max: { x: seg.x + seg.width / 2, y: y + 5.0 }
      });
    } else {
      // Split ceiling into segments around holes
      const sortedOpenings = [...relevantOpenings].sort((a, b) => a.tunnelXLocal - b.tunnelXLocal);
      let currentX = -seg.width / 2;
      
      sortedOpenings.forEach(o => {
        const holeStart = o.tunnelXLocal - holeWidth / 2;
        const segmentWidth = holeStart - currentX;
        
        if (segmentWidth > 0.1) {
          // Ceiling (Inside)
          colliders.push({
            min: { x: seg.x + currentX, y: y + height / 2 },
            max: { x: seg.x + holeStart, y: y + height / 2 + 1.0 }
          });
          // Top Surface (Outside/Above)
          colliders.push({
            min: { x: seg.x + currentX, y: y + 5.0 - 0.5 },
            max: { x: seg.x + holeStart, y: y + 5.0 }
          });
        }
        currentX = o.tunnelXLocal + holeWidth / 2;
      });
      
      const finalWidth = seg.width / 2 - currentX;
      if (finalWidth > 0.1) {
        // Ceiling (Inside)
        colliders.push({
          min: { x: seg.x + currentX, y: y + height / 2 },
          max: { x: seg.x + seg.width / 2, y: y + height / 2 + 1.0 }
        });
        // Top Surface (Outside/Above)
        colliders.push({
          min: { x: seg.x + currentX, y: y + 5.0 - 0.5 },
          max: { x: seg.x + seg.width / 2, y: y + 5.0 }
        });
      }
    }
  });

  // Tunnel End Walls
  if (config.tunnel.segments.length > 0) {
    const first = config.tunnel.segments[0];
    const last = config.tunnel.segments[config.tunnel.segments.length - 1];
    const y = config.tunnel.y;
    
    // Start Wall
    colliders.push({
      min: { x: first.x - first.width / 2 - 1, y: y - 10 },
      max: { x: first.x - first.width / 2, y: y + 10 }
    });

    // End Wall
    colliders.push({
      min: { x: last.x + last.width / 2, y: y - 10 },
      max: { x: last.x + last.width / 2 + 1, y: y + 10 }
    });
  }

  return colliders;
};

export const checkCollision = (
  pos: { x: number; y: number },
  size: { w: number; h: number },
  colliders: Box[]
): Box | null => {
  const playerMinX = pos.x - size.w / 2;
  const playerMaxX = pos.x + size.w / 2;
  const playerMinY = pos.y;
  const playerMaxY = pos.y + size.h;

  for (const box of colliders) {
    if (
      playerMaxX > box.min.x &&
      playerMinX < box.max.x &&
      playerMaxY > box.min.y &&
      playerMinY < box.max.y
    ) {
      return box;
    }
  }
  return null;
};

export const sweptAABB = (
  pos: { x: number; y: number },
  vel: { x: number; y: number },
  size: { w: number; h: number },
  box: Box
): { hit: boolean; time: number; normal: { x: number; y: number } } => {
  const pMinX = pos.x - size.w / 2;
  const pMaxX = pos.x + size.w / 2;
  const pMinY = pos.y;
  const pMaxY = pos.y + size.h;

  const bMinX = box.min.x;
  const bMaxX = box.max.x;
  const bMinY = box.min.y;
  const bMaxY = box.max.y;

  let invEntryX, invEntryY;
  let invExitX, invExitY;

  if (vel.x > 0) {
    invEntryX = bMinX - pMaxX;
    invExitX = bMaxX - pMinX;
  } else {
    invEntryX = bMaxX - pMinX;
    invExitX = bMinX - pMaxX;
  }

  if (vel.y > 0) {
    invEntryY = bMinY - pMaxY;
    invExitY = bMaxY - pMinY;
  } else {
    invEntryY = bMaxY - pMinY;
    invExitY = bMinY - pMaxY;
  }

  let entryX, entryY;
  let exitX, exitY;

  if (vel.x === 0) {
    entryX = -Infinity;
    exitX = Infinity;
    if (pMaxX <= bMinX || pMinX >= bMaxX) return { hit: false, time: 1, normal: { x: 0, y: 0 } };
  } else {
    entryX = invEntryX / vel.x;
    exitX = invExitX / vel.x;
  }

  if (vel.y === 0) {
    entryY = -Infinity;
    exitY = Infinity;
    if (pMaxY <= bMinY || pMinY >= bMaxY) return { hit: false, time: 1, normal: { x: 0, y: 0 } };
  } else {
    entryY = invEntryY / vel.y;
    exitY = invExitY / vel.y;
  }

  const entryTime = Math.max(entryX, entryY);
  const exitTime = Math.min(exitX, exitY);

  if (entryTime > exitTime || entryX > 1 || entryY > 1) {
    return { hit: false, time: 1, normal: { x: 0, y: 0 } };
  }

  if (entryTime < 0) {
    return { hit: false, time: 1, normal: { x: 0, y: 0 } };
  }

  let normal = { x: 0, y: 0 };
  if (entryX > entryY) {
    if (invEntryX < 0) normal = { x: 1, y: 0 };
    else normal = { x: -1, y: 0 };
  } else {
    if (invEntryY < 0) normal = { x: 0, y: 1 };
    else normal = { x: 0, y: -1 };
  }

  return { hit: true, time: entryTime, normal };
};

export const resolveCollision = (
  pos: { x: number; y: number },
  vel: { x: number; y: number },
  size: { w: number; h: number },
  colliders: Box[]
): { hit: boolean; time: number; normal: { x: number; y: number }; box: Box | null } => {
  let minTime = 1;
  let hitNormal = { x: 0, y: 0 };
  let hitBox = null;
  let didHit = false;

  for (const box of colliders) {
    const result = sweptAABB(pos, vel, size, box);
    if (result.hit && result.time >= 0 && result.time < minTime) {
      minTime = result.time;
      hitNormal = result.normal;
      hitBox = box;
      didHit = true;
    }
  }

  return { hit: didHit, time: minTime, normal: hitNormal, box: hitBox };
};
