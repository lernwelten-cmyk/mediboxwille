/**
 * Button Component
 * Senior-friendly button with large touch targets and high contrast
 */

import React from 'react';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'large',
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-300',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-300'
  };

  const sizeClasses = {
    large: 'px-8 py-5 text-senior-lg min-h-touch',
    medium: 'px-6 py-4 text-senior-base',
    small: 'px-4 py-3 text-senior-sm'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {children}
    </button>
  );
};
