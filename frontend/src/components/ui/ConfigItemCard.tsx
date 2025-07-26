// src/components/ui/ConfigItemCard.tsx
import React from 'react';
import Card from './Card';

interface ConfigItemCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const ConfigItemCard: React.FC<ConfigItemCardProps> = ({ children, className = '', ...props }) => (
  <Card
    hover
    padding="sm"
    className={`flex items-start gap-3 ${className}`}
    {...props}
  >
    {children}
  </Card>
);

export default ConfigItemCard;
