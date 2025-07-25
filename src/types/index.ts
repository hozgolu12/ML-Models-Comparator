export interface ModelResult {
  name: string;
  metrics: {
    [key: string]: number;
  };
  training_time: number;
  type: 'classification' | 'regression' | 'clustering';
}

export interface ComparisonResults {
  task_type: 'classification' | 'regression' | 'clustering';
  models: ModelResult[];
  dataset_info: {
    rows: number;
    columns: number;
    features: string[];
    target?: string;
  };
  preprocessing_info: {
    missing_values_handled: number;
    categorical_features_encoded: number;
    features_scaled: boolean;
  };
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
}

export interface ApiError {
  detail: string;
  code?: string;
}