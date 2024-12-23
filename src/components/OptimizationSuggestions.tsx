import React from 'react';
import { AlertTriangle, Info, AlertCircle, XCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'warning' | 'info' | 'critical';
  title: string;
  description: string;
  action?: string;
}

interface OptimizationSuggestionsProps {
  suggestions: Suggestion[];
}

export const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({
  suggestions
}) => {
  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2">
          <Info className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">System Optimization</h2>
        </div>
        <p className="mt-4 text-gray-600">No optimization suggestions at this time. Your system is running optimally!</p>
      </div>
    );
  }

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50';
      case 'critical':
        return 'bg-red-50';
      case 'info':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            System Optimization Suggestions
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {suggestions.map(suggestion => (
          <div
            key={suggestion.id}
            className={`${getBackgroundColor(
              suggestion.type
            )} rounded-lg p-4 border border-opacity-50 ${
              suggestion.type === 'warning'
                ? 'border-yellow-200'
                : suggestion.type === 'critical'
                ? 'border-red-200'
                : 'border-blue-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(suggestion.type)}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{suggestion.description}</p>
                {suggestion.action && (
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Recommended action: {suggestion.action}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
