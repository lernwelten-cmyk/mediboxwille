/**
 * Card Component
 * Container for medication items and content sections
 */

import React from 'react';
import type { CardProps } from './Card.types';

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  padding = 'normal',
  elevated = true
}) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';
  const elevationClass = elevated ? 'shadow-lg hover:shadow-xl' : 'border-2 border-gray-200';
  const clickableClass = onClick ? 'cursor-pointer active:scale-[0.98]' : '';

  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${elevationClass} ${clickableClass} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
