import { Process } from '../types/process';

const processNames = [
  { name: 'Chrome', baseMemory: 1500, baseCpu: 15 },
  { name: 'Firefox', baseMemory: 1200, baseCpu: 12 },
  { name: 'VS Code', baseMemory: 800, baseCpu: 8 },
  { name: 'Node.js', baseMemory: 400, baseCpu: 5 },
  { name: 'Spotify', baseMemory: 600, baseCpu: 3 },
  { name: 'Slack', baseMemory: 700, baseCpu: 4 },
  { name: 'Discord', baseMemory: 800, baseCpu: 6 },
  { name: 'Docker', baseMemory: 300, baseCpu: 2 },
  { name: 'MongoDB', baseMemory: 500, baseCpu: 3 },
  { name: 'PostgreSQL', baseMemory: 400, baseCpu: 2 }
];

// Generate more realistic mock data
export const generateMockProcessData = (count: number): Process[] => {
  const timeNow = Date.now();
  
  return Array.from({ length: count }, (_, i) => {
    const process = processNames[i % processNames.length];
    const variability = Math.sin(timeNow / 1000 + i) * 0.3 + 1; // Create some variation over time
    
    return {
      id: (i + 1).toString(),
      name: process.name,
      status: Math.random() > 0.9 ? 'paused' : 'running',
      cpu: Number((process.baseCpu * variability).toFixed(1)),
      memory: Math.floor(process.baseMemory * variability),
      uptime: generateUptime()
    };
  });
};

const generateUptime = (): string => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};