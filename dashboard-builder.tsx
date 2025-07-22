import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const DashboardBuilder = () => {
  const [config, setConfig] = useState({
    layout_type: 'minimal-reports',
    cards: [],
    alleys: [],
    lanes: [],
    filters: [],
    include_data_table: false
  });

  const [jsonOutput, setJsonOutput] = useState('');

  const updateConfig = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const addCard = () => {
    const newCard = { title: '', metric: '' };
    setConfig(prev => ({ ...prev, cards: [...prev.cards, newCard] }));
  };

  const updateCard = (index, field, value) => {
    const updatedCards = [...config.cards];
    updatedCards[index][field] = value;
    updateConfig('cards', updatedCards);
  };

  const removeCard = (index) => {
    const updatedCards = config.cards.filter((_, i) => i !== index);
    updateConfig('cards', updatedCards);
  };

  const addAlleyOrLane = () => {
    const field = config.layout_type === 'minimal-reports' ? 'alleys' : 'lanes';
    const newItem = { charts: [] };
    setConfig(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const removeAlleyOrLane = (index) => {
    const field = config.layout_type === 'minimal-reports' ? 'alleys' : 'lanes';
    const updated = config[field].filter((_, i) => i !== index);
    updateConfig(field, updated);
  };

  const addChart = (containerIndex) => {
    const field = config.layout_type === 'minimal-reports' ? 'alleys' : 'lanes';
    const newChart = { type: 'bar', title: '', x: '', y: '', group_by: '' };
    const updated = [...config[field]];
    updated[containerIndex].charts.push(newChart);
    updateConfig(field, updated);
  };

  const updateChart = (containerIndex, chartIndex, field, value) => {
    const fieldName = config.layout_type === 'minimal-reports' ? 'alleys' : 'lanes';
    const updated = [...config[fieldName]];
    updated[containerIndex].charts[chartIndex][field] = value;
    updateConfig(fieldName, updated);
  };

  const removeChart = (containerIndex, chartIndex) => {
    const field = config.layout_type === 'minimal-reports' ? 'alleys' : 'lanes';
    const updated = [...config[field]];
    updated[containerIndex].charts.splice(chartIndex, 1);
    updateConfig(field, updated);
  };

  const addFilter = () => {
    const newFilter = { type: 'multi_choice', filter_id: '', label: '', placeholder_data: '' };
    setConfig(prev => ({ ...prev, filters: [...prev.filters, newFilter] }));
  };

  const updateFilter = (index, field, value) => {
    const updatedFilters = [...config.filters];
    updatedFilters[index][field] = value;
    updateConfig('filters', updatedFilters);
  };

  const removeFilter = (index) => {
    const updatedFilters = config.filters.filter((_, i) => i !== index);
    updateConfig('filters', updatedFilters);
  };

  const generateJSON = () => {
    const output = { ...config };
    
    // Clean up based on layout type
    if (output.layout_type === 'minimal-reports') {
      delete output.lanes;
    } else {
      delete output.alleys;
    }

    // Process filters to convert placeholder_data to array
    output.filters = output.filters.map(filter => {
      const processedFilter = { ...filter };
      if (processedFilter.placeholder_data) {
        processedFilter.placeholder_data = processedFilter.placeholder_data.split(',').map(s => s.trim()).filter(s => s);
      } else {
        delete processedFilter.placeholder_data;
      }
      return processedFilter;
    });

    // Clean up charts - remove empty group_by fields
    const containerField = output.layout_type === 'minimal-reports' ? 'alleys' : 'lanes';
    if (output[containerField]) {
      output[containerField] = output[containerField].map(container => ({
        charts: container.charts.map(chart => {
          const cleanChart = { ...chart };
          if (!cleanChart.group_by) {
            delete cleanChart.group_by;
          }
          return cleanChart;
        })
      }));
    }

    setJsonOutput(JSON.stringify(output, null, 2));
  };

  const CardForm = ({ card, index }) => (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Card {index + 1}</h4>
        <button onClick={() => removeCard(index)} className="text-red-500 hover:text-red-700">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={card.title}
          onChange={(e) => updateCard(index, 'title', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Metric"
          value={card.metric}
          onChange={(e) => updateCard(index, 'metric', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const ChartForm = ({ chart, containerIndex, chartIndex }) => (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-sm font-medium">Chart {chartIndex + 1}</h5>
        <button onClick={() => removeChart(containerIndex, chartIndex)} className="text-red-500 hover:text-red-700">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={chart.type}
          onChange={(e) => updateChart(containerIndex, chartIndex, 'type', e.target.value)}
          className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="scatter">Scatter</option>
          <option value="pie">Pie</option>
          <option value="area">Area</option>
          <option value="histogram">Histogram</option>
          <option value="heatmap">Heatmap</option>
        </select>
        <input
          type="text"
          placeholder="Title"
          value={chart.title}
          onChange={(e) => updateChart(containerIndex, chartIndex, 'title', e.target.value)}
          className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="X axis"
          value={chart.x}
          onChange={(e) => updateChart(containerIndex, chartIndex, 'x', e.target.value)}
          className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Y axis"
          value={chart.y}
          onChange={(e) => updateChart(containerIndex, chartIndex, 'y', e.target.value)}
          className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Group by (optional)"
          value={chart.group_by}
          onChange={(e) => updateChart(containerIndex, chartIndex, 'group_by', e.target.value)}
          className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 col-span-2"
        />
      </div>
    </div>
  );

  const FilterForm = ({ filter, index }) => (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Filter {index + 1}</h4>
        <button onClick={() => removeFilter(index)} className="text-red-500 hover:text-red-700">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-3">
        <select
          value={filter.type}
          onChange={(e) => updateFilter(index, 'type', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="multi_choice">Multi Choice</option>
          <option value="dropdown">Dropdown</option>
          <option value="date_range">Date Range</option>
          <option value="slider">Slider</option>
          <option value="text_box">Text Box</option>
        </select>
        <input
          type="text"
          placeholder="Filter ID"
          value={filter.filter_id}
          onChange={(e) => updateFilter(index, 'filter_id', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Label"
          value={filter.label}
          onChange={(e) => updateFilter(index, 'label', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Placeholder data (comma-separated)"
          value={filter.placeholder_data}
          onChange={(e) => updateFilter(index, 'placeholder_data', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const containerField = config.layout_type === 'minimal-reports' ? 'alleys' : 'lanes';
  const containerLabel = config.layout_type === 'minimal-reports' ? 'Alley' : 'Lane';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Layout Builder</h1>
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout Type</label>
            <select
              value={config.layout_type}
              onChange={(e) => {
                updateConfig('layout_type', e.target.value);
                setConfig(prev => ({ ...prev, alleys: [], lanes: [] }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="minimal-reports">Minimal Reports</option>
              <option value="jacket-reports">Jacket Reports</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Cards</h2>
              <button
                onClick={addCard}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus size={16} className="mr-1" />
                Add Card
              </button>
            </div>
            <div className="grid gap-4">
              {config.cards.map((card, index) => (
                <CardForm key={index} card={card} index={index} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{containerLabel}s</h2>
              <button
                onClick={addAlleyOrLane}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={16} className="mr-1" />
                Add {containerLabel}
              </button>
            </div>
            <div className="space-y-6">
              {config[containerField].map((container, containerIndex) => (
                <div key={containerIndex} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{containerLabel} {containerIndex + 1}</h3>
                    <button
                      onClick={() => removeAlleyOrLane(containerIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="mb-4">
                    <button
                      onClick={() => addChart(containerIndex)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Chart
                    </button>
                  </div>
                  <div className="space-y-3">
                    {container.charts.map((chart, chartIndex) => (
                      <ChartForm
                        key={chartIndex}
                        chart={chart}
                        containerIndex={containerIndex}
                        chartIndex={chartIndex}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <button
                onClick={addFilter}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus size={16} className="mr-1" />
                Add Filter
              </button>
            </div>
            <div className="grid gap-4">
              {config.filters.map((filter, index) => (
                <FilterForm key={index} filter={filter} index={index} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="include_data_table"
                checked={config.include_data_table}
                onChange={(e) => updateConfig('include_data_table', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include_data_table" className="ml-2 block text-sm text-gray-900">
                Include Data Table
              </label>
            </div>
          </div>

          <div className="pt-6 border-t">
            <button
              onClick={generateJSON}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate JSON
            </button>
          </div>

          {jsonOutput && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
              <pre className="text-sm">{jsonOutput}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilder;