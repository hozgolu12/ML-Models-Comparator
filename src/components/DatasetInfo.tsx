import React from 'react';
import { Database, Users, Columns, Target, Zap, Shield } from 'lucide-react';
import { ComparisonResults } from '../types';

interface DatasetInfoProps {
  results: ComparisonResults;
}

export const DatasetInfo: React.FC<DatasetInfoProps> = ({ results }) => {
  const { dataset_info, preprocessing_info, task_type } = results;

  const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; description?: string }> = ({
    icon,
    title,
    value,
    description
  }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Database className="w-5 h-5 mr-2" />
        Dataset Overview
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InfoCard
          icon={<Users className="w-5 h-5 text-blue-500" />}
          title="Total Samples"
          value={dataset_info.rows.toLocaleString()}
          description="Number of data points in your dataset"
        />
        
        <InfoCard
          icon={<Columns className="w-5 h-5 text-green-500" />}
          title="Features"
          value={dataset_info.columns}
          description="Total number of columns including target"
        />
        
        <InfoCard
          icon={<Target className="w-5 h-5 text-purple-500" />}
          title="Task Type"
          value={task_type.charAt(0).toUpperCase() + task_type.slice(1)}
          description="Automatically detected ML task"
        />
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Preprocessing Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Missing values handled:</span>
            <span className="font-medium text-gray-900">
              {preprocessing_info.missing_values_handled}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Categorical features encoded:</span>
            <span className="font-medium text-gray-900">
              {preprocessing_info.categorical_features_encoded}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Features scaled:</span>
            <span className="font-medium text-gray-900">
              {preprocessing_info.features_scaled ? 'Yes' : 'No'}
            </span>
          </div>
          
          {dataset_info.target && (
            <div className="flex justify-between">
              <span className="text-gray-600">Target variable:</span>
              <span className="font-medium text-gray-900">
                {dataset_info.target}
              </span>
            </div>
          )}
        </div>
      </div>

      {dataset_info.features.length > 0 && (
        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Feature Overview
          </h4>
          <div className="flex flex-wrap gap-2">
            {dataset_info.features.slice(0, 10).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
            {dataset_info.features.length > 10 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                +{dataset_info.features.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};