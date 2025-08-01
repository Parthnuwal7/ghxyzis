// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md' 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div className={`
      bg-white border border-gray-200 rounded-xl shadow-sm
      ${hover ? 'hover:shadow-md hover:border-gray-300' : ''}
      ${paddingClasses[padding]}
      transition-all duration-200
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
