import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, SoftShadows } from '@react-three/drei';
import { MAKE_LEVEL_CONFIG } from './game/LevelConfig';
import { Island } from './components/Game/Island';
import { Tunnel } from './components/Game/Tunnel';
import { Opening } from './components/Game/Opening';
import { POI } from './components/Game/POI';
import { Player } from './components/Game/Player';
import { UI } from './components/Game/UI';
import { Color } from './styles';
import { useGameStore } from './game/store';

import { Minimap } from './components/Game/Minimap';
import { MinimapMarkers } from './components/Game/MinimapMarkers';
import { Ocean } from './components/Game/Ocean';
import { Cloud } from './components/Game/Cloud';
import { Lighthouse } from './components/Game/Lighthouse';
import { Ship } from './components/Game/Ship';
import { Boat } from './components/Game/Boat';
import { DayNightCycle } from './components/Game/DayNightCycle';
import { EffectComposer, N8AO, Vignette } from '@react-three/postprocessing';
import { Bullets } from './components/Game/Bullets';
import { Effects } from './components/Game/Effects';
import { SoundManager } from './components/Game/SoundManager';
import { Tree } from './components/Game/Tree';
import { Castle } from './components/Game/Castle';

const World: React.FC<{ config: any }> = ({ config }) => {
  return (
    <>
      <DayNightCycle />
      <Ocean />
      
      {/* Ocean Elements */}
      <Lighthouse position={[-80, -40, 60]} />
      
      <Ship position={[-40, -40, 100]} rotation={[0, 0.5, 0]} />
      <Ship position={[120, -40, 80]} rotation={[0, -0.2, 0]} />
      
      <Boat position={[20, -40, 40]} rotation={[0, 1, 0]} />
      <Boat position={[50, -40, -60]} rotation={[0, 2, 0]} />
      <Boat position={[-20, -40, -40]} rotation={[0, -1, 0]} />

      {/* Clouds */}
      <Cloud position={[0, 20, -10]} speed={2} opacity={0.6} />
      <Cloud position={[40, 25, -20]} speed={1.5} opacity={0.5} />
      <Cloud position={[80, 18, -15]} speed={2.2} opacity={0.7} />
      <Cloud position={[120, 22, -5]} speed={1.8} opacity={0.6} />
      <Cloud position={[150, 28, -25]} speed={1.2} opacity={0.5} />

      {config.islands.map((spec: any) => {
        const projectPOI = config.poi.find((p: any) => p.island === spec.id && p.type === 'project');
        return <Island key={spec.id} spec={spec} poiData={projectPOI} openings={config.openings} />;
      })}
      {config.skyIslands?.map((spec: any) => {
        const projectPOI = config.poi.find((p: any) => p.island === spec.id && p.type === 'project');
        return <Island key={spec.id} spec={spec} poiData={projectPOI} />;
      })}
      {config.tunnel.segments.map((spec: any, index: number) => (
        <Tunnel 
          key={spec.id} 
          spec={spec} 
          y={config.tunnel.y} 
          isStart={index === 0}
          isEnd={index === config.tunnel.segments.length - 1}
          openings={config.openings}
        />
      ))}
      {config.openings.map((spec: any) => (
        <Opening key={spec.id} spec={spec} config={config} />
      ))}
      {config.poi.map((spec: any) => (
        <POI key={spec.id} spec={spec} config={config} />
      ))}
      
      {/* Surface Trees (Limited to 5 total across world) */}
      <Tree position={[3, 1.6, 0]} scale={1.2} />
      <Tree position={[145, 1.6, 0]} scale={1.1} />
      
      {/* Sky Island Tree */}
      <Tree position={[90, 23.5, 0]} scale={1.1} />
      
      {/* Castle at the end of the map on tunnel top ground */}
      <Castle position={[173, -7, 0]} />
      
      {/* Tunnel Surface Trees */}

      <Player config={config} />
      <Minimap />
      <MinimapMarkers config={config} />
      <Bullets config={config} />
      <Effects />
      <SoundManager />

      {/* Post Processing */}
      <EffectComposer>
        <N8AO halfRes color="black" aoRadius={2} intensity={1} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};

export default function App() {
  const config = useMemo(() => MAKE_LEVEL_CONFIG("POLASH-001"), []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: Color.Base.Surface[1] }}>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 5, 20], fov: 50 }}>
        <SoftShadows size={25} samples={10} focus={0} />
        <World config={config} />
        
        {/* <OrbitControls /> */}
      </Canvas>
      <UI />
    </div>
  );
}
