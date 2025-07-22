import React from 'react';
import { ChartConfig } from '../../types/config';

interface PreviewChartProps {
  chart: ChartConfig;
}

const PreviewChart: React.FC<PreviewChartProps> = ({ chart }) => {
  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return '📊';
      case 'line': return '📈';
      case 'scatter': return '🔸';
      case 'pie': return '🥧';
      case 'area': return '📉';
      case 'histogram': return '📊';
      case 'heatmap': return '🔥';
      default: return '📊';
    }
  };

  return (
    <div className="bg-white border rounded p-3 shadow-sm">
      <div className="text-xs font-medium text-gray-800 mb-2">{chart.title}</div>
      <div className="flex items-center justify-center h-16 bg-gray-100 rounded">
        <div className="text-2xl">{getChartIcon(chart.type)}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {chart.type} | X: {chart.x} | Y: {chart.y}
      </div>
    </div>
  );
};

export default PreviewChart;
