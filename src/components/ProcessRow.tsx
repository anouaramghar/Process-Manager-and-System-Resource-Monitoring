import React from 'react';
import { Process } from '../types/process';
import { Square } from 'lucide-react';

interface ProcessRowProps {
  process: Process;
  onKill: (id: string) => void;
}

export const ProcessRow: React.FC<ProcessRowProps> = ({ process, onKill }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{process.name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(process.status)}`}>
          {process.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${Math.min(100, process.cpu)}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">{process.cpu}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-green-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${Math.min(100, process.memoryPercentage)}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">{process.memory.toFixed(1)} MB</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{process.uptime}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onKill(process.id)}
            className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
            disabled={process.status === 'stopped'}
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};