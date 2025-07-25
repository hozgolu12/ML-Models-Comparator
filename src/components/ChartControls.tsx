import React from 'react';
import { BarChart3, Radar } from 'lucide-react';
import { ModelResult } from '../types';
import { formatMetricName } from '../utils/exportUtils';

interface ChartControlsProps {
  chartType: 'bar' | 'radar';
  onChartTypeChange: (type: 'bar' | 'radar') => void;
  selectedMetric?: string;
  onMetricChange: (metric: string) => void;
  models: ModelResult[];
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChartTypeChange,
  selectedMetric,
  onMetricChange,
  models
}) => {
  if (!models.length) return null;

  const metrics = Object.keys(models[0].metrics);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Chart Type:</label>
        <div className="flex bg-white rounded-md shadow-sm">
          <button
            onClick={() => onChartTypeChange('bar')}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-l-md border
              ${chartType === 'bar' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
            `}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Bar Chart
          </button>
          <button
            onClick={() => onChartTypeChange('radar')}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b
              ${chartType === 'radar' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
            `}
          >
            <Radar className="w-4 h-4 mr-1" />
            Radar Chart
          </button>
        </div>
      </div>

      {chartType === 'bar' && (
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Metric:</label>
          <select
            value={selectedMetric || metrics[0]}
            onChange={(e) => onMetricChange(e.target.value)}
            className="block w-48 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {metrics.map((metric) => (
              <option key={metric} value={metric}>
                {formatMetricName(metric)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};