import { useState, useEffect } from 'react';

interface SystemStats {
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

export const useSystemStats = () => {
  const [stats, setStats] = useState<SystemStats>({
    cpu: { usage: 0 },
    memory: { used: 0, total: 0, usagePercentage: 0 },
    gpu: { usage: 0 }
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/system-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch system stats');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch system stats');
      console.error('Error fetching system stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return { stats, error };
};
