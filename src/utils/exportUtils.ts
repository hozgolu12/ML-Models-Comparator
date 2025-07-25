import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComparisonResults } from '../types';

export const exportToCSV = (results: ComparisonResults): void => {
  const csvRows = [
    ['Model', 'Type', 'Training Time (s)', ...Object.keys(results.models[0]?.metrics || {})],
    ...results.models.map(model => [
      model.name,
      model.type,
      model.training_time.toFixed(3),
      ...Object.values(model.metrics).map(value => value.toFixed(4))
    ])
  ];

  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `ml-comparison-results-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found for PDF export');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 20;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
  } catch (error) {
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const formatMetricName = (metric: string): string => {
  const formatMap: { [key: string]: string } = {
    'accuracy': 'Accuracy',
    'precision': 'Precision',
    'recall': 'Recall',
    'f1_score': 'F1 Score',
    'roc_auc': 'ROC-AUC',
    'mse': 'MSE',
    'mae': 'MAE',
    'r2_score': 'R² Score',
    'silhouette_score': 'Silhouette Score',
    'inertia': 'Inertia'
  };
  return formatMap[metric] || metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};