export interface Process {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'paused';
  cpu: number;
  memory: number;
  memoryPercentage: number;
  uptime: string;
}

export interface SystemStats {
    cpu: {
        usage: number;
    };
    memory: {
        used: number;
        total: number;
        usagePercentage: number;
    };
    gpu: {
        usage: number;
    };
}