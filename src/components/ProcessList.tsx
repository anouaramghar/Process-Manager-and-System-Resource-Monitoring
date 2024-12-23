import React from 'react';
import { Process } from '../types/process';
import { ProcessRow } from './ProcessRow';
import { ArrowUpDown } from 'lucide-react';

interface ProcessListProps {
  processes: Process[];
  sortBy: keyof Process;
  sortOrder: 'asc' | 'desc';
  onSort: (column: keyof Process) => void;
  onKillProcess: (id: string) => void;
  onRestartProcess: (id: string) => void;
}

export const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  sortBy,
  sortOrder,
  onSort,
  onKillProcess,
  onRestartProcess
}) => {
  const SortHeader: React.FC<{ column: keyof Process; label: string }> = ({ column, label }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <ArrowUpDown className={`w-4 h-4 transition-opacity ${
          sortBy === column ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        } ${sortOrder === 'desc' && sortBy === column ? 'transform rotate-180' : ''}`} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <SortHeader column="name" label="Process" />
            <SortHeader column="status" label="Status" />
            <SortHeader column="cpu" label="CPU" />
            <SortHeader column="memory" label="Memory" />
            <SortHeader column="uptime" label="Uptime" />
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {processes.map((process) => (
            <ProcessRow
              key={process.id}
              process={process}
              onKill={onKillProcess}
              onRestart={onRestartProcess}
            />
          ))}
          {processes.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No processes found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};