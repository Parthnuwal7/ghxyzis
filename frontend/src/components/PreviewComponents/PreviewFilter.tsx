import React from 'react';
import { FilterConfig } from '../../types/config';

interface PreviewFilterProps {
  filter: FilterConfig;
  compact?: boolean;
}

const PreviewFilter: React.FC<PreviewFilterProps> = ({ filter, compact = false }) => {
  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'dropdown': return '▼';
      case 'multichoice': return '☐';
      case 'date_range': return '📅';
      case 'slider': return '🎚️';
      case 'text_box': return '📝';
      default: return '🔧';
    }
  };

  if (compact) {
    return (
      <div className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
        <span>{getFilterIcon(filter.type)}</span>
        <span>{filter.label}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-2 rounded">
      <div className="text-xs font-medium text-gray-700 mb-1">{filter.label}</div>
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <span>{getFilterIcon(filter.type)}</span>
        <span>{filter.type}</span>
      </div>
    </div>
  );
};

export default PreviewFilter;
