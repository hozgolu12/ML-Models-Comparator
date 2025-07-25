import React, { useState } from 'react';
import { Download, FileText, FileImage, Loader } from 'lucide-react';
import { ComparisonResults } from '../types';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface ExportButtonsProps {
  results: ComparisonResults;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ results }) => {
  const [exportingPDF, setExportingPDF] = useState(false);

  const handleCSVExport = () => {
    try {
      exportToCSV(results);
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const handlePDFExport = async () => {
    setExportingPDF(true);
    try {
      const filename = `ml-comparison-report-${new Date().toISOString().split('T')[0]}.pdf`;
      await exportToPDF('results-dashboard', filename);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleCSVExport}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export CSV
      </button>
      
      <button
        onClick={handlePDFExport}
        disabled={exportingPDF}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {exportingPDF ? (
          <Loader className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <FileImage className="w-4 h-4 mr-2" />
        )}
        {exportingPDF ? 'Generating...' : 'Export PDF'}
      </button>
      
      <div className="text-xs text-gray-500">
        <Download className="w-3 h-3 inline mr-1" />
        Export your results for further analysis
      </div>
    </div>
  );
};