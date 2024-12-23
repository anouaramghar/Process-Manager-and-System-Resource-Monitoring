import React from 'react';
import { Cpu, HardDrive, Monitor } from 'lucide-react';

interface SystemStatsProps {
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ cpuUsage, memoryUsage, gpuUsage }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">CPU Usage</p>
            <p className="text-2xl font-semibold">{cpuUsage}%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <HardDrive className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Memory Usage</p>
            <p className="text-2xl font-semibold">{memoryUsage}%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Monitor className="w-6 h-6 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">GPU Usage</p>
            <p className="text-2xl font-semibold">{gpuUsage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};