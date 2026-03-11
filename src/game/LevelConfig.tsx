import { v4 as uuidv4 } from 'uuid';

export interface IslandSpec {
  id: string;
  tag: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  variant: string;
  budgets: {
    trees: number;
    rocks: number;
    grass: number;
    cover: number;
    buildings: number;
  };
}

export interface TunnelSegSpec {
  id: string;
  x: number;
  width: number;
  type: string;
}

export interface OpeningSpec {
  id: string;
  surfaceIsland: string;
  surfaceXLocal: number;
  tunnelSeg: string;
  tunnelXLocal: number;
  type: string;
}

export interface POISpec {
  id: string;
  type: string;
  island: string;
  xLocal: number;
  yLocal: number;
  data: {
    title: string;
    link: string;
    description?: string;
    socialLinks?: { name: string; url: string }[];
  };
}

export interface LevelConfig {
  seed: string;
  worldSpec: {
    lengthX: number;
    surfaceYRange: [number, number];
    tunnelY: number;
    skyY: number;
  };
  islands: IslandSpec[];
  skyIslands: IslandSpec[];
  tunnel: {
    y: number;
    segments: TunnelSegSpec[];
  };
  openings: OpeningSpec[];
  poi: POISpec[];
  sky: {
    clouds: {
      layers: number;
      density: number;
      speedMin: number;
      speedMax: number;
    };
  };
}

export const MAKE_LEVEL_CONFIG = (seed: string): LevelConfig => {
  return {
    seed: seed,
    worldSpec: {
      lengthX: 220,
      surfaceYRange: [-1, 6],
      tunnelY: -12,
      skyY: 14
    },
    islands: [
      { id: "S", tag: "start", x: 0, y: 0, width: 12, height: 3.2, depth: 3.5, variant: "grassRock", budgets: { trees: 1, rocks: 20, grass: 180, cover: 2, buildings: 0 } },
      { id: "A", tag: "filler", x: 19, y: 1, width: 10, height: 3.0, depth: 3.2, variant: "floatingForest", budgets: { trees: 4, rocks: 15, grass: 200, cover: 3, buildings: 0 } },
      { id: "P1", tag: "project", x: 38, y: 2, width: 14, height: 3.6, depth: 3.6, variant: "crystalCave", budgets: { trees: 0, rocks: 40, grass: 100, cover: 4, buildings: 1 } },
      { id: "B", tag: "filler", x: 61, y: 0, width: 9, height: 2.8, depth: 3.0, variant: "grassRock", budgets: { trees: 1, rocks: 18, grass: 160, cover: 2, buildings: 0 } },
      { id: "P2", tag: "project", x: 80, y: 2, width: 14, height: 3.6, depth: 3.6, variant: "floatingForest", budgets: { trees: 5, rocks: 20, grass: 260, cover: 4, buildings: 1 } },
      { id: "POND", tag: "pond", x: 103, y: 1, width: 16, height: 3.0, depth: 3.8, variant: "grassRock", budgets: { trees: 2, rocks: 20, grass: 220, cover: 2, buildings: 0 } },
      { id: "SOC", tag: "social", x: 148, y: 1, width: 12, height: 3.0, depth: 3.3, variant: "floatingForest", budgets: { trees: 3, rocks: 15, grass: 200, cover: 2, buildings: 0 } },
      { id: "END", tag: "end", x: 191, y: 0, width: 12, height: 3.2, depth: 3.5, variant: "grassRock", budgets: { trees: 1, rocks: 18, grass: 160, cover: 2, buildings: 0 } },
    ],
    skyIslands: [
      { id: "SKY1", tag: "sky", x: 20, y: 25, width: 8, height: 2.5, depth: 3.0, variant: "floatingForest", budgets: { trees: 3, rocks: 5, grass: 100, cover: 1, buildings: 0 } },
      { id: "SKY2", tag: "sky", x: 50, y: 30, width: 10, height: 2.8, depth: 3.2, variant: "crystalCave", budgets: { trees: 0, rocks: 20, grass: 80, cover: 1, buildings: 0 } },
      { id: "SKY3", tag: "sky", x: 90, y: 22, width: 12, height: 3.0, depth: 3.5, variant: "floatingForest", budgets: { trees: 4, rocks: 10, grass: 150, cover: 2, buildings: 0 } },
      { id: "SKY4", tag: "sky", x: 130, y: 28, width: 9, height: 2.6, depth: 3.0, variant: "crystalCave", budgets: { trees: 0, rocks: 15, grass: 90, cover: 1, buildings: 0 } },
    ],
    tunnel: {
      y: -12,
      segments: [
        { id: "T0", x: 10, width: 20, type: "corridor" },
        { id: "T1", x: 33, width: 26, type: "room" },
        { id: "T2", x: 59, width: 26, type: "corridor" },
        { id: "T3", x: 87, width: 30, type: "junction" },
        { id: "T4", x: 117, width: 30, type: "corridor" },
        { id: "T5", x: 145, width: 26, type: "room" },
        { id: "T6", x: 173, width: 30, type: "junction" },
      ]
    },
    openings: [
      { id: "O1", surfaceIsland: "A", surfaceXLocal: 0, tunnelSeg: "T0", tunnelXLocal: 4, type: "ladder" },
      { id: "O2", surfaceIsland: "SOC", surfaceXLocal: -8, tunnelSeg: "T4", tunnelXLocal: -7, type: "shaft" },
      { id: "O3", surfaceIsland: "END", surfaceXLocal: 28, tunnelSeg: "T6", tunnelXLocal: 11, type: "hatch" },
    ],
    poi: [
      { id: "POI_P1", type: "project", island: "P1", xLocal: 0, yLocal: 4.2, data: { title: "Project Alpha", link: "#", description: "A revolutionary AI agent." } },
      { id: "POI_P2", type: "project", island: "P2", xLocal: 0, yLocal: 4.2, data: { title: "Project Beta", link: "#", description: "Next-gen web framework." } },
      { id: "POI_ABOUT", type: "about", island: "T1", xLocal: 0, yLocal: 0.0, data: { title: "About Me", link: "#", description: "Project Designer, Interaction Designer, Founder & CEO of Shade studio" } },
      { id: "POI_SOC", type: "social", island: "SOC", xLocal: 0, yLocal: 4.0, data: { 
        title: "Socials", 
        link: "#", 
        description: "Connect with me on my social platforms.",
        socialLinks: [
          { name: "X", url: "https://x.com" },
          { name: "Instagram", url: "https://instagram.com" },
          { name: "LinkedIn", url: "https://linkedin.com" },
          { name: "Reddit", url: "https://reddit.com" },
          { name: "Facebook", url: "https://facebook.com" }
        ]
      } },
      {id: "POI_CON", type: "contact", island: "END", xLocal: -2, yLocal: 4.0, data: { title: "Contact", link: "#", description: "Send a message." } },
      { id: "POI_SKY_P1", type: "project", island: "SKY1", xLocal: 0, yLocal: 3.5, data: { title: "Sky Project X", link: "#", description: "Cloud-based AI." } },
      { id: "POI_SKY_P2", type: "project", island: "SKY2", xLocal: 0, yLocal: 3.8, data: { title: "Sky Project Y", link: "#", description: "Atmospheric data." } },
      { id: "POI_SKY_CON", type: "contact", island: "SKY4", xLocal: 0, yLocal: 3.6, data: { title: "Sky Contact", link: "#", description: "Reach me in the clouds." } },
      { id: "POI_CASTLE", type: "about", island: "T6", xLocal: 0, yLocal: 8.5, data: { title: "The Great Castle", link: "#", description: "A mysterious fortress at the edge of the world." } },
    ],
    sky: { clouds: { layers: 2, density: 12, speedMin: 0.2, speedMax: 0.6 } }
  };
};
