import React from 'react';
import { HardDrive } from 'lucide-react';

interface DiskInfo {
  device: string;
  mountpoint: string;
  size: number;
  used: number;
  available: number;
  usagePercentage: number;
}

interface DiskStatsProps {
  disks: DiskInfo[];
  error?: string;
}

export const DiskStats: React.FC<DiskStatsProps> = ({ disks, error }) => {
  const formatBytes = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading disk information: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <HardDrive className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Disk Usage</h2>
      </div>
      <div className="space-y-4">
        {disks.map((disk, index) => (
          <div key={`${disk.device}-${index}`} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">
                {disk.device} ({disk.mountpoint})
              </span>
              <span className="text-gray-600">
                {formatBytes(disk.used)} / {formatBytes(disk.size)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  disk.usagePercentage > 90
                    ? 'bg-red-600'
                    : disk.usagePercentage > 70
                    ? 'bg-yellow-400'
                    : 'bg-green-600'
                }`}
                style={{ width: `${disk.usagePercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-600">
              <span>Available: {formatBytes(disk.available)}</span>
              <span>{disk.usagePercentage.toFixed(1)}% used</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
