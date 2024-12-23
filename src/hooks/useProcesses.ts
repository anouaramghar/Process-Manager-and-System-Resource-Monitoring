import { useState, useEffect } from 'react';
import { Process } from '../types/process';
import { getSystemProcesses, killProcess } from '../utils/processUtils';

export const useProcesses = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Process>('cpu');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = async () => {
    try {
      const systemProcesses = await getSystemProcesses();
      setProcesses(systemProcesses);
      setError(null);
    } catch (err) {
      setError('Failed to fetch processes');
      console.error('Error fetching processes:', err);
    }
  };

  useEffect(() => {
    fetchProcesses();
    const interval = setInterval(fetchProcesses, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProcesses = [...filteredProcesses].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortOrder === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleKillProcess = async (id: string) => {
    try {
      await killProcess(id);
      await fetchProcesses(); // Refresh the process list
    } catch (err) {
      setError('Failed to kill process');
      console.error('Error killing process:', err);
    }
  };

  return {
    processes: sortedProcesses,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleKillProcess,
    error
  };
};