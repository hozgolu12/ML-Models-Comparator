import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { ModelResult } from '../types';
import { formatMetricName } from '../utils/exportUtils';

interface ModelResultsChartProps {
  models: ModelResult[];
  chartType: 'bar' | 'radar';
  selectedMetric?: string;
}

export const ModelResultsChart: React.FC<ModelResultsChartProps> = ({
  models,
  chartType,
  selectedMetric
}) => {
  if (!models.length) return null;

  // Prepare data for bar chart
  const barChartData = models.map(model => ({
    name: model.name.replace(' ', '\n'),
    ...model.metrics,
    training_time: model.training_time
  }));

  // Prepare data for radar chart
  const radarChartData = Object.keys(models[0].metrics).map(metric => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataPoint:any = { metric: formatMetricName(metric) };
    models.forEach(model => {
      dataPoint[model.name] = model.metrics[metric];
    });
    return dataPoint;
  });

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
  ];

  if (chartType === 'radar') {
    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarChartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 1]} 
              tick={{ fontSize: 10 }}
            />
            {models.map((model, index) => (
              <Radar
                key={model.name}
                name={model.name}
                dataKey={model.name}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Tooltip 
              formatter={(value: number) => [value.toFixed(4), '']}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Bar chart with metric selection
  const metrics = Object.keys(models[0].metrics);
  const metricToShow = selectedMetric || metrics[0];

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [value.toFixed(4), formatMetricName(metricToShow)]}
            labelStyle={{ color: '#374151' }}
          />
          <Bar 
            dataKey={metricToShow} 
            fill={colors[0]}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};