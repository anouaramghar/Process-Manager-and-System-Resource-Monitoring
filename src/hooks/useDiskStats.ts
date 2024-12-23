import { useState, useEffect } from 'react';

interface DiskInfo {
  device: string;
  mountpoint: string;
  size: number;
  used: number;
  available: number;
  usagePercentage: number;
}

export const useDiskStats = () => {
  const [disks, setDisks] = useState<DiskInfo[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiskStats = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/disk-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch disk statistics');
        }
        const data = await response.json();
        setDisks(data);
        setError(undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch disk statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDiskStats();
    const interval = setInterval(fetchDiskStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { disks, error, loading };
};
