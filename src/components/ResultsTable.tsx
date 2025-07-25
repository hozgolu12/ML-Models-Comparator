import React from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { ModelResult } from '../types';
import { formatMetricName } from '../utils/exportUtils';

interface ResultsTableProps {
  models: ModelResult[];
  taskType: string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ models}) => {
  if (!models.length) return null;

  const metrics = Object.keys(models[0].metrics);
  const sortedModels = [...models].sort((a, b) => {
    // Sort by first metric (usually accuracy or R2 for regression)
    const firstMetric = metrics[0];
    return b.metrics[firstMetric] - a.metrics[firstMetric];
  });

  const getBestWorstIndicator = (metric: string, value: number, allValues: number[]) => {
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    
    // For metrics like 'inertia' or 'mse', lower is better
    const lowerIsBetter = metric.includes('inertia') || metric.includes('mse') || metric.includes('mae');
    
    if (lowerIsBetter) {
      if (value === min) return <TrendingDown className="w-4 h-4 text-green-500 inline ml-1" />;
      if (value === max) return <TrendingUp className="w-4 h-4 text-red-500 inline ml-1" />;
    } else {
      if (value === max) return <TrendingUp className="w-4 h-4 text-green-500 inline ml-1" />;
      if (value === min) return <TrendingDown className="w-4 h-4 text-red-500 inline ml-1" />;
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Model
            </th>
            {metrics.map((metric) => (
              <th
                key={metric}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {formatMetricName(metric)}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Clock className="w-4 h-4 inline mr-1" />
              Training Time (s)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedModels.map((model, index) => (
            <tr key={model.name} className={index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                    ${index === 0 ? 'bg-green-100 text-green-800' : 
                      index === 1 ? 'bg-blue-100 text-blue-800' : 
                      index === 2 ? 'bg-orange-100 text-orange-800' : 
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {index + 1}
                  </span>
                  {index === 0 && <span className="ml-2 text-xs text-green-600 font-medium">Best</span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{model.name}</div>
                <div className="text-sm text-gray-500">{model.type}</div>
              </td>
              {metrics.map((metric) => {
                const allValues = models.map(m => m.metrics[metric]);
                return (
                  <td key={metric} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {model.metrics[metric].toFixed(4)}
                      {getBestWorstIndicator(metric, model.metrics[metric], allValues)}
                    </div>
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {model.training_time.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};