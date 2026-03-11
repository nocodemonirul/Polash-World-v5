import React, { useMemo } from 'react';
import { Box, Cylinder, Cone, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const Castle: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const wallMaterial = "#f3f4f6"; // Very light gray (off-white)
  const roofMaterial = "#3b82f6"; // Vibrant blue
  const brickMaterial = "#6b7280"; // Medium gray
  const windowMaterial = "#374151"; // Dark gray for windows

  const brickDetails = useMemo(() => {
    const bricks = [];
    // Bricks for main wall
    for (let i = 0; i < 12; i++) {
      bricks.push({
        position: [(Math.random() - 0.5) * 6, Math.random() * 5 + 1, 0.76] as [number, number, number],
        scale: [0.4, 0.2, 0.05] as [number, number, number]
      });
    }
    // Bricks for left tower
    for (let i = 0; i < 8; i++) {
      bricks.push({
        position: [-5, Math.random() * 6 + 0.5, 1.51] as [number, number, number],
        scale: [0.4, 0.2, 0.05] as [number, number, number]
      });
    }
    // Bricks for right tower base
    for (let i = 0; i < 6; i++) {
      bricks.push({
        position: [5, Math.random() * 1.5 + 0.2, 1.51] as [number, number, number],
        scale: [0.4, 0.2, 0.05] as [number, number, number]
      });
    }
    return bricks;
  }, []);

  return (
    <group position={position}>
      <group position={[0, 0, 0]}>
        {/* MAIN WALL */}
        <Box args={[8, 6, 1.5]} position={[0, 3, 0]}>
          <meshStandardMaterial color={wallMaterial} />
        </Box>

        {/* GATEWAY ARCH & RECESSED DOOR */}
        <group position={[0, 0, 0.55]}>
          {/* Stone Arch Frame (Detailed) */}
          <group position={[0, 0, 0]}>
             <Cylinder args={[1.5, 1.5, 0.6, 32, 1, false, 0, Math.PI]} rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 1.8, 0]}>
                <meshStandardMaterial color="#9ca3af" />
             </Cylinder>
             <Box args={[3, 1.8, 0.6]} position={[0, 0.9, 0]}>
                <meshStandardMaterial color="#9ca3af" />
             </Box>
             {/* Stone blocks around arch */}
             {[ -1.5, -0.75, 0, 0.75, 1.5 ].map((x, i) => (
                <Box key={`arch-stone-${i}`} args={[0.4, 0.4, 0.7]} position={[x, 3.2, 0]}>
                   <meshStandardMaterial color="#6b7280" />
                </Box>
             ))}
          </group>

          {/* Wooden Door */}
          <group position={[0, 0, -0.1]}>
            <Cylinder args={[1.3, 1.3, 0.1, 32, 1, false, 0, Math.PI]} rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 1.8, 0]}>
              <meshStandardMaterial color="#78350f" />
            </Cylinder>
            <Box args={[2.6, 1.8, 0.1]} position={[0, 0.9, 0]}>
              <meshStandardMaterial color="#78350f" />
            </Box>
            
            {/* Iron Bands */}
            {[ 0.6, 1.4, 2.4 ].map((y, i) => (
               <group key={`band-${i}`} position={[0, y, 0.06]}>
                  <Box args={[2.5, 0.12, 0.02]}>
                     <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
                  </Box>
                  {/* Studs on bands */}
                  {[ -1.0, -0.5, 0.5, 1.0 ].map((sx, j) => (
                     <Sphere key={`stud-${i}-${j}`} args={[0.04, 8, 8]} position={[sx, 0, 0.01]}>
                        <meshStandardMaterial color="#4b5563" metalness={0.8} />
                     </Sphere>
                  ))}
               </group>
            ))}

            {/* Door seam */}
            <Box args={[0.06, 3, 0.11]} position={[0, 1.5, 0]}>
              <meshStandardMaterial color="#451a03" />
            </Box>
            {/* Door handles */}
            <Sphere args={[0.12, 16, 16]} position={[-0.4, 1.4, 0.1]}>
              <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
            </Sphere>
            <Sphere args={[0.12, 16, 16]} position={[0.4, 1.4, 0.1]}>
              <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
            </Sphere>
          </group>
        </group>

        {/* MAIN WALL BATTLEMENTS */}
        {[ -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5 ].map((x, i) => (
          <Box key={`mwb-${i}`} args={[0.6, 0.8, 0.8]} position={[x, 6.4, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Box>
        ))}

        {/* LEFT TOWER */}
        <group position={[-5.5, 0, 0]}>
          {/* Base */}
          <Box args={[3.5, 1.5, 3.5]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Box>
          {/* Main Body */}
          <Box args={[3, 9, 3]} position={[0, 4.5, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Box>
          {/* Top Section */}
          <Box args={[3.8, 1.5, 3.8]} position={[0, 9, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Box>
          {/* Top Battlements */}
          {[-1.5, 0, 1.5].map((x) => [-1.5, 1.5].map((z) => (
            <Box key={`ltb-${x}-${z}`} args={[0.6, 0.7, 0.6]} position={[x * 1.1, 10.1, z * 1.1]}>
              <meshStandardMaterial color={wallMaterial} />
            </Box>
          )))}
          {[-1.5, 1.5].map((x) => (
            <Box key={`ltb-side-${x}`} args={[0.6, 0.7, 0.6]} position={[x * 1.1, 10.1, 0]}>
              <meshStandardMaterial color={wallMaterial} />
            </Box>
          ))}
          {/* Windows */}
          <Box args={[0.5, 1.2, 0.1]} position={[0, 6, 1.51]}>
            <meshStandardMaterial color={windowMaterial} />
          </Box>
          <Box args={[0.5, 1.2, 0.1]} position={[0, 3, 1.51]}>
            <meshStandardMaterial color={windowMaterial} />
          </Box>
        </group>

        {/* RIGHT TOWER */}
        <group position={[5.5, 0, 0]}>
          {/* Base */}
          <Cylinder args={[2, 2, 1.5, 8]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Cylinder>
          {/* Main Body */}
          <Cylinder args={[1.5, 1.5, 9, 8]} position={[0, 4.5, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Cylinder>
          {/* Middle Bulge */}
          <Cylinder args={[1.8, 1.8, 3, 8]} position={[0, 7.5, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Cylinder>
          {/* Window Section */}
          <Cylinder args={[1.6, 1.6, 1.2, 8]} position={[0, 9.6, 0]}>
            <meshStandardMaterial color={wallMaterial} />
          </Cylinder>
          {/* Windows */}
          {[0, 90, 180, 270].map((angle, i) => (
            <Box key={`rw-${i}`} args={[0.4, 0.6, 0.1]} position={[Math.cos(angle * Math.PI / 180) * 1.55, 9.6, Math.sin(angle * Math.PI / 180) * 1.55]} rotation={[0, -angle * Math.PI / 180, 0]}>
              <meshStandardMaterial color={windowMaterial} />
            </Box>
          ))}
          {/* Roof Flare */}
          <Cylinder args={[2.2, 1.8, 0.6, 32]} position={[0, 10.5, 0]}>
            <meshStandardMaterial color={roofMaterial} />
          </Cylinder>
          {/* Main Roof */}
          <Cone args={[2, 4.5, 32]} position={[0, 13, 0]}>
            <meshStandardMaterial color={roofMaterial} />
          </Cone>
        </group>

        {/* BRICK DETAILS */}
        {brickDetails.map((brick, i) => (
          <Box key={`brick-${i}`} args={brick.scale} position={brick.position}>
            <meshStandardMaterial color={brickMaterial} />
          </Box>
        ))}
      </group>
    </group>
  );
};
