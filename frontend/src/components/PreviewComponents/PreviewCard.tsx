import React from 'react';

interface PreviewCardProps {
  title: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ title }) => {
  return (
    <div className="bg-white border rounded p-2 shadow-sm">
      <div className="text-xs font-medium text-gray-800 mb-1">{title}</div>
      <div className="text-lg font-bold text-blue-600">1,234</div>
      <div className="text-xs text-gray-500">+5.2%</div>
    </div>
  );
};

export default PreviewCard;
