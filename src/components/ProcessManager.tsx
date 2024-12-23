import React, { useState, useEffect } from 'react';
import { Process, SystemStats } from '../types/process';
import { ProcessRow } from './ProcessRow';
import { Cpu, HardDrive, Monitor } from 'lucide-react';

export const ProcessManager: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: { usage: 0 },
    memory: { used: 0, total: 0, usagePercentage: 0 },
    gpu: { usage: 0 }
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processesResponse, statsResponse] = await Promise.all([
          fetch('http://localhost:3002/api/processes'),
          fetch('http://localhost:3002/api/system-stats')
        ]);
        
        const processesData = await processesResponse.json();
        const statsData = await statsResponse.json();
        
        setProcesses(processesData);
        setSystemStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKill = async (id: string) => {
    try {
      await fetch(`http://localhost:3002/api/processes/${id}/kill`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error killing process:', error);
    }
  };

  const handleRestart = async (id: string) => {
    try {
      await fetch(`http://localhost:3002/api/processes/${id}/restart`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error restarting process:', error);
    }
  };

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Process Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">CPU Usage</h2>
              <p className="text-2xl font-semibold text-gray-900">{systemStats.cpu.usage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <HardDrive className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Memory Usage</h2>
              <p className="text-2xl font-semibold text-gray-900">{systemStats.memory.usagePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Monitor className="w-6 h-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">GPU Usage</h2>
              <p className="text-2xl font-semibold text-gray-900">{systemStats.gpu.usage}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search processes..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProcesses.map((process) => (
                <ProcessRow
                  key={process.id}
                  process={process}
                  onKill={handleKill}
                  onRestart={handleRestart}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};