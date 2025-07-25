// Older version V0.00
// import React from 'react';
// import LayoutBuilder from './components/LayoutBuilder';
// import { Plus, X, Download, Eye, Settings } from 'lucide-react';
// import './index.css';

// function App() {
//   return (
//     <div className="App">
//       <LayoutBuilder />
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import { Plus, X, Download, Eye, Settings } from 'lucide-react';

interface ChartConfig {
  type: string;
  title: string;
  x: string;
  y: string;
  group_by?: string;
  color?: string;
}

interface FilterConfig {
  type: string;
  label: string;
  id: string;
  options?: string[];
}

interface AlleyConfig {
  charts: ChartConfig[];
}

interface LaneConfig {
  charts: ChartConfig[];
}

interface LayoutConfig {
  layout: string;
  cards: string[];
  filters: FilterConfig[];
  alleys?: AlleyConfig[];
  lanes?: LaneConfig[];
  include_table: boolean;
}

const CHART_TYPES = ['bar', 'line', 'scatter', 'pie', 'area', 'histogram', 'heatmap'];
const FILTER_TYPES = ['dropdown', 'multi_choice', 'date_range', 'slider', 'text_box'];
const LAYOUT_TYPES = ['minimal-reports', 'jacket-reports'];

const DashboardBuilder: React.FC = () => {
  const [config, setConfig] = useState<LayoutConfig>({
    layout: 'minimal-reports',
    cards: ['sales', 'revenue', 'users'],
    filters: [],
    alleys: [{ charts: [] }],
    lanes: [{ charts: [] }],
    include_table: false
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const addFilter = () => {
    const newFilter: FilterConfig = {
      type: 'dropdown',
      label: 'New Filter',
      id: `filter_${Date.now()}`,
      options: ['Option 1', 'Option 2', 'Option 3']
    };
    setConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const updateFilter = (index: number, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, [field]: value } : filter
      )
    }));
  };

  const removeFilter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const addChart = (containerIndex: number, isLane: boolean = false) => {
    const newChart: ChartConfig = {
      type: 'bar',
      title: 'New Chart',
      x: 'category',
      y: 'value',
      color: '#8884d8'
    };

    if (isLane) {
      setConfig(prev => ({
        ...prev,
        lanes: prev.lanes?.map((lane, i) => 
          i === containerIndex 
            ? { ...lane, charts: [...lane.charts, newChart] }
            : lane
        ) || []
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        alleys: prev.alleys?.map((alley, i) => 
          i === containerIndex 
            ? { ...alley, charts: [...alley.charts, newChart] }
            : alley
        ) || []
      }));
    }
  };

  const updateChart = (containerIndex: number, chartIndex: number, field: string, value: any, isLane: boolean = false) => {
    if (isLane) {
      setConfig(prev => ({
        ...prev,
        lanes: prev.lanes?.map((lane, i) => 
          i === containerIndex 
            ? {
                ...lane,
                charts: lane.charts.map((chart, j) => 
                  j === chartIndex ? { ...chart, [field]: value } : chart
                )
              }
            : lane
        ) || []
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        alleys: prev.alleys?.map((alley, i) => 
          i === containerIndex 
            ? {
                ...alley,
                charts: alley.charts.map((chart, j) => 
                  j === chartIndex ? { ...chart, [field]: value } : chart
                )
              }
            : alley
        ) || []
      }));
    }
  };

  const removeChart = (containerIndex: number, chartIndex: number, isLane: boolean = false) => {
    if (isLane) {
      setConfig(prev => ({
        ...prev,
        lanes: prev.lanes?.map((lane, i) => 
          i === containerIndex 
            ? { ...lane, charts: lane.charts.filter((_, j) => j !== chartIndex) }
            : lane
        ) || []
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        alleys: prev.alleys?.map((alley, i) => 
          i === containerIndex 
            ? { ...alley, charts: alley.charts.filter((_, j) => j !== chartIndex) }
            : alley
        ) || []
      }));
    }
  };

  const addContainer = () => {
    if (config.layout === 'jacket-reports') {
      setConfig(prev => ({
        ...prev,
        lanes: [...(prev.lanes || []), { charts: [] }]
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        alleys: [...(prev.alleys || []), { charts: [] }]
      }));
    }
  };

  const addCard = () => {
    const cardName = prompt('Enter card name:');
    if (cardName) {
      setConfig(prev => ({
        ...prev,
        cards: [...prev.cards, cardName.toLowerCase().replace(/\s+/g, '_')]
      }));
    }
  };

  const removeCard = (index: number) => {
    setConfig(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  const generateCode = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Dashboard_${config.layout.replace('-', '_')}.tsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate code');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Error generating code');
    } finally {
      setIsGenerating(false);
    }
  };

  const PreviewCard: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-dashed border-gray-300">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <div className="text-2xl font-bold text-blue-600 mt-2">$12,345</div>
      <p className="text-sm text-gray-500 mt-1">+5.2% from last month</p>
    </div>
  );

  const PreviewChart: React.FC<{ chart: ChartConfig }> = ({ chart }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-dashed border-gray-300">
      <h4 className="font-semibold text-gray-700 mb-2">{chart.title}</h4>
      <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-gray-600">{chart.type.toUpperCase()} Chart</div>
          <div className="text-xs text-gray-500 mt-1">
            X: {chart.x} | Y: {chart.y}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    const containers = config.layout === 'jacket-reports' ? config.lanes : config.alleys;
    const isLane = config.layout === 'jacket-reports';

    return (
      <div className="bg-gray-50 p-4 rounded-lg h-full overflow-y-auto">
        <h3 className="font-semibold mb-4">Preview - {config.layout}</h3>
        
        {/* Cards */}
        <div className={`grid gap-4 mb-6 ${
          config.layout === 'jacket-reports' 
            ? 'grid-cols-12' 
            : `grid-cols-${Math.min(config.cards.length, 4)}`
        }`}>
          {config.layout === 'jacket-reports' ? (
            <>
              <div className="col-span-8">
                <div className={`grid grid-cols-${Math.min(config.cards.slice(0, 2).length, 2)} gap-4`}>
                  {config.cards.slice(0, 2).map((card, index) => (
                    <PreviewCard key={index} title={card} />
                  ))}
                </div>
              </div>
              <div className="col-span-4">
                <div className="grid grid-cols-1 gap-4">
                  {config.cards.slice(2).map((card, index) => (
                    <PreviewCard key={index + 2} title={card} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            config.cards.map((card, index) => (
              <PreviewCard key={index} title={card} />
            ))
          )}
        </div>

        {/* Charts */}
        <div className={`grid gap-4 ${
          isLane ? `grid-cols-${Math.min(containers?.length || 1, 4)}` : 'grid-cols-1'
        }`}>
          {containers?.map((container, containerIndex) => (
            <div key={containerIndex} className={isLane ? 'space-y-4' : `grid grid-cols-${Math.min(container.charts.length, 3)} gap-4 mb-4`}>
              {container.charts.map((chart, chartIndex) => (
                <PreviewChart key={chartIndex} chart={chart} />
              ))}
            </div>
          ))}
        </div>

        {/* Table Preview */}
        {config.include_table && (
          <div className="bg-white p-4 rounded-lg shadow-md border-2 border-dashed border-gray-300 mt-6">
            <h4 className="font-semibold text-gray-700 mb-2">Data Table</h4>
            <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-sm text-gray-600">Table with data rows</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Code Generator</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              <Eye size={16} />
              <span>{previewMode ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
            <button
              onClick={generateCode}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <Download size={16} />
              <span>{isGenerating ? 'Generating...' : 'Generate Code'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Configuration Panel */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Layout Selection */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Layout Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout Type
                  </label>
                  <select
                    value={config.layout}
                    onChange={(e) => setConfig(prev => ({ ...prev, layout: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {LAYOUT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.include_table}
                      onChange={(e) => setConfig(prev => ({ ...prev, include_table: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Include Data Table</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Cards</h2>
                <button
                  onClick={addCard}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Plus size={16} />
                  <span>Add Card</span>
                </button>
              </div>
              <div className="space-y-2">
                {config.cards.map((card, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <input
                      type="text"
                      value={card}
                      onChange={(e) => {
                        const newCards = [...config.cards];
                        newCards[index] = e.target.value;
                        setConfig(prev => ({ ...prev, cards: newCards }));
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeCard(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={addFilter}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Plus size={16} />
                  <span>Add Filter</span>
                </button>
              </div>
              <div className="space-y-4">
                {config.filters.map((filter, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Filter {index + 1}</h3>
                      <button
                        onClick={() => removeFilter(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={filter.type}
                          onChange={(e) => updateFilter(index, 'type', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          {FILTER_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={filter.label}
                          onChange={(e) => updateFilter(index, 'label', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                        <input
                          type="text"
                          value={filter.id}
                          onChange={(e) => updateFilter(index, 'id', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {(filter.type === 'dropdown' || filter.type === 'multi_choice') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma-separated)</label>
                          <input
                            type="text"
                            value={filter.options?.join(', ') || ''}
                            onChange={(e) => updateFilter(index, 'options', e.target.value.split(', ').filter(Boolean))}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {config.layout === 'jacket-reports' ? 'Lanes' : 'Alleys'}
                </h2>
                <button
                  onClick={addContainer}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Plus size={16} />
                  <span>Add {config.layout === 'jacket-reports' ? 'Lane' : 'Alley'}</span>
                </button>
              </div>
              
              {(config.layout === 'jacket-reports' ? config.lanes : config.alleys)?.map((container, containerIndex) => (
                <div key={containerIndex} className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">
                      {config.layout === 'jacket-reports' ? 'Lane' : 'Alley'} {containerIndex + 1}
                    </h3>
                    <button
                      onClick={() => addChart(containerIndex, config.layout === 'jacket-reports')}
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Plus size={14} />
                      <span>Add Chart</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {container.charts.map((chart, chartIndex) => (
                      <div key={chartIndex} className="p-3 bg-white rounded-md border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Chart {chartIndex + 1}</h4>
                          <button
                            onClick={() => removeChart(containerIndex, chartIndex, config.layout === 'jacket-reports')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={chart.type}
                              onChange={(e) => updateChart(containerIndex, chartIndex, 'type', e.target.value, config.layout === 'jacket-reports')}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                              {CHART_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={chart.title}
                              onChange={(e) => updateChart(containerIndex, chartIndex, 'title', e.target.value, config.layout === 'jacket-reports')}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">X Axis</label>
                            <input
                              type="text"
                              value={chart.x}
                              onChange={(e) => updateChart(containerIndex, chartIndex, 'x', e.target.value, config.layout === 'jacket-reports')}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Y Axis</label>
                            <input
                              type="text"
                              value={chart.y}
                              onChange={(e) => updateChart(containerIndex, chartIndex, 'y', e.target.value, config.layout === 'jacket-reports')}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                            <input
                              type="color"
                              value={chart.color || '#8884d8'}
                              onChange={(e) => updateChart(containerIndex, chartIndex, 'color', e.target.value, config.layout === 'jacket-reports')}
                              className="w-full p-1 h-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Group By (optional)</label>
                            <input
                              type="text"
                              value={chart.group_by || ''}
                              onChange={(e) => updateChart(containerIndex, chartIndex, 'group_by', e.target.value, config.layout === 'jacket-reports')}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 p-6 border-l border-gray-200">
          {previewMode ? renderPreview() : (
            <div className="bg-gray-50 p-8 rounded-lg h-full flex items-center justify-center">
              <div className="text-center">
                <Eye size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Preview Mode Disabled</h3>
                <p className="text-gray-500">Click "Show Preview" to see your dashboard layout</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilder;