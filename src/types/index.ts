import { AudioContextType } from '@/types';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface Project {
  id: number;
  title: string;
  description: string;
  tools: string[];
  stars: number;
  level: string;
  color: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: Date;
}

export type { AudioContextType, Project };
