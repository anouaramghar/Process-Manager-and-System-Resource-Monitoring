import React from 'react';
import { Activity } from 'lucide-react';
import { Process } from './types/process';
import { ProcessList } from './components/ProcessList';
import { SystemStats } from './components/SystemStats';
import { DiskStats } from './components/DiskStats';
import { SearchBar } from './components/SearchBar';
import { OptimizationSuggestions } from './components/OptimizationSuggestions';
import { useProcesses } from './hooks/useProcesses';
import { useSystemStats } from './hooks/useSystemStats';
import { useDiskStats } from './hooks/useDiskStats';
import { useOptimizationSuggestions } from './hooks/useOptimizationSuggestions';

function App() {
  const {
    processes,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleKillProcess,
    handleRestartProcess,
    error: processError
  } = useProcesses();

  const { stats, error: statsError } = useSystemStats();
  const { disks, error: diskError } = useDiskStats();

  const suggestions = useOptimizationSuggestions(
    processes,
    {
      cpuUsage: stats.cpu.usage,
      memoryUsage: stats.memory.usagePercentage,
      gpuUsage: stats.gpu.usage,
      disks: disks.map(disk => ({
        usagePercentage: disk.usagePercentage,
        available: disk.available
      }))
    }
  );

  const handleSort = (column: keyof Process) => {
    if (sortBy === column) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Process Manager</h1>
        </div>

        {(processError || statsError || diskError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {processError || statsError || diskError}
          </div>
        )}

        <SystemStats
          cpuUsage={stats.cpu.usage}
          memoryUsage={stats.memory.usagePercentage}
          gpuUsage={stats.gpu.usage}
        />

        <DiskStats disks={disks} error={diskError} />

        <OptimizationSuggestions suggestions={suggestions} />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          <ProcessList
            processes={processes}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onKillProcess={handleKillProcess}
            onRestartProcess={handleRestartProcess}
          />
        </div>
      </div>
    </div>
  );
}

export default App;