import React from 'react';
import { LayoutConfig, ChartConfig, FilterConfig } from '../types/config';

interface ConfigPanelProps {
  config: LayoutConfig;
  onConfigChange: (config: LayoutConfig) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange }) => {
  const updateConfig = (updates: Partial<LayoutConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const addCard = () => {
    const cardName = prompt('Enter card name:');
    if (cardName) {
      updateConfig({ cards: [...config.cards, cardName] });
    }
  };

  const removeCard = (index: number) => {
    const newCards = config.cards.filter((_, i) => i !== index);
    updateConfig({ cards: newCards });
  };

  const addSection = () => {
    const sectionKey = config.layout === 'minimal-reports' ? 'alleys' : 'lanes';
    const currentSections = config[sectionKey] || [];
    updateConfig({
      [sectionKey]: [...currentSections, { charts: [] }]
    });
  };

  const addChart = (sectionIndex: number) => {
    const chartType = prompt('Chart type (bar, line, scatter, pie, area, histogram, heatmap):') as ChartConfig['type'];
    const title = prompt('Chart title:') || 'Untitled Chart';
    const x = prompt('X-axis variable:') || 'x';
    const y = prompt('Y-axis variable:') || 'y';
    
    if (chartType) {
      const sectionKey = config.layout === 'minimal-reports' ? 'alleys' : 'lanes';
      const sections = [...(config[sectionKey] || [])];
      sections[sectionIndex].charts.push({
        type: chartType,
        title,
        x,
        y,
        color: '#8884d8'
      });
      updateConfig({ [sectionKey]: sections });
    }
  };

  const addFilter = () => {
    const filterType = prompt('Filter type (dropdown, multichoice, date_range, slider, text_box):') as FilterConfig['type'];
    const label = prompt('Filter label:') || 'Filter';
    const id = prompt('Filter ID:') || 'filter_' + Date.now();
    
    if (filterType) {
      updateConfig({
        filters: [...config.filters, { type: filterType, label, id }]
      });
    }
  };

  const sections = config.layout === 'minimal-reports' ? config.alleys : config.lanes;
  const sectionName = config.layout === 'minimal-reports' ? 'Alley' : 'Lane';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Configuration</h2>

      {/* Layout Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Layout Type</label>
        <select
          value={config.layout}
          onChange={(e) => updateConfig({ layout: e.target.value as 'minimal-reports' | 'jacket-reports' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="minimal-reports">Minimal Reports</option>
          <option value="jacket-reports">Jacket Reports</option>
        </select>
      </div>

      {/* Cards */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Cards</label>
          <button
            onClick={addCard}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Card
          </button>
        </div>
        <div className="space-y-2">
          {config.cards.map((card, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span>{card}</span>
              <button
                onClick={() => removeCard(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Filters</label>
          <button
            onClick={addFilter}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Filter
          </button>
        </div>
        <div className="space-y-2">
          {config.filters.map((filter, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded">
              <div className="text-sm font-medium">{filter.label}</div>
              <div className="text-xs text-gray-600">{filter.type} - {filter.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections (Alleys/Lanes) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">{sectionName}s</label>
          <button
            onClick={addSection}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add {sectionName}
          </button>
        </div>
        <div className="space-y-4">
          {sections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{sectionName} {sectionIndex + 1}</h4>
                <button
                  onClick={() => addChart(sectionIndex)}
                  className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Add Chart
                </button>
              </div>
              <div className="space-y-2">
                {section.charts.map((chart, chartIndex) => (
                  <div key={chartIndex} className="bg-gray-50 p-2 rounded text-sm">
                    <div className="font-medium">{chart.title}</div>
                    <div className="text-xs text-gray-600">
                      {chart.type} - X: {chart.x}, Y: {chart.y}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Include Table */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.include_table}
            onChange={(e) => updateConfig({ include_table: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Include Data Table</span>
        </label>
      </div>
    </div>
  );
};

export default ConfigPanel;
