import React, { useState } from 'react';
import ConfigPanel from './ConfigPanel';
import PreviewPanel from './PreviewPanel';
import { LayoutConfig } from '../types/config';

const LayoutBuilder: React.FC = () => {
  const [config, setConfig] = useState<LayoutConfig>({
    layout: 'minimal-reports',
    cards: ['sales', 'growth'],
    filters: [],
    alleys: [{ charts: [] }],
    include_table: false,
  });

  const handleGenerateCode = async () => {
    try {
      const response = await fetch('http://localhost:8000/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Dashboard.tsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate code');
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Builder</h1>
            <button
              onClick={handleGenerateCode}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Code
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ConfigPanel config={config} onConfigChange={setConfig} />
          <PreviewPanel config={config} />
        </div>
      </div>
    </div>
  );
};

export default LayoutBuilder;
