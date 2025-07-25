import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DatasetInfo } from './components/DatasetInfo';
import { ModelResultsChart } from './components/ModelResultsChart';
import { ResultsTable } from './components/ResultsTable';
import { ExportButtons } from './components/ExportButtons';
import { ChartControls } from './components/ChartControls';
import { apiService } from './services/api';
import { ComparisonResults, UploadProgress } from './types';
import { AlertCircle, Wifi } from 'lucide-react';

function App() {
  const [results, setResults] = useState<ComparisonResults | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    // Load results from local storage on mount
    const storedResults = localStorage.getItem('results');
    if (storedResults && storedResults !== 'null') {
      try {
        setResults(JSON.parse(storedResults));
      } catch (e) {
        console.error("Error parsing results from local storage", e);
        localStorage.removeItem("results");
      }
    }
  }, []);

  React.useEffect(() => {
    // Save results to local storage whenever it changes, but skip the initial render.
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (results) {
        localStorage.setItem('results', JSON.stringify(results));
      } else {
        localStorage.removeItem('results');
      }
    }
  }, [results]);

  // Check API connection on mount
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        await apiService.healthCheck();
        setApiConnected(true);
      } catch {
        setApiConnected(false);
      }
    };
    
    checkConnection();
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    console.log('File uploaded:', file.name, file.size, file.type);
    setError(null);
    setResults(null);
    setUploadProgress({ progress: 0, status: 'uploading' });

    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('File size must be less than 100MB');
      }

      const result = await apiService.compareModels(file, (progress) => {
        setUploadProgress({ progress, status: 'uploading' });
      });

      setUploadProgress({ progress: 100, status: 'processing' });
      
      // Simulate processing time for better UX
      setTimeout(() => {
        setResults(result);
        setUploadProgress({ progress: 100, status: 'completed' });
        
        // Set default metric for bar chart
        if (result.models.length > 0) {
          const firstMetric = Object.keys(result.models[0].metrics)[0];
          setSelectedMetric(firstMetric);
        }
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      console.error('Upload error:', errorMessage);
      setError(errorMessage);
      setUploadProgress({ 
        progress: 0, 
        status: 'error', 
        message: errorMessage 
      });
    }
  }, []);

  const resetToUpload = () => {
    setResults(null);
    setError(null);
    setUploadProgress({ progress: 0, status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Connection Status */}
        {apiConnected === false && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Wifi className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Backend API Not Connected
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  The ML processing backend is not available. Please ensure the FastAPI server is running on localhost:8000.
                  <br />
                  <span className="font-medium">For demo purposes, you can still explore the UI.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {!results ? (
          <div className="text-center py-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compare ML Models on Your Dataset
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload your CSV file and we'll automatically train and compare 10 different machine learning models, 
                providing detailed performance metrics and visualizations.
              </p>
              
              <FileUpload
                onFileUpload={handleFileUpload}
                uploadProgress={uploadProgress}
                disabled={apiConnected === false}
              />
              
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">10 ML Algorithms</h3>
                  <p className="text-gray-600 text-sm">
                    From Linear Regression to Neural Networks, we test them all automatically.
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Analysis</h3>
                  <p className="text-gray-600 text-sm">
                    Automatic task detection and appropriate metrics selection for your data.
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Results</h3>
                  <p className="text-gray-600 text-sm">
                    Get comprehensive model comparison results in minutes, not hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="results-dashboard" className="space-y-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Model Comparison Results</h2>
                <p className="text-gray-600 mt-1">
                  Analysis completed for {results.task_type} task with {results.models.length} models
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <ExportButtons results={results} />
                <button
                  onClick={resetToUpload}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Upload New Dataset
                </button>
              </div>
            </div>

            {/* Dataset Information */}
            <DatasetInfo results={results} />

            {/* Chart Controls and Visualization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Visualization</h3>
              
              <ChartControls
                chartType={chartType}
                onChartTypeChange={setChartType}
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
                models={results.models}
              />
              
              <div className="mt-4">
                <ModelResultsChart
                  models={results.models}
                  chartType={chartType}
                  selectedMetric={selectedMetric}
                />
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Results</h3>
              <ResultsTable models={results.models} taskType={results.task_type} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;