import React from 'react';
import { LayoutConfig } from '../types/config';
import PreviewCard from './PreviewComponents/PreviewCard';
import PreviewChart from './PreviewComponents/PreviewChart';
import PreviewFilter from './PreviewComponents/PreviewFilter';

interface PreviewPanelProps {
  config: LayoutConfig;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ config }) => {
  const sections = config.layout === 'minimal-reports' ? config.alleys : config.lanes;
  const isMinimal = config.layout === 'minimal-reports';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Live Preview</h2>
      
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
        {isMinimal ? (
          // Minimal Reports Layout
          <div className="space-y-4">
            {/* Cards Row */}
            <div className={`grid grid-cols-${Math.min(config.cards.length, 4)} gap-2`}>
              {config.cards.map((card, index) => (
                <PreviewCard key={index} title={card} />
              ))}
            </div>

            {/* Filters Sidebar + Alleys */}
            <div className="flex gap-4">
              {config.filters.length > 0 && (
                <div className="w-48 space-y-2">
                  <div className="text-xs font-medium text-gray-600 mb-2">Filters</div>
                  {config.filters.map((filter, index) => (
                    <PreviewFilter key={index} filter={filter} />
                  ))}
                </div>
              )}
              
              <div className="flex-1 space-y-2">
                {sections?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className={`grid grid-cols-${Math.min(section.charts.length, 3)} gap-2`}>
                    {section.charts.map((chart, chartIndex) => (
                      <PreviewChart key={chartIndex} chart={chart} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {config.include_table && (
              <div className="bg-blue-100 p-2 rounded text-xs text-center">Data Table</div>
            )}
          </div>
        ) : (
          // Jacket Reports Layout
          <div className="space-y-4">
            {/* Filters Bar */}
            {config.filters.length > 0 && (
              <div className="flex gap-2 pb-2 border-b">
                {config.filters.map((filter, index) => (
                  <PreviewFilter key={index} filter={filter} compact />
                ))}
              </div>
            )}

            {/* Split Cards */}
            <div className="grid grid-cols-4 gap-2">
              <div className={`col-span-3 grid grid-cols-${Math.ceil(config.cards.length * 0.75)} gap-2`}>
                {config.cards.slice(0, Math.ceil(config.cards.length * 0.75)).map((card, index) => (
                  <PreviewCard key={index} title={card} />
                ))}
              </div>
              <div className="space-y-2">
                {config.cards.slice(Math.ceil(config.cards.length * 0.75)).map((card, index) => (
                  <PreviewCard key={index} title={card} />
                ))}
              </div>
            </div>

            {/* Lanes */}
            <div className={`grid grid-cols-${Math.min(sections?.length || 1, 3)} gap-2`}>
              {sections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-2">
                  {section.charts.map((chart, chartIndex) => (
                    <PreviewChart key={chartIndex} chart={chart} />
                  ))}
                </div>
              ))}
            </div>

            {config.include_table && (
              <div className="bg-blue-100 p-2 rounded text-xs text-center">Data Table</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
