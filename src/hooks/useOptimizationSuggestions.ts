import { useState, useEffect } from 'react';
import { Process } from '../types/process';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  disks: Array<{
    usagePercentage: number;
    available: number;
  }>;
}

interface Suggestion {
  id: string;
  type: 'warning' | 'info' | 'critical';
  title: string;
  description: string;
  action?: string;
}

export const useOptimizationSuggestions = (
  processes: Process[],
  systemMetrics: SystemMetrics
) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const newSuggestions: Suggestion[] = [];

    // CPU Usage Analysis
    if (systemMetrics.cpuUsage > 80) {
      const highCpuProcesses = processes
        .filter(p => p.cpu > 20)
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 3);

      if (highCpuProcesses.length > 0) {
        newSuggestions.push({
          id: 'high-cpu',
          type: 'warning',
          title: 'High CPU Usage Detected',
          description: `Processes with high CPU usage: ${highCpuProcesses
            .map(p => `${p.name} (${p.cpu.toFixed(1)}%)`)
            .join(', ')}`,
          action: 'Consider terminating or limiting these processes'
        });
      }
    }

    // Memory Usage Analysis
    if (systemMetrics.memoryUsage > 85) {
      const highMemProcesses = processes
        .filter(p => p.memory > 500 * 1024 * 1024) // 500MB
        .sort((a, b) => b.memory - a.memory)
        .slice(0, 3);

      if (highMemProcesses.length > 0) {
        newSuggestions.push({
          id: 'high-memory',
          type: 'warning',
          title: 'High Memory Usage Detected',
          description: `Processes consuming significant memory: ${highMemProcesses
            .map(p => `${p.name} (${(p.memory / (1024 * 1024)).toFixed(1)} MB)`)
            .join(', ')}`,
          action: 'Consider restarting these processes or freeing up memory'
        });
      }
    }

    // GPU Usage Analysis
    if (systemMetrics.gpuUsage > 75) {
      newSuggestions.push({
        id: 'high-gpu',
        type: 'info',
        title: 'High GPU Usage',
        description: 'GPU usage is above 75%. This might impact system performance.',
        action: 'Check for GPU-intensive applications that could be optimized'
      });
    }

    // Disk Space Analysis
    systemMetrics.disks.forEach((disk, index) => {
      if (disk.usagePercentage > 90) {
        newSuggestions.push({
          id: `disk-space-${index}`,
          type: 'critical',
          title: 'Critical Disk Space',
          description: `Disk usage is at ${disk.usagePercentage.toFixed(1)}%. Only ${(
            disk.available /
            (1024 * 1024 * 1024)
          ).toFixed(1)}GB available.`,
          action: 'Clean up unnecessary files or expand storage'
        });
      }
    });

    // Zombie Process Detection
    const zombieProcesses = processes.filter(
      p => p.state === 'zombie' || p.state === 'defunct'
    );
    if (zombieProcesses.length > 0) {
      newSuggestions.push({
        id: 'zombie-processes',
        type: 'warning',
        title: 'Zombie Processes Detected',
        description: `Found ${zombieProcesses.length} zombie processes that should be cleaned up.`,
        action: 'Terminate parent processes or restart system if persistent'
      });
    }

    // Long-Running Process Analysis
    const longRunningProcesses = processes.filter(
      p => p.uptime > 7 * 24 * 60 * 60 // 7 days
    );
    if (longRunningProcesses.length > 0) {
      newSuggestions.push({
        id: 'long-running',
        type: 'info',
        title: 'Long-Running Processes',
        description: `${longRunningProcesses.length} processes have been running for over 7 days.`,
        action: 'Consider restarting these processes to free up resources'
      });
    }

    setSuggestions(newSuggestions);
  }, [processes, systemMetrics]);

  return suggestions;
};
