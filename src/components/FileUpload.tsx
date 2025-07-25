import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UploadProgress } from '../types';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadProgress: UploadProgress;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  uploadProgress,
  disabled = false
}) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !disabled) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, disabled]);

  const onDropRejected = useCallback((fileRejections: unknown[]) => {
    console.log('Files rejected:', fileRejections);
    // You could show an error message here for rejected files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'application/csv': ['.csv']
    },
    multiple: false,
    disabled: disabled || uploadProgress.status === 'uploading' || uploadProgress.status === 'processing',
    noClick: disabled || uploadProgress.status === 'uploading' || uploadProgress.status === 'processing'
  });

  const getStatusIcon = () => {
    switch (uploadProgress.status) {
      case 'completed':
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      case 'uploading':
      case 'processing':
        return (
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadProgress.status) {
      case 'uploading':
        return `Uploading... ${uploadProgress.progress}%`;
      case 'processing':
        return 'Processing dataset and training models...';
      case 'completed':
        return 'Analysis completed successfully!';
      case 'error':
        return uploadProgress.message || 'Upload failed';
      default:
        return 'Drop your CSV file here or click to browse';
    }
  };

  const isActive = isDragActive;
  const isProcessing = uploadProgress.status === 'uploading' || uploadProgress.status === 'processing';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadProgress.status === 'error' ? 'border-red-300 bg-red-50' : ''}
          ${uploadProgress.status === 'completed' ? 'border-green-300 bg-green-50' : ''}
          ${isProcessing ? 'cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {getStatusMessage()}
            </p>
            
            {uploadProgress.status === 'idle' && (
              <p className="text-sm text-gray-500">
                Supports CSV files up to 100MB. We'll analyze your data and compare 10 different ML models.
              </p>
            )}
            
            {uploadProgress.status === 'error' && (
              <p className="text-sm text-red-600 mt-2">
                Please check your file format and try again.
              </p>
            )}
          </div>
          
          {isProcessing && (
            <div className="w-full max-w-xs">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {uploadProgress.status === 'idle' && (
          <div className="absolute top-4 right-4">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Your data is processed locally and securely. We support both classification and regression tasks.
        </p>
      </div>
    </div>
  );
};